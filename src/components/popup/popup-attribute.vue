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
import { XmlAttribute } from '../../types/types';
import { SaveNodePopupEvent } from '../../types/events';
import PopupBox from './popup-box.vue';

/**
 * Popup box for editing attribute.
 */
@Component({
  name: 'popup-attribute',
  components: { PopupBox },
})
export default class PopupAttribute extends Vue {
  /**
   * Attribute value
   */
  @Prop() private attribute!: XmlAttribute;

  /**
   * Actual object to work with.
   */
  private operand!: XmlAttribute;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.operand = cloneDeep(this.attribute);
  }

  /**
   * The `save` button has been pressed.
   * @param event
   */
  private save(event: SaveNodePopupEvent): void {
    event.data = this.operand;
    /**
     * The `save` button has been pressed.
     * @type {SaveNodePopupEvent}
     */
    this.$emit('save', event);
    this.close(event);
  }

  /**
   * Closes the popup box.
   * @param evt
   */
  private close(evt: Event): void {
    /**
     * The popup has been closed.
     * @type {UIEvent}
     */
    this.$emit('close', evt);
  }
}
</script>
