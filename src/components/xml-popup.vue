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
        <button class="g8-xml__popup__header__close" @click="close($event)">
          &#215;
        </button>
      </div>
      <div class="g8-xml__popup__body">
        <slot>something here</slot>
      </div>
      <div class="g8-xml__popup__footer">
        <slot name="footer">
          <button @click="$emit('save', $event)">Save</button>
          <button @click="close($event)">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({ name: 'g8-xml-popup' })
export default class G8XmlPopup extends Vue {
  close(evt: Event) {
    this.$emit('close', evt);
  }
}
</script>
