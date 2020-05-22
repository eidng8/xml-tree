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

@Component({ name: 'input-encoding' })
export default class InputEncoding extends Vue {
  @Prop() private value!: XmlAttribute;

  private texts = getTexts();

  private validate(evt: InputEvent): void {
    if (encodingExists(this.value.value!)) {
      this.$emit('input', evt);
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
