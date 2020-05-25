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
import { XmlAttribute, XmlDeclaration } from '../../types/types';
import { SaveNodePopupEvent } from '../../types/events';
import PopupBox from './popup-box.vue';
import {
  cloneWithoutHierarchy,
  removeHierarchyFromNode,
} from '../../utils/utils';
import { getTexts } from '../../translations/translation';
import InputEncoding from '../inputs/input-encoding.vue';

/**
 * Popup box for editing XML declaration.
 */
@Component({
  name: 'popup-declaration',
  components: { InputEncoding, PopupBox },
})
export default class PopupDeclaration extends Vue {
  /**
   * The node to be edited.
   */
  @Prop() private node!: XmlDeclaration;

  /**
   * Actual object to work with.
   */
  private operand!: XmlDeclaration;

  /**
   * Text translations
   */
  private texts = getTexts();

  /**
   * `version` attribute of declaration.
   */
  private version!: XmlAttribute;

  /**
   * `encoding` attribute of declaration.
   */
  private encoding!: XmlAttribute;

  /**
   * `standalone` attribute of declaration.
   */
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

  /**
   * The `save` button has been pressed.
   */
  private save(event: SaveNodePopupEvent): void {
    const invalid = this.$el.querySelector(':invalid') as HTMLInputElement;
    if (invalid) {
      invalid.reportValidity();
      event.preventDefault();
      return;
    }
    event.data = this.operand;
    removeHierarchyFromNode(this.operand);
    /**
     * The node passed in the `data` field shall be saved.
     * @param {SaveNodePopupEvent} event
     */
    this.$emit('save', event);
    this.close(event);
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
}
</script>
