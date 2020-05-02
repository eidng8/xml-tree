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
      <span :class="[`g8-xml__${node.type || 'declaration'}`]">
        {{ texts[node.type || 'declaration'] }}
      </span>
    </template>
    <template>
      <div class="g8-xml__popup__name" v-if="node.name">
        <div class="g8-xml__popup__control-group">
          <div class="g8-xml__popup__control">
            <input
              type="text"
              tabindex="999"
              class="g8-xml--large"
              v-model="node.name"
            />
          </div>
        </div>
      </div>
      <div v-if="node.attributes">
        <div class="g8-xml__popup__attributes">
          <div class="g8-xml__popup__separator">
            <span>{{ texts.attributes }}</span>
          </div>
          <div
            class="g8-xml__popup__control-group g8-xml__popup__attribute"
            v-for="(attr, idx) in node.attributes"
            :key="idx"
          >
            <span class="g8-xml__popup__control-label">
              <input
                type="text"
                :tabindex="1000 + idx * 3"
                v-model="attr.name"
                @change="updateRaw()"
              />
            </span>
            <span>=</span>
            <span class="g8-xml__popup__control">
              <input
                type="text"
                :tabindex="1001 + idx * 3"
                v-model="attr.value"
                @change="updateRaw()"
              />
            </span>
            <span class="g8-xml__popup__control__accessories">
              <button
                class="g8-xml__popup__control__accessory"
                :tabindex="1002 + idx * 3"
                @click="deleteAttribute(idx)"
              >
                &#215;
              </button>
            </span>
          </div>
        </div>
        <div class="g8-xml__popup__control-group">
          <button
            class="g8-xml__popup__control"
            tabindex="9997"
            @click="newAttribute()"
          >
            {{ texts.addAttribute }}
          </button>
        </div>
      </div>
      <div class="g8-xml__popup__control-group" v-else>
        <textarea
          tabindex="1000"
          class="g8-xml__popup__control"
          v-model="node[node.type]"
        ></textarea>
      </div>
      <div class="g8-xml__popup__raw">
        <div class="g8-xml__popup__separator">
          <span>{{ texts.raw }}</span>
        </div>
        <div class="g8-xml__popup__control-group">
          <textarea
            tabindex="9998"
            class="g8-xml__popup__control"
            v-model="raw"
            @change="rawChanged()"
          ></textarea>
        </div>
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
}
</script>
