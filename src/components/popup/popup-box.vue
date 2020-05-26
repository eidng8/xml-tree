<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__popup" @click.self="close($event)">
    <div class="g8-xml__popup__box">
      <div class="g8-xml__popup__header">
        <div class="g8-xml__popup__header__title">
          <slot name="title">Popup</slot>
        </div>
        <button
          class="g8-xml__popup__header__close"
          tabindex="-1"
          @click="close($event)"
        >
          &#215;
        </button>
      </div>
      <div class="g8-xml__popup__body">
        <slot>something here</slot>
      </div>
      <div class="g8-xml__popup__footer">
        <slot name="footer">
          <label
            class="g8-xml__popup__message"
            :title="messageHint"
            v-if="message"
            >{{ message }}</label
          >
          <button tabindex="9999" @click="save($event)">
            {{ texts.save }}
          </button>
          <button tabindex="9999" @click="close($event)">
            {{ texts.cancel }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getTexts } from '../../translations/translation';

/**
 * Popup box
 */
@Component({ name: 'popup-box' })
export default class PopupBox extends Vue {
  /**
   * Message to be shown in the popup box.
   */
  @Prop() private message?: string;

  /**
   * Message tooltip to the popup box message.
   */
  @Prop() private messageHint?: string;

  /**
   * Text translations
   */
  private texts = getTexts();

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    document.addEventListener('keyup', this.keyup);
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    this.$nextTick(() => this.initFocus());
  }

  // noinspection JSUnusedLocalSymbols
  private beforeDestroy(): void {
    document.removeEventListener('keyup', this.keyup);
  }

  /**
   * Place the input focus to first text input control.
   */
  private initFocus(): void {
    const input = this.$el.querySelector(
      '.g8-xml__popup__attributes .g8-xml__popup__control input,textarea',
    ) as HTMLInputElement | HTMLTextAreaElement;
    if (input) input.focus();
  }

  /**
   * Closes the popup box.
   */
  private close(event: Event): void {
    /**
     * The popup has been closed.
     * @type {UIEvent}
     */
    this.$emit('close', event);
  }

  /**
   * The `save` button has been pressed.
   */
  private save(event: Event): void {
    /**
     * The `save` button has been pressed.
     * @type {SaveNodePopupEvent}
     */
    this.$emit('save', event);
  }

  /**
   * Handles special key input.
   */
  private keyup(evt: KeyboardEvent): void {
    if ('Escape' == evt.key) {
      this.close(evt);
    } else if ('Enter' == evt.key) {
      const tag = (evt.target as HTMLElement).localName;
      /* istanbul ignore if: unable to unit test */
      if (!evt.ctrlKey && ('textarea' == tag || 'select' == tag)) {
        return;
      }
      this.save(evt);
    } else {
      return;
    }
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
}
</script>
