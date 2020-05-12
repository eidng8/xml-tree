<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup__declaration"
    @save="save($event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml__declaration">{{ texts.declaration }}</span>
    </template>
    <template>
      <div class="g8-xml__popup__attributes">
        <div class="g8-xml__popup__attribute">
          <label>
            <span>version = </span>
            <select v-model="version.value">
              <option value="1.0">1.0</option>
              <option value="1.1">1.1</option>
            </select>
          </label>
        </div>
        <div class="g8-xml__popup__attribute">
          <label>
            <span>encoding = </span>
            <input
              type="text"
              v-model="encoding.value"
              @focus="$event.target.select()"
            />
          </label>
        </div>
        <div class="g8-xml__popup__attribute">
          <label>
            <span>standalone = </span>
            <select v-model="standalone.value">
              <option value="no">no</option>
              <option value="yes">yes</option>
            </select>
          </label>
        </div>
      </div>
    </template>
  </popup-box>
</template>

<script lang="ts">
import { each, filter, includes, map } from 'lodash';
import { Component, Mixins, Prop } from 'vue-property-decorator';
import { XmlAttribute, XmlDeclaration } from '../../types/types';
import PopupBoxMixin from '../../mixins/popup-box';
import PopupBox from './popup-box.vue';

@Component({
  name: 'popup-declaration',
  components: { PopupBox },
})
export default class PopupDeclaration extends Mixins(PopupBoxMixin) {
  @Prop() protected node!: XmlDeclaration;

  private version!: XmlAttribute;

  private encoding!: XmlAttribute;

  private standalone!: XmlAttribute;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    if (!this.node.attributes) this.node.attributes = [];
    const has = map(this.node.attributes, 'name');
    each(
      filter(['version', 'encoding', 'standalone'], n => !includes(has, n)),
      n => this.node.attributes.push({ name: n, value: undefined }),
    );
    each(this.node.attributes, attribute => {
      switch (attribute.name) {
        case 'encoding':
          this.encoding = attribute;
          break;
        case 'standalone':
          this.standalone = attribute;
          break;
        case 'version':
          this.version = attribute;
          break;
      }
    });
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    this.$nextTick(() => {
      const e = this.$el.querySelector('select');
      /* istanbul ignore else: unable to unit test */
      if (e) e.focus();
    });
  }
}
</script>
