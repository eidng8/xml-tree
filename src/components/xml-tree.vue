<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <ul class="g8-tree-view g8-tree__dark g8-tree__highlight_hover">
    <li v-if="tree.declaration">
      <div>
        <span>&lt;?</span>
        <label
          v-for="(a, i) in tree.declaration.attributes || []"
          class="g8-tree__node_entry_tags_tag"
          :key="i"
        >
          {{ a.name }}={{ a.value }}
        </label>
        <span>?&gt;</span>
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
        <span>
          {{ item | tag }}
        </span>
      </template>
      <template #tag="{ item, tag }">
        <span>
          {{ tag.name }}
        </span>
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
  name: 'xml-tree',
  components: { G8TreeView },
  filters: {
    tag(node: XmlNodeTypes) {
      // editor treats string as xml tags, don't use backticks here
      switch (node.type) {
        case 'cdata':
          return '<![CDATA[' + node.cdata + ']]>';
        case 'comment':
          return '<!--' + node.comment + '-->';
        case 'element':
          return '<' + node.name + '>';
        case 'instruction':
          return '<? ' + node.name + ' ?>';
        case 'text':
          return node.text;
        default:
          return `~~~`;
      }
    },
  },
})
export default class XmlTree extends Vue {
  @Prop() private msg!: string;

  @Prop() xml!: string;

  tree!: XmlTreeRoot;

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import './xml-tree';
</style>
