<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div class="g8-xml__popup" @click.self="close($event)" @keyup="keyup($event)">
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
          <button @click="save($event)">Save</button>
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
  close(evt: Event): void {
    this.$emit('close', evt);
  }

  save(evt: Event): void {
    this.$emit('save', evt);
  }

  keyup(evt: KeyboardEvent): void {
    console.log(evt);
    if (evt.defaultPrevented) return;
    if ('Escape' == evt.key) this.close(evt);
    else if ('Enter' == evt.key) {
      const tag = (evt.target as HTMLElement).localName;
      if (!evt.ctrlKey && ('textarea' == tag || 'select' == tag)) return;
      this.save(evt);
    } else return;
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
}
</script>
