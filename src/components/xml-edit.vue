<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__container">
    <ul class="g8-tree__view g8-xml__tree">
      <li
        class="g8-tree__node"
        v-if="tree.declaration"
        @contextmenu.prevent.stop="editDeclaration()"
      >
        <div class="g8-tree__node__entry">
          <span class="g8-xml__declaration"><span></span></span>
          <label
            v-for="(a, i) in tree.declaration.attributes || []"
            class="g8-tree__node__entry__tags__tag"
            :key="i"
          >
            {{ a.name }}="{{ a.value }}"
          </label>
        </div>
      </li>
      <g8-vue-tree
        v-for="(node, index) in tree.nodes || []"
        :key="index"
        :item="node"
        tags-key="attributes"
        children-key="nodes"
        tag-hint="value"
        @click="setCurrentNode($event.data.item, $event.data.expanded)"
      >
        <template #default="{ item }">
          <span
            :class="[`g8-xml__${item.type}`]"
            @contextmenu.prevent.stop="openMenu(item, $event)"
          >
            {{ item | nodeTag(piUseAttribute) }}
          </span>
        </template>
        <template #tag="{ item, tag }">
          <span @contextmenu.prevent.stop="editAttribute(item, tag)">
            <span>{{ tag.name }}</span>
            <span v-if="showAttrValue">="{{ tag.value }}"</span>
          </span>
        </template>
      </g8-vue-tree>
    </ul>
    <popup-declaration
      v-if="popupOpen && !popupItem.type"
      :node="popupItem"
      @save="saveNode($event)"
      @close="closePopup()"
    ></popup-declaration>
    <popup-node
      v-else-if="popupOpen"
      :node="popupItem"
      @save="saveNode($event)"
      @close="closePopup()"
    ></popup-node>
    <popup-attribute
      v-if="editingAttribute"
      :attribute="editingAttribute"
      @save="saveAttributePopup($event)"
      @close="closeAttributePopup()"
    ></popup-attribute>
    <!--
    A menu item has been selected.
    @event menu-open
    @type {MenuOpenEvent}
    -->
    <node-menu
      class="g8-menu g8-menu--off"
      ref="menu"
      @menu-open="$emit('menu-open', $event)"
      @select="action($event)"
    />
  </div>
</template>

<script lang="ts">
import { findIndex, remove } from 'lodash';
import { Options } from 'xml-js';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8VueTree } from 'g8-vue-tree';
import { G8MenuItem, G8PopupMenu } from 'g8-popup-menu';
import {
  XmlAttribute,
  XmlDeclaration,
  XmlElement,
  XmlInstruction,
  XmlNode,
  XmlNodeTypes,
  XmlRoot,
} from '../types/types';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  SaveNodePopupEvent,
} from '../types/events';
import {
  createEmptyNode,
  defaultDeclaration,
  dehydrate,
  objXml,
  xmlJs,
} from '../utils/utils';
import PopupAttribute from './popup/popup-attribute.vue';
import PopupDeclaration from './popup/popup-declaration.vue';
import PopupNode from './popup/popup-node.vue';
import NodeMenu from './menus/node-menu.vue';
import DefaultDeclarationEvent from '../events/default-declaration';
import { isDeclarationNode } from '../utils/type-guards';
import XmlReloadEvent from '../events/xml-reload';
import SelectNodeEvent from '../events/select-node';
import EditNodeEvent from '../events/edit-node';
import SaveNodeEvent from '../events/save-node';
import DeclarationChangedEvent from '../events/declaration-changed';
import NodeChangedEvent from '../events/node-changed';
import NodeCreatedEvent from '../events/node-created';
import EditAttributeEvent from '../events/edit-attribute';
import SaveAttributeEvent from '../events/save-attribute';
import AttributeChangedEvent from '../events/attribute-changed';
import DeleteNodeEvent from '../events/delete-node';
import NodeRemovedEvent from '../events/node-removed';

/**
 * Presents an XML document in tree view for editing.
 *
 * ## Installation
 *
 * ```bash
 * npm i -S g8-xml-edit
 * ```
 *
 * ## Usage
 *
 * ```html
 * <g8-xml-edit :xml="xml" />
 * ```
 */
