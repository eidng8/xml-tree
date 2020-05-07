<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__container">
    <ul class="g8-tree__view g8-xml__tree" :class="themeCssClass">
      <li
        class="g8-tree__node"
        v-if="tree.declaration"
        @contextmenu.prevent="edit(tree.declaration)"
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
            @contextmenu.prevent="menu(item, $event)"
          >
            {{ item | tag(piUseAttribute) }}
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
      :class="themeCssClass"
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
  XmlEditDeclaration,
  XmlEditElement,
  XmlEditRoot,
  XmlNodeTypes,
} from './types';
import G8XmlPopupDeclaration from './xml-popup-declaration.vue';
import { cloneWithoutHierarchy, xmlJs } from '../utils';
import G8XmlPopupElement from './xml-popup-element.vue';
import { getTexts } from '../translations/translation';
import { map, remove } from 'lodash';
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
    tag(node: XmlNodeTypes, piUseAttribute: boolean): string {
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
  @Prop() xml!: string;

  @Prop({ default: false }) showAttrValue!: boolean;

  @Prop({ default: false }) piUseAttribute!: boolean;

  @Prop({ default: '' }) theme!: boolean;

  tree!: XmlEditRoot;

  currentNode?: XmlNodeTypes | XmlEditDeclaration | null;

  currentNodeParent?: XmlEditRoot | XmlEditElement;

  currentNodeIndex = -1;

  popupItem?: XmlNodeTypes | XmlEditDeclaration | null;

  popupOpen = false;

  texts = getTexts();

  nodeMenu?: G8MenuItem[];

  editingAttribute: XmlAttribute | null = null;

  get themeCssClass(): string[] {
    if (!this.theme) return [];
    return [`g8--${this.theme}`];
  }

  // noinspection JSUnusedGlobalSymbols
  created(): void {
    this.reloadXml();
  }

  reloadXml(): void {
    this.tree = xmlJs(this.xml, {
      instructionHasAttributes: this.piUseAttribute,
    }) as XmlEditRoot;
    if (
      !this.tree.declaration ||
      !this.tree.declaration.attributes ||
      !this.tree.declaration.attributes.length
    ) {
      this.tree.declaration = defaultDeclaration(this.tree);
    }
  }

  closePopup(): void {
    this.popupOpen = false;
  }

  menu(item: XmlNodeTypes, evt: MouseEvent): void {
    this.currentNode = item;
    this.nodeMenu = this.generateNodeMenu(item);
    (this.$refs.menu as G8PopupMenu).open(this.nodeMenu, evt);
  }

  action(menu: G8MenuItem): void {
    switch (menu.id) {
      case 'edit':
        this.edit(this.currentNode!);
        break;

      case 'remove':
        this.deleteNode();
        break;
    }
  }

  edit(item: XmlNodeTypes | XmlEditDeclaration): void {
    this.currentNode = item;
    this.currentNodeParent = item.parent;
    if ((item as XmlNodeTypes).type && this.currentNodeParent.nodes) {
      this.currentNodeIndex = this.currentNodeParent.nodes.indexOf(
        item as XmlNodeTypes,
      );
    } else {
      this.currentNodeIndex = -1;
    }
    this.popupItem = cloneWithoutHierarchy(item);
    this.popupOpen = true;
  }

  saveNode(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    if (!this.currentNode) throw new Error(this.texts.errNotEditing);
    if (!this.currentNodeParent) throw new Error(this.texts.errNodeParent);
    const newNode = Object.assign({}, this.currentNode, evt.data);
    if (isDeclarationNode(newNode)) {
      this.tree.declaration = newNode;
    } else if (this.currentNodeIndex < 0) {
      if (!this.currentNodeParent.nodes) this.currentNodeParent.nodes = [];
      this.currentNodeParent.nodes.push(newNode);
    } else {
      this.currentNodeParent.nodes![this.currentNodeIndex] = newNode;
    }
    this.closePopup();
  }

  editAttribute(attr: XmlAttribute): void {
    this.editingAttribute = attr;
  }

  closeAttributePopup(): void {
    this.editingAttribute = null;
  }

  generateNodeMenu(node: XmlNodeTypes): G8MenuItem[] {
    const subtitle = `< ${(node as XmlEditElement).name || node.type} >`;
    const menu = [
      { id: 'edit', label: this.texts.menuEdit, subtitle },
      { id: 'remove', label: this.texts.menuRemove, subtitle },
      { id: 'insert-after', label: this.texts.menuInsertAfter, subtitle },
      { id: 'insert-before', label: this.texts.menuInsertBefore, subtitle },
    ] as G8MenuItem[];
    if ('element' == node.type) {
      menu.push(
        { id: 'append-child', label: this.texts.menuAppend, subtitle },
        { id: 'prepend-child', label: this.texts.menuPrepend, subtitle },
      );
    }
    for (let idx = 2; idx < menu.length; idx++) {
      const item = menu[idx];
      item.children = map(
        ['CData', 'comment', 'element', 'instruction', 'text'],
        e =>
          ({
            id: `${item.id}-${e}`,
            label: e,
          } as G8MenuItem),
      );
    }
    return menu;
  }

  deleteNode(): void {
    const item = this.currentNode! as XmlNodeTypes;
    remove(item.parent!.nodes!, n => n === item);
    this.$forceUpdate();
  }
}
</script>
