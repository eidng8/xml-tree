<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <input
    v-model="node.name"
    @input="validate($event)"
    @focus="$event.target.select()"
  />
</template>

<script lang="ts">
import XRegExp from 'xregexp';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getTexts } from '../../translations/translation';
import { XmlAttribute, XmlElement, XmlInstruction } from '../../types/types';

/**
 * An HTML input field for entering XML tag name. It uses
 * [XRegExp](http://xregexp.com/) to validate the input.
 */
@Component({ name: 'input-name' })
export default class InputName extends Vue {
  /**
   * Input's value
   */
  @Prop() private node!: XmlElement | XmlInstruction | XmlAttribute;

  /**
   * Text translations
   */
  private texts = getTexts();

  /**
   * Regular expression to validate value
   */
  private regex = XRegExp('^[_\\p{L}][-_:\\d\\p{L}]*$', 'nu');

  private validate(event: InputEvent): void {
    if (this.regex.test(this.node.name)) {
      /**
       * Emitted when there is valid input.
       * @type {InputEvent}
       */
      this.$emit('input', event);
      (this.$el as HTMLInputElement).setCustomValidity('');
      return;
    }
    (this.$el as HTMLInputElement).setCustomValidity(this.texts.errInvalidName);
    (this.$el as HTMLInputElement).reportValidity();
  }
}
</script>
