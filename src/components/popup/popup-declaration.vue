<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup__declaration"
    @save="save($event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__declaration">{{ texts.declaration }}</span>
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
            <input
              type="text"
              v-else
              v-model="attr.value"
              @focus="$event.target.select()"
            />
          </label>
        </div>
      </div>
    </template>
  </popup-box>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import PopupBox from './popup-box.vue';
import { XmlDeclaration } from '../../types/types';
import PopupBoxMixin from '../../mixins/popup-box';

@Component({
  name: 'popup-declaration',
  components: { PopupBox },
})
export default class PopupDeclaration extends Mixins(PopupBoxMixin) {
  @Prop() protected node!: XmlDeclaration;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    const has = this.node.attributes.map(a => a.name);
    ['version', 'encoding', 'standalone']
      .filter(n => !has.includes(n))
      .forEach(n => this.node.attributes.push({ name: n, value: undefined }));
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    this.$nextTick(() => {
      const e = this.$el.querySelector('input');
      if (e) e.focus();
    });
  }
}
</script>
