<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_element"
    @save="$emit('save', $event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__element">Element</span>
    </template>
    <template>
      <div class="g8-xml__popup__control">
        <input type="text" class="g8-xml--large" v-model="node.name" />
      </div>
      <div
        class="g8-xml__popup__attributes"
        v-if="node.attributes && node.attributes.length"
      >
        <div
          class="g8-xml__popup__attribute"
          v-for="(attr, idx) in node.attributes"
          :key="idx"
        >
          <span class="g8-xml__popup__control-label">{{ attr.name }}</span>
          <span class="g8-xml__popup__control">
            <input type="text" v-model="attr.value" @change="updateRaw()" />
          </span>
          <span class="g8-xml__popup__control_accessories"></span>
        </div>
      </div>
      <textarea v-model="raw" @change="rawChanged()"></textarea>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeElement } from './types';
import { objXml, xmlJs } from '../utils';

@Component({
  name: 'g8-xml-popup-element',
  components: { G8XmlPopup },
})
export default class G8XmlPopupElement extends Vue {
  @Prop() node!: XmlTreeElement;

  raw = '';

  created() {
    this.updateRaw();
  }

  updateRaw() {
    this.raw = objXml({ nodes: [this.node] });
  }

  rawChanged() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const obj = (xmlJs(this.raw) as XmlTreeElement).nodes![0] as XmlTreeElement;
    delete obj.parent;
    this.node.name = obj.name;
    this.node.attributes = obj.attributes;
    this.$forceUpdate();
  }
}
</script>
