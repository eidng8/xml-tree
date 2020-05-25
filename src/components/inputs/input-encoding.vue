<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <input
    v-model="value.value"
    @input="validate($event)"
    @focus="$event.target.select()"
  />
</template>

<script lang="ts">
import { encodingExists } from 'iconv-lite';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getTexts } from '../../translations/translation';
import { XmlAttribute } from '../../types/types';

/**
 * An HTML input field for entering character encoding. It uses
 * [iconv-lite](https://www.npmjs.com/package/iconv-lite) to
 * validate the input.
 */
@Component({ name: 'input-encoding' })
export default class InputEncoding extends Vue {
  /**
   * Input's value
   */
  @Prop() private value!: XmlAttribute;

  /**
   * Text translations
   */
  private texts = getTexts();

  /**
   * Validates the input value, and reports validity error if invalid.
   * @param event
   */
  private validate(event: InputEvent): void {
    if (encodingExists(this.value.value!)) {
      /**
       * Emitted when there is valid input.
       * @type {InputEvent}
       */
      this.$emit('input', event);
      (this.$el as HTMLInputElement).setCustomValidity('');
      return;
    }
    (this.$el as HTMLInputElement).setCustomValidity(
      this.texts.errInvalidEncoding,
    );
    (this.$el as HTMLInputElement).reportValidity();
  }
}
</script>
