<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_instruction"
    @save="save($event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__instruction">{{ node.type }}</span>
    </template>
    <template>
      <div class="g8-xml__popup__control-group">
        <div class="g8-xml__popup__control">
          <input type="text" class="g8-xml--large" v-model="node.name" />
        </div>
      </div>
      <div
        class="g8-xml__popup__control-group"
        v-if="node.attributes && node.attributes.length"
      >
        <div class="g8-xml__popup__attributes">
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
      </div>
      <div class="g8-xml__popup__control-group" v-else>
        <textarea
          class="g8-xml__popup__control"
          v-model="node[node.type]"
        ></textarea>
      </div>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeInstruction } from './types';
import G8XmlPopupWithRaw from './xml-popup-with-raw';

@Component({
  name: 'g8-xml-popup-instruction',
  components: { G8XmlPopup },
})
export default class G8XmlPopupInstruction extends G8XmlPopupWithRaw {
  @Prop() node!: XmlTreeInstruction;

  // noinspection JSUnusedGlobalSymbols
  created(): void {
    this.updateRaw();
  }
}
</script>
