<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_textual"
    @save="save($event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span
        :class="{
          'g8-xml__cdata': 'cdata' == node.type,
          'g8-xml__comment': 'comment' == node.type,
          'g8-xml__doctype': 'doctype' == node.type,
          'g8-xml__text': 'text' == node.type,
        }"
        >{{ node.type }}</span
      >
    </template>
    <template>
      <label class="g8-xml__popup__control-group">
        <textarea v-model="node[node.type]"></textarea>
      </label>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeCData, XmlTreeComment, XmlTreeText } from './types';
import G8XmlPopupClass from './xml-popup-class';

@Component({
  name: 'g8-xml-popup-textual',
  components: { G8XmlPopup },
})
export default class G8XmlPopupTextual extends G8XmlPopupClass {
  @Prop() node!: XmlTreeCData | XmlTreeComment | XmlTreeText;

  // noinspection JSUnusedGlobalSymbols
  mounted(): void {
    this.$nextTick(() => {
      // only useful if there is only one textarea in the box
      const e = this.$el.getElementsByTagName('textarea')[0];
      if (e) e.style.height = `${e.scrollHeight}px`;
    });
  }
}
</script>
