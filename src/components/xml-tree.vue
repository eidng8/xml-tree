<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <ul class="g8-tree-view g8-tree__dark g8-tree__highlight_hover g8-xml-tree">
    <li class="g8-tree__node" v-if="tree.declaration">
      <div class="g8-tree__node_entry">
        <span class="g8-xml-tree__declaration"><span></span></span>
        <label
          v-for="(a, i) in tree.declaration.attributes || []"
          class="g8-tree__node_entry_tags_tag"
          :key="i"
          >{{ a.name }}={{ a.value }}</label
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
            'g8-xml-tree__cdata': 'cdata' == item.type,
            'g8-xml-tree__comment': 'comment' == item.type,
            'g8-xml-tree__doctype': 'doctype' == item.type,
            'g8-xml-tree__element': 'element' == item.type,
            'g8-xml-tree__instruction': 'instruction' == item.type,
            'g8-xml-tree__text': 'text' == item.type,
          }"
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
</template>

<script lang="ts">
import { xml2js } from 'xml-js';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8TreeView } from 'g8-vue-tree';
import { XmlNodeTypes, XmlTreeRoot } from './types';

@Component({
  name: 'g8-xml-tree',
  components: { G8TreeView },
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
  @Prop() private msg!: string;

  @Prop() xml!: string;

  @Prop({ default: false }) showAttrValue!: boolean;

  tree!: XmlTreeRoot;

  // noinspection JSUnusedGlobalSymbols
  created() {
    this.tree = xml2js(this.xml, {
      addParent: true,
      elementsKey: 'nodes',
      attributesFn: this.attributesAsArray,
    }) as XmlTreeRoot;
  }

  attributesAsArray(
    attributes: string | { [key: string]: string },
  ): { name: string; value: string }[] {
    if ('string' == typeof attributes) {
      throw new Error(`Expected object, but got string '${attributes}'`);
    }
    return Object.keys(attributes).map(name => ({
      name,
      value: attributes[name],
    }));
  }

  attributesAsObject(
    attributes: { name: string; value: string }[],
  ): { [key: string]: string } {
    const obj = {} as { [key: string]: string };
    attributes.forEach(a => (obj[a.name] = a.value));
    return obj;
  }
}
</script>
