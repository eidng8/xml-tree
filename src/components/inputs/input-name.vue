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

@Component({ name: 'input-name' })
export default class InputName extends Vue {
  @Prop() private node!: XmlElement | XmlInstruction | XmlAttribute;

  private texts = getTexts();

  private regex = XRegExp('^[_\\p{L}][-_:\\d\\p{L}]+$', 'nu');

  private validate(evt: InputEvent): void {
    if (this.regex.test(this.node.name)) {
      this.$emit('input', evt);
      (this.$el as HTMLInputElement).setCustomValidity('');
      return;
    }
    (this.$el as HTMLInputElement).setCustomValidity(this.texts.errInvalidName);
    (this.$el as HTMLInputElement).reportValidity();
  }
}
</script>
