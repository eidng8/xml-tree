<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup_element"
    @save="save($event)"
    @close="close($event)"
  >
    <template v-slot:title>
      <span class="g8-xml__attribute" style="text-transform: none !important;">
        {{ operand.name }}
      </span>
    </template>
    <template>
      <div class="g8-xml__popup__raw">
        <div class="g8-xml__popup__control-group">
          <textarea
            tabindex="999"
            class="g8-xml__popup__control"
            v-model="operand.value"
            @focus="$event.target.select()"
          ></textarea>
        </div>
      </div>
    </template>
  </popup-box>
</template>

<script lang="ts">
import { cloneDeep } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlAttribute,
} from '../../types/types';
import PopupBox from './popup-box.vue';

@Component({
  name: 'popup-attribute',
  components: { PopupBox },
})
export default class PopupAttribute extends Vue {
  @Prop() private attribute!: XmlAttribute;

  private operand!: XmlAttribute;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.operand = cloneDeep(this.attribute);
  }

  private save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    evt.data = this.operand;
    this.$emit('save', evt);
    this.close(evt);
  }

  private close(evt: Event): void {
    this.$emit('close', evt);
  }
}
</script>