@Component({
  name: 'g8-xml-edit',
  components: {
    NodeMenu,
    PopupAttribute,
    PopupNode,
    PopupDeclaration,
    G8VueTree,
    G8PopupMenu,
  },
  filters: {
    nodeTag(node: XmlNode, piUseAttribute: boolean): string {
      switch (node.type) {
        case 'cdata':
          return node.cdata;
        case 'comment':
          return node.comment;
        case 'doctype':
          return node.doctype;
        case 'element':
          return node.name;
        case 'instruction':
          if (piUseAttribute) return node.name;
          return `${node.name} ${node.instruction}`;
        case 'text':
          return node.text;
        /* istanbul ignore next: unable to unit test */
        default:
          /* istanbul ignore next: unable to unit test */
          return `~~~`;
      }
    },
  },
})
export default class G8XmlEdit extends Vue {
  /**
   * Whether to show attribute value in tree item badges.
   * @values true, false
   */
  @Prop({ default: false, required: false }) private showAttrValue!: boolean;

  /**
   * Set to `false` to treat processing instruction as text;
   * or `true` to facilitate attributes.
   * @values true, false
   */
  @Prop({ default: false, required: false }) private piUseAttribute!: boolean;

  /**
   * Input XML content. This component doesn't mutate the input XML content.
   * @values XML string
   */
  @Prop({ required: true }) private xml!: string;

  /**
   * Object representation of the {@link xml}.
   */
  private tree!: XmlRoot;

  /**
   * The node being clicked.
   */
  private currentNode?: XmlNode | XmlDeclaration | null;

  /**
   * Parent node of the {@link currentNode}.
   */
  private currentNodeParent?: XmlRoot | XmlElement | null;

  /**
   * Numeric index of the {@link currentNode} in its parent's children array.
   */
  private currentNodeIndex = -1;

  /**
   * Whether a new node is being created
   */
  private creatingNode = false;

  /**
   * The node being edited in popup box.
   */
  private popupItem?: XmlNode | XmlDeclaration | null;

  /**
   * Whether popup box is shown.
   */
  private popupOpen = false;

  /**
   * The attribute being edited in popup box.
   */
  private editingAttribute: XmlAttribute | null = null;

  /**
   * Returns default XML declaration.
   */
  getDefaultDeclaration(): XmlDeclaration {
    const evt = new DefaultDeclarationEvent({
      detail: { document: this.tree, declaration: this.tree.declaration },
    });
    /**
     * Emitted when the input XML document doesn't have declaration.
     * @event default-declaration
     * @type {DefaultDeclarationEvent}
     */
    this.$emit(DefaultDeclarationEvent.TYPE, evt);
    if (evt.defaultPrevented) return evt.detail.declaration;
    if (evt.detail.declaration) {
      return Object.assign({ parent: this.tree }, evt.detail.declaration);
    }
    return Object.assign({}, defaultDeclaration(this.tree));
  }

  /**
   * Reloads the {@link xml} content. All modifications to current {@link tree}
   * will be lost.
   */
  reloadXml(): void {
    this.tree = xmlJs(this.xml, {
      instructionHasAttributes: this.piUseAttribute,
    }) as XmlRoot;
    if (
      !this.tree.declaration ||
      !this.tree.declaration.attributes ||
      !this.tree.declaration.attributes.length
    ) {
      this.tree.declaration = this.getDefaultDeclaration();
    }
    /**
     * Emits when XML document has been reloaded. The `detail.document` field
     * holds the newly loaded XML object.
     * Please note that this event is fired only when {@see reloadXml} is
     * called. Changing the {@see xml} property will *not* trigger this event.
     * @event xml-reload
     * @type {XmlReloadEvent}
     */
    this.$emit(XmlReloadEvent.TYPE, new XmlReloadEvent({ detail: this.tree }));
  }

