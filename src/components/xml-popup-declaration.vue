<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup @save="$emit('save', $event)" @close="$emit('close', $event)">
    <template v-slot:title>Declaration</template>
    <template>
      <div
        class="g8-xml__popup_attributes g8-xml__popup_declaration"
        v-if="node.attributes && node.attributes.length"
      >
        <div
          class="g8-xml__popup_attribute"
          v-for="(attr, idx) in node.attributes"
          :key="idx"
        >
          <label
            >{{ attr.name }} =
            <select v-model="attr.value" v-if="'standalone' == attr.name">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>
            <input type="text" v-model="attr.value" v-else />
          </label>
        </div>
      </div>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeDeclaration } from './types';

@Component({
  name: 'g8-xml-popup-declaration',
  components: { G8XmlPopup },
})
export default class G8XmlPopupDeclaration extends Vue {
  @Prop() node!: XmlTreeDeclaration;

  // noinspection JSUnusedGlobalSymbols
  created() {
    if (!this.node.attributes || !this.node.attributes.length) {
      this.node.attributes = [
        { name: 'version', value: '1.0' },
        { name: 'encoding', value: 'utf-8' },
        { name: 'standalone', value: 'no' },
      ];
      return;
    }
    const has = this.node.attributes.map(a => a.name);
    ['version', 'encoding', 'standalone']
      .filter(n => !has.includes(n))
      .forEach(n => this.node.attributes.push({ name: n, value: undefined }));
  }
}
</script>
