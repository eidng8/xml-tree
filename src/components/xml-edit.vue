<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__container">
    <ul class="g8-tree__view g8-tree--dark g8-xml__tree">
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
            @contextmenu.prevent="edit(item)"
          >
            {{ item | tag(piUseAttribute) }}
          </span>
        </template>
        <template #tag="{ item, tag }">
          <span>
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
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8VueTree } from 'g8-vue-tree';
import {
  defaultDeclaration,
  isDeclarationNode,
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlEditDeclaration,
  XmlEditElement,
  XmlEditRoot,
  XmlNodeTypes,
} from './types';
import G8XmlPopupDeclaration from './xml-popup-declaration.vue';
import { cloneWithoutHierarchy, xmlJs } from '../utils';
import G8XmlPopupElement from './xml-popup-element.vue';
import { getTexts } from '../translations/translation';

@Component({
  name: 'g8-xml-edit',
  components: {
    G8XmlPopupElement,
    G8XmlPopupDeclaration,
    G8VueTree,
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

  tree!: XmlEditRoot;

  currentNode?: XmlNodeTypes | XmlEditDeclaration | null;

  currentNodeParent?: XmlEditRoot | XmlEditElement;

  currentNodeIndex = -1;

  popupItem?: XmlNodeTypes | XmlEditDeclaration | null;

  popupOpen = false;

  texts = getTexts();

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
}
</script>
