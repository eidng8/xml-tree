<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_textual"
    @save="$emit('save', $event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span
        :class="{
          'g8-xml-tree__cdata': 'cdata' == node.type,
          'g8-xml-tree__comment': 'comment' == node.type,
          'g8-xml-tree__doctype': 'doctype' == node.type,
          'g8-xml-tree__text': 'text' == node.type,
        }"
        >{{ node.type }}</span
      >
    </template>
    <template>
      <label class="g8-xml__popup_control_group">
        <textarea v-model="node[node.type]"></textarea>
      </label>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { each } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeCData, XmlTreeComment, XmlTreeText } from './types';

@Component({
  name: 'g8-xml-popup-textual',
  components: { G8XmlPopup },
})
export default class G8XmlPopupTextual extends Vue {
  @Prop() node!: XmlTreeCData | XmlTreeComment | XmlTreeText;

  // noinspection JSUnusedGlobalSymbols
  mounted() {
    this.$nextTick(() => {
      // only useful if the textarea is the only field in the box
      each(
        this.$el.getElementsByTagName('textarea'),
        e => (e.style.height = `${e.scrollHeight}px`),
      );
    });
  }
}
</script>
