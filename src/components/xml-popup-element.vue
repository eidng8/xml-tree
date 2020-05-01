<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_element"
    @save="save($event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__element">Element</span>
    </template>
    <template>
      <div class="g8-xml__popup__control-group">
        <div class="g8-xml__popup__control">
          <input type="text" class="g8-xml--large" v-model="node.name" />
        </div>
      </div>
      <div
        class="g8-xml__popup__attributes"
        v-if="node.attributes && node.attributes.length"
      >
        <div
          class="g8-xml__popup__control-group g8-xml__popup__attribute"
          v-for="(attr, idx) in node.attributes"
          :key="idx"
        >
          <span class="g8-xml__popup__control-label">
            <input type="text" v-model="attr.name" @change="updateRaw()" />
          </span>
          <span>=</span>
          <span class="g8-xml__popup__control">
            <input type="text" v-model="attr.value" @change="updateRaw()" />
          </span>
          <span class="g8-xml__popup__control__accessories">
            <button class="g8-xml__popup__control__accessory">&#215;</button>
          </span>
        </div>
      </div>
      <div class="g8-xml__popup__control-group">
        <button class="g8-xml__popup__control" @click="newAttribute()">
          Add Attribute
        </button>
      </div>
      <div class="g8-xml__popup__control-group">
        <textarea v-model="raw" @change="rawChanged()"></textarea>
      </div>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeElement } from './types';
import G8XmlPopupWithRaw from './xml-popup-with-raw';

@Component({
  name: 'g8-xml-popup-element',
  components: { G8XmlPopup },
})
export default class G8XmlPopupElement extends G8XmlPopupWithRaw {
  @Prop() node!: XmlTreeElement;

  // noinspection JSUnusedGlobalSymbols
  created(): void {
    this.updateRaw();
  }

  newAttribute(): void {
    if (!this.node.attributes) this.node.attributes = [];
    this.node.attributes.push({ name: '', value: '' });
    this.$forceUpdate();
  }
}
</script>
