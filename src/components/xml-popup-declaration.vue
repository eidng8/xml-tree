<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup__declaration"
    @save="$emit('save', $event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__declaration">Declaration</span>
    </template>
    <template>
      <div
        class="g8-xml__popup__attributes"
        v-if="node.attributes && node.attributes.length"
      >
        <div
          class="g8-xml__popup__attribute"
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
    const has = this.node.attributes.map(a => a.name);
    ['version', 'encoding', 'standalone']
      .filter(n => !has.includes(n))
      .forEach(n => this.node.attributes.push({ name: n, value: undefined }));
  }
}
</script>