  toString(options?: Options.JS2XML): string {
    return objXml(this.tree, options);
  }

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.reloadXml();
  }

  /**
   * Sets the node to be acted upon.
   */
  private setCurrentNode(
    item: XmlNode | XmlDeclaration,
    expanded?: boolean,
  ): void {
    this.currentNode = item;
    this.currentNodeParent = item.parent!;
    this.currentNodeIndex = findIndex(
      this.currentNodeParent.nodes,
      n => n === item,
    );
    /**
     * Emitted when a node in the tree view has been selected.
     * @event select-node
     * @type {SelectNodeEvent}
     */
    this.$emit(
      SelectNodeEvent.TYPE,
      new SelectNodeEvent({
        detail: {
          node: this.currentNode,
          parent: this.currentNodeParent,
          index: this.currentNodeIndex,
          expanded,
        },
      }),
    );
  }

  /**
   * Close the popup box.
   */
  private closePopup(): void {
    this.popupOpen = false;
    this.popupItem = null;
  }

  /**
   * Pops up context menu.
   * @param item
   * @param evt
   */
  private openMenu(item: XmlNode, evt: MouseEvent): void {
    this.setCurrentNode(item);
    // eslint-disable-next-line
    (this.$refs.menu as any).open(
      this.currentNode,
      this.currentNode!.parent === this.tree,
      evt,
    );
  }

  /**
   * Handles context menu actions.
   * @param menu
   */
  private action(menu: G8MenuItem): void {
    switch (menu.id) {
      case 'g8-xml-menu-edit':
        this.editNode(this.currentNode!);
        break;

      case 'g8-xml-menu-remove':
        this.deleteNode();
        break;

      default:
        this.insertNode(menu.id!);
    }
  }

  /**
   * Pops up a box to edit the XML declaration. It operates on a clone of the node.
   */
  private editDeclaration(): void {
    this.setCurrentNode(this.tree.declaration);
    this.editNode(this.tree.declaration);
  }

  /**
   * Pops up a box to edit the `node`. It operates on a clone of the node.
   * @param node
   */
  private editNode(node: XmlNode | XmlDeclaration): void {
    const evt = new EditNodeEvent({
      detail: {
        document: this.tree,
        node,
        parent: this.currentNodeParent!,
        index: this.currentNodeIndex,
        creating: this.creatingNode,
      },
    });
    /**
     * A node is about to be edited.
     * @event edit-node
     * @type {EditNodeEvent}
     */
    this.$emit(EditNodeEvent.TYPE, evt);
    if (evt.defaultPrevented) return;
    this.popupItem = evt.detail.node;
    this.popupOpen = true;
  }

  /**
   * Saves the node given by the event.
   * @param evt
   */
  private saveNode(evt: SaveNodePopupEvent): void {
    const svt = new SaveNodeEvent({
      detail: {
        document: this.tree,
        node: evt.data as XmlNode | XmlDeclaration,
        parent: this.currentNodeParent!,
        index: this.currentNodeIndex,
        creating: this.creatingNode,
      },
    });
    /**
     * A node is about to be saved.
     * @event save-node
     * @type {SaveNodeEvent}
     */
    this.$emit(SaveNodeEvent.TYPE, svt);
    if (svt.defaultPrevented) return;
    const newNode = this.processChangedNode(
      svt.detail.node as XmlNode | XmlDeclaration,
    );
    if (isDeclarationNode(newNode)) {
      this.saveDeclaration(newNode);
    } else if (this.creatingNode) {
      this.saveNewNode(newNode);
    } else {
      this.saveChangedNode(newNode);
    }
    this.closePopup();
  }

  /**
   * Process the changed node before adding to tree.
   */
  private processChangedNode(
    node: XmlNode | XmlDeclaration,
  ): XmlNode | XmlDeclaration {
    const newNode = Object.assign(
      {},
      this.creatingNode ? { parent: this.currentNodeParent } : this.currentNode,
      node,
    ) as XmlNode | XmlDeclaration;
    dehydrate(newNode);
    return newNode;
  }

  /**
   * Saves the given declaration.
   * @param declaration
   */
  private saveDeclaration(declaration: XmlDeclaration): void {
    this.tree.declaration = declaration;
    /**
     * The XML declaration has been changed.
     * @event declaration-changed
     * @type {DeclarationChangedEvent}
     */
    this.$emit(
      DeclarationChangedEvent.TYPE,
      new DeclarationChangedEvent({ detail: declaration }),
    );
  }

  /**
   * Save the given node.
   * @param node
   */
  private saveChangedNode(node: XmlNode): void {
    this.currentNodeParent!.nodes![this.currentNodeIndex] = node;
    /**
     * An XML node has been changed.
     * @event node-changed
     * @type {NodeChangedEvent}
     */
    this.$emit(NodeChangedEvent.TYPE, new NodeChangedEvent({ detail: node }));
  }

  /**
   * Saves the newly created node.
   * @param node
   */
  private saveNewNode(node: XmlNode): void {
    const p = this.currentNodeParent! as XmlElement;
    /* istanbul ignore if: unable to unit test */
    if (!p.nodes) p.nodes = [];
    node.parent = p;
    p.nodes.splice(Math.max(this.currentNodeIndex, 0), 0, node);
    // mutation doesn't trigger rendering, calling `$forceUpdate()` on the whole
    // component may be too costly, so we just force the corresponding node
    // to render by placing a new instance at the spot.
    const gp = p.parent;
    if (gp) {
      gp.nodes!.splice(
        findIndex(gp.nodes, n => n === p),
        1,
        Object.assign({}, p),
      );
    }
    /**
     * A new XML node has been created.
     * @event node-created
     * @type {NodeCreatedEvent}
     */
    this.$emit(NodeCreatedEvent.TYPE, new NodeCreatedEvent({ detail: node }));
    this.creatingNode = false;
  }

  /**
   * Pops up a box to edit the given attribute.
   * @param item
   * @param attr
   */
  private editAttribute(item: XmlNode, attr: XmlAttribute): void {
    this.setCurrentNode(item);
    const evt = new EditAttributeEvent({
      detail: {
        document: this.tree,
        node: item as XmlElement | XmlInstruction,
        attribute: attr,
      },
    });
    /**
     * An attribute is about to be edited.
     * @event edit-attribute
     * @type {EditAttributeEvent}
     */
    this.$emit(EditAttributeEvent.TYPE, evt);
    if (evt.defaultPrevented) return;
    this.editingAttribute = evt.detail.attribute;
  }

  /**
   * Closes the attributes edit box.
   */
  private saveAttributePopup(
    evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent,
  ): void {
    dehydrate(this.currentNode!);
    const svt = new SaveAttributeEvent({
      detail: {
        document: this.tree,
        node: this.currentNode! as XmlElement | XmlInstruction,
        attribute: evt.data as XmlAttribute,
      },
    });
    /**
     * An attribute is about to be saved.
     * @event save-attribute
     * @type {SaveAttributeEvent}
     */
    this.$emit(SaveAttributeEvent.TYPE, svt);
    if (svt.defaultPrevented) return;
    const attributes = (this.currentNode! as XmlElement).attributes!;
    const attribute = svt.detail.attribute;
    const idx = findIndex(attributes, a => attribute.name == a.name);
    attributes[idx] = attribute;
    /**
     * A XML node attribute has been changed.
     * @event attribute-changed
     * @type {AttributeChangedEvent}
     */
    this.$emit(
      AttributeChangedEvent.TYPE,
      new AttributeChangedEvent({
        detail: { document: this.tree, node: svt.detail.node, attribute },
      }),
    );
  }

  /**
   * Closes the attributes edit box.
   */
  private closeAttributePopup(): void {
    this.editingAttribute = null;
  }

  /**
   * Delete the {@link currentNode}.
   */
  private deleteNode(): void {
    const event = new DeleteNodeEvent({
      detail: {
        document: this.tree,
        node: this.currentNode!,
        parent: this.currentNodeParent!,
        index: this.currentNodeIndex,
      },
    });
    /**
     * A node is about to be deleted.
     * @event delete-node
     * @type {DeleteNodeEvent}
     */
    this.$emit(DeleteNodeEvent.TYPE, event);
    if (event.defaultPrevented) return;
    const node = this.currentNode!;
    remove(node.parent!.nodes!, n => n === node);
    this.$forceUpdate();
    dehydrate(node);
    /**
     * A new XML node has been deleted.
     * @event node-removed
     * @type {NodeRemovedEvent}
     */
    this.$emit(
      NodeRemovedEvent.TYPE,
      new NodeRemovedEvent({ detail: node as XmlNode }),
    );
  }

  /**
   * Handles insertion menu commands.
   * @param action
   */
  private insertNode(action: string): void {
    const actions = action.split('-').slice(3);
    this.creatingNode = true;
    if ('insert' == actions[0]) {
      this.currentNodeParent = this.currentNode!.parent! as
        | XmlElement
        | XmlRoot;
      this.currentNodeIndex = findIndex(
        this.currentNodeParent.nodes,
        n => n === this.currentNode!,
      );
      if ('after' == actions[1]) this.currentNodeIndex++;
    } else {
      this.currentNodeParent = this.currentNode! as XmlElement | XmlRoot;
      if ('prepend' == actions[0]) {
        this.currentNodeIndex = -1;
      } else {
        this.currentNodeIndex = this.currentNodeParent.nodes!.length;
      }
    }
    this.currentNode = createEmptyNode(
      actions[2].toLowerCase() as XmlNodeTypes,
      this.piUseAttribute,
    );
    this.editNode(this.currentNode);
  }
}
</script>
