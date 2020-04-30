<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__container">
    <ul class="g8-tree__view g8-tree__dark g8-xml__tree">
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
            >{{ a.name }}="{{ a.value }}"</label
          >
        </div>
      </li>
      <g8-tree-view
        v-for="(node, index) in tree.nodes || []"
        :key="index"
        :item="node"
        tags-key="attributes"
        children-key="nodes"
        tag-hint="value"
      >
        <template #default="{ item }">
          <span
            :class="{
              'g8-xml__cdata': 'cdata' == item.type,
              'g8-xml__comment': 'comment' == item.type,
              'g8-xml__doctype': 'doctype' == item.type,
              'g8-xml__element': 'element' == item.type,
              'g8-xml__instruction': 'instruction' == item.type,
              'g8-xml__text': 'text' == item.type,
            }"
            @contextmenu.prevent="edit(item)"
            >{{ item | tag }}</span
          >
        </template>
        <template #tag="{ item, tag }">
          <span
            ><span>{{ tag.name }}</span
            ><span v-if="showAttrValue">="{{ tag.value }}"</span></span
          >
        </template>
      </g8-tree-view>
    </ul>
    <g8-xml-popup-declaration
      v-if="popupOpen && !currentNode.type"
      :node="currentNode"
      @save="saveDeclaration()"
      @close="closePopup()"
    ></g8-xml-popup-declaration>
    <g8-xml-popup-element
      v-else-if="popupOpen && 'element' == currentNode.type"
      :node="currentNode"
      @save="saveNode()"
      @close="closePopup()"
    ></g8-xml-popup-element>
    <g8-xml-popup-instruction
      v-else-if="popupOpen && 'instruction' == currentNode.type"
      :node="currentNode"
      @save="saveNode()"
      @close="closePopup()"
    ></g8-xml-popup-instruction>
    <g8-xml-popup-textual
      v-else-if="popupOpen"
      :node="currentNode"
      @save="saveNode()"
      @close="closePopup()"
    ></g8-xml-popup-textual>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8TreeView } from 'g8-vue-tree';
import {
  XmlNodeTypes,
  XmlTreeDeclaration,
  XmlTreeElement,
  XmlTreeRoot,
} from './types';
import G8XmlPopupDeclaration from './xml-popup-declaration.vue';
import { cloneWithoutHierarchy, xmlJs } from '../utils';
import G8XmlPopupTextual from './xml-popup-textual.vue';
import G8XmlPopupElement from './xml-popup-element.vue';
import G8XmlPopupInstruction from './xml-popup-instruction.vue';

@Component({
  name: 'g8-xml-tree',
  components: {
    G8XmlPopupInstruction,
    G8XmlPopupElement,
    G8XmlPopupTextual,
    G8XmlPopupDeclaration,
    G8TreeView,
  },
  filters: {
    tag(node: XmlNodeTypes) {
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
          return node.name;
        case 'text':
          return node.text;
        default:
          return `~~~`;
      }
    },
  },
})
export default class G8XmlTree extends Vue {
  @Prop() xml!: string;

  @Prop({ default: false }) showAttrValue!: boolean;

  tree!: XmlTreeRoot;

  currentNode?: XmlNodeTypes | XmlTreeDeclaration | null;

  currentNodeParent?: XmlTreeRoot | XmlTreeElement;

  currentNodeIndex = -1;

  popupOpen = false;

  // noinspection JSUnusedGlobalSymbols
  created() {
    this.tree = xmlJs(this.xml) as XmlTreeRoot;
    if (
      !this.tree.declaration ||
      !this.tree.declaration.attributes ||
      !this.tree.declaration.attributes.length
    ) {
      this.tree.declaration = {
        attributes: [
          { name: 'version', value: '1.0' },
          { name: 'encoding', value: 'utf-8' },
          { name: 'standalone', value: 'no' },
        ],
        parent: this.tree,
      };
    }
  }

  saveDeclaration() {
    if (this.currentNode) {
      this.currentNode.parent = this.tree;
      this.tree.declaration = this.currentNode as XmlTreeDeclaration;
    }
    this.closePopup();
  }

  closePopup() {
    this.popupOpen = false;
  }

  edit(item: XmlNodeTypes | XmlTreeDeclaration) {
    this.currentNode = cloneWithoutHierarchy(item);
    this.currentNodeParent = item.parent;
    if ((item as XmlNodeTypes).type && this.currentNodeParent.nodes) {
      this.currentNodeIndex = this.currentNodeParent.nodes.indexOf(
        item as XmlNodeTypes,
      );
    } else {
      this.currentNodeIndex = -1;
    }
    this.popupOpen = true;
  }

  saveNode() {
    if (!this.currentNode) throw new Error('Invalid node');
    if (!this.currentNodeParent) throw new Error('Invalid node parent');
    this.currentNode.parent = this.currentNodeParent;
    if (this.currentNodeIndex < 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.currentNodeParent.nodes!.push(this.currentNode as XmlNodeTypes);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.currentNodeParent.nodes![this.currentNodeIndex] = this
        .currentNode as XmlNodeTypes;
    }
    this.closePopup();
  }
}
</script>
