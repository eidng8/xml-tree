<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup__declaration"
    @save="save($event)"
    @close="close($event)"
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
            <input-encoding type="text" v-model="encoding" />
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlAttribute,
  XmlDeclaration,
} from '../../types/types';
import PopupBox from './popup-box.vue';
import { cloneWithoutHierarchy, removeHierarchyFromNode } from '../../utils';
import { getTexts } from '../../translations/translation';
import InputEncoding from '../inputs/input-encoding.vue';

@Component({
  name: 'popup-declaration',
  components: { InputEncoding, PopupBox },
})
export default class PopupDeclaration extends Vue {
  @Prop() private node!: XmlDeclaration;

  private operand!: XmlDeclaration;

  private texts = getTexts();

  private version!: XmlAttribute;

  private encoding!: XmlAttribute;

  private standalone!: XmlAttribute;

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.operand = cloneWithoutHierarchy(this.node) as XmlDeclaration;
    if (!this.operand.attributes) this.operand.attributes = [];
    const has = map(this.operand.attributes, 'name');
    each(
      filter(['version', 'encoding', 'standalone'], n => !includes(has, n)),
      n => this.operand.attributes.push({ name: n, value: undefined }),
    );
    each(this.operand.attributes, attribute => {
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

  private save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    const invalid = this.$el.querySelector(':invalid') as HTMLInputElement;
    if (invalid) {
      invalid.reportValidity();
      evt.preventDefault();
      return;
    }
    evt.data = this.operand;
    removeHierarchyFromNode(this.operand);
    /**
     * The node passed in the `data` field shall be saved.
     * @param {SaveNodeMouseEvent|SaveNodeKeyboardEvent} event
     */
    this.$emit('save', evt);
    this.close(evt);
  }

  private close(evt: Event): void {
    this.$emit('close', evt);
  }
}
</script>
