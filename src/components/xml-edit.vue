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
        @contextmenu.prevent.stop="editNode(tree.declaration)"
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
      >
        <template #default="{ item }">
          <span
            :class="[`g8-xml__${item.type}`]"
            @contextmenu.prevent.stop="openMenu(item, $event)"
          >
            {{ item | badge(piUseAttribute) }}
          </span>
        </template>
        <template #tag="{ item, tag }">
          <span @contextmenu.prevent.stop="editAttribute(tag)">
            <span>{{ tag.name }}</span>
            <span v-if="showAttrValue">="{{ tag.value }}"</span>
          </span>
        </template>
      </g8-vue-tree>
    </ul>
    <g8-xml-popup-declaration
      v-if="popupOpen && !currentNode.type"
      :node="popupItem"
      @save="saveNode($event)"
      @close="closePopup()"
    ></g8-xml-popup-declaration>
    <g8-xml-popup-element
      v-else-if="popupOpen"
      :node="popupItem"
      @save="saveNode($event)"
      @close="closePopup()"
    ></g8-xml-popup-element>
    <g8-xml-popup-attribute
      v-if="editingAttribute"
      :attribute="editingAttribute"
      @close="closeAttributePopup()"
    ></g8-xml-popup-attribute>
    <g8-popup-menu
      class="g8-menu g8-menu--off"
      ref="menu"
      @select="action($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8VueTree } from 'g8-vue-tree';
import { G8MenuItem, G8PopupMenu } from 'g8-popup-menu';
import {
  defaultDeclaration,
  isDeclarationNode,
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlAttribute,
  XmlDeclaration,
  XmlElement,
  XmlNode,
  XmlNodeTypes,
  XmlRoot,
} from './types';
import G8XmlPopupDeclaration from './xml-popup-declaration.vue';
import { cloneWithoutHierarchy, createEmptyNode, xmlJs } from '../utils';
import G8XmlPopupElement from './xml-popup-element.vue';
import { getTexts } from '../translations/translation';
import { findIndex, map, remove } from 'lodash';
import G8XmlPopupAttribute from './xml-popup-attribute.vue';

@Component({
  name: 'g8-xml-edit',
  components: {
    G8XmlPopupAttribute,
    G8XmlPopupElement,
    G8XmlPopupDeclaration,
    G8VueTree,
    G8PopupMenu,
  },
  filters: {
    badge(node: XmlNode, piUseAttribute: boolean): string {
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
        default:
          return `~~~`;
      }
    },
  },
})
export default class G8XmlEdit extends Vue {
  /**
   * Whether to show attribute value in tree item badges.
   */
  @Prop({ default: false }) private showAttrValue!: boolean;

  /**
   * Set to `false` to treats the entire processing instruction as text;
   * or `true` to facilitate attributes.
   */
  @Prop({ default: false }) private piUseAttribute!: boolean;

  /**
   * XML content
   */
  @Prop() private xml!: string;

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
   * Texts translation
   */
  private texts = getTexts();

  /**
   * The popup menu content related to {@link currentNode}.
   */
  private nodeMenu?: G8MenuItem[];

  /**
   * The attribute being edited in popup box.
   */
  private editingAttribute: XmlAttribute | null = null;

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
      this.tree.declaration = defaultDeclaration(this.tree);
    }
  }

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.reloadXml();
  }

  /**
   * Close the popup box.
   */
  private closePopup(): void {
    this.popupOpen = false;
    this.popupItem = null;
    this.currentNode = null;
    this.currentNodeIndex = -1;
    this.currentNodeParent = null;
  }

  /**
   * Pops up context menu.
   * @param item
   * @param evt
   */
  private openMenu(item: XmlNode, evt: MouseEvent): void {
    this.currentNode = item;
    this.currentNodeParent = item.parent!;
    if (this.currentNodeParent.nodes) {
      this.currentNodeIndex = findIndex(
        this.currentNodeParent.nodes,
        n => n === item,
      );
    } else {
      this.currentNodeIndex = -1;
    }
    this.nodeMenu = this.generateNodeMenu(item);
    (this.$refs.menu as G8PopupMenu).open(this.nodeMenu, evt);
  }

  /**
   * Generate context menu according to `node`.
   * @param node
   */
  private generateNodeMenu(node: XmlNode): G8MenuItem[] {
    const subtitle = `< ${(node as XmlElement).name || node.type} >`;
    const menu = [
      { id: 'g8-xml-menu-edit', label: this.texts.menuEdit, subtitle },
      { label: '---' },
      { id: 'g8-xml-menu-remove', label: this.texts.menuRemove, subtitle },
      { label: '---' },
      {
        id: 'g8-xml-menu-insert-after',
        label: this.texts.menuInsertAfter,
        subtitle,
      },
      {
        id: 'g8-xml-menu-insert-before',
        label: this.texts.menuInsertBefore,
        subtitle,
      },
    ] as G8MenuItem[];
    if ('element' == node.type) {
      menu.push(
        {
          id: 'g8-xml-menu-append-child',
          label: this.texts.menuAppend,
          subtitle,
        },
        {
          id: 'g8-xml-menu-prepend-child',
          label: this.texts.menuPrepend,
          subtitle,
        },
      );
    }
    for (let idx = 4; idx < menu.length; idx++) {
      const item = menu[idx];
      const nodes =
        node.parent === this.tree
          ? ['CData', 'comment', 'instruction']
          : ['CData', 'comment', 'element', 'instruction', 'text'];
      item.children = map(
        nodes,
        e =>
          ({
            id: `${item.id}-${e}`,
            label: e,
          } as G8MenuItem),
      );
    }
    if ('element' == node.type && node.parent === this.tree) menu.splice(1, 2);
    return menu;
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
   * Pops up a box to edit the `node`. It operates on a clone of the node.
   * @param node
   */
  private editNode(node: XmlNode | XmlDeclaration): void {
    this.popupItem = cloneWithoutHierarchy(node);
    this.popupOpen = true;
  }

  /**
   * Saves the node given by the event.
   * @param evt
   */
  private saveNode(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    if (!this.currentNode) throw new Error(this.texts.errNotEditing);
    if (!this.currentNodeParent) throw new Error(this.texts.errNodeParent);
    const newNode = Object.assign(
      {},
      this.creatingNode ? { parent: this.currentNodeParent } : this.currentNode,
      evt.data,
    ) as XmlNode | XmlDeclaration;
    if (isDeclarationNode(newNode)) {
      this.tree.declaration = newNode;
    } else if (this.creatingNode) {
      this.saveNewNode(newNode);
    } else {
      this.currentNodeParent.nodes![this.currentNodeIndex] = newNode;
    }
    this.closePopup();
  }

  /**
   * Saves the newly created node.
   * @param node
   */
  private saveNewNode(node: XmlNode): void {
    const p = this.currentNodeParent! as XmlElement;
    if (!p.nodes) p.nodes = [];
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
  }

  /**
   * Pops up a box to edit the given attribute.
   * @param attr
   */
  private editAttribute(attr: XmlAttribute): void {
    this.editingAttribute = attr;
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
    const item = this.currentNode! as XmlNode;
    remove(item.parent!.nodes!, n => n === item);
    this.$forceUpdate();
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
        this.currentNodeIndex = this.currentNodeParent.nodes
          ? this.currentNodeParent.nodes.length
          : -1;
      }
    }
    this.editNode(
      createEmptyNode(
        actions[2].toLowerCase() as XmlNodeTypes,
        this.piUseAttribute,
      ),
    );
  }
}
</script>
