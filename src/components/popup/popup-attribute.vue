<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup_element"
    @save="save($event)"
    @close="cancel($event)"
  >
    <template v-slot:title>
      <span class="g8-xml__attribute">
        {{ texts.attribute }}
      </span>
    </template>
    <template>
      <div class="g8-xml__popup__name">
        <div class="g8-xml__popup__control-group">
          <div class="g8-xml__popup__control">
            <input
              type="text"
              tabindex="998"
              class="g8-xml--large"
              v-model="attribute.name"
              @focus="$event.target.select()"
            />
          </div>
        </div>
      </div>
      <div class="g8-xml__popup__raw">
        <div class="g8-xml__popup__control-group">
          <textarea
            tabindex="999"
            class="g8-xml__popup__control"
            v-model="attribute.value"
            @focus="$event.target.select()"
          ></textarea>
        </div>
      </div>
    </template>
  </popup-box>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PopupBox from './popup-box.vue';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlAttribute,
} from '../../types/types';
import G8XmlPopupInterface from '../../types/xml-popup-interface';
import { getTexts } from '../../translations/translation';

@Component({
  name: 'popup-attribute',
  components: { PopupBox },
})
export default class PopupAttribute extends Vue implements G8XmlPopupInterface {
  @Prop() private attribute!: XmlAttribute;

  private texts = getTexts();

  private safe!: XmlAttribute;

  private saving = false;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.safe = Object.assign({}, this.attribute);
  }

  save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    evt.data = this.attribute;
    this.$emit('save', evt);
    this.saving = true;
  }

  private cancel(evt: Event): void {
    if (!this.saving) {
      Object.assign(this.attribute, this.safe);
    }
    this.close(evt);
  }

  private close(evt: Event): void {
    this.$emit('close', evt);
  }
}
</script>
