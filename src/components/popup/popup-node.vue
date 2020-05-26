<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <popup-box
    class="g8-xml__popup_element"
    :class="{ 'g8--error': errorMessage }"
    :message="errorMessage"
    :message-hint="errorMessageHint"
    @save="save($event)"
    @close="close($event)"
  >
    <template v-slot:title>
      <span :class="[`g8-xml__${operand.type}`]">
        {{ texts[operand.type] }}
      </span>
    </template>
    <template>
      <div class="g8-xml__popup__name" v-if="operand.name">
        <div class="g8-xml__popup__control-group">
          <div class="g8-xml__popup__control">
            <input-name
              type="text"
              tabindex="999"
              class="g8-xml--large"
              :node="operand"
              @input="updateRaw()"
            />
          </div>
        </div>
      </div>
      <div v-if="operand.attributes">
        <div class="g8-xml__popup__attributes">
          <div class="g8-xml__popup__separator">
            <span>{{ texts.attributes }}</span>
          </div>
          <div
            class="g8-xml__popup__control-group g8-xml__popup__attribute"
            v-for="(attr, idx) in operand.attributes"
            :key="idx"
          >
            <span class="g8-xml__popup__control-label">
              <input-name
                type="text"
                :tabindex="1000 + idx * 3"
                :node="attr"
                @input="updateRaw()"
              />
            </span>
            <span>=</span>
            <span class="g8-xml__popup__control">
              <input
                type="text"
                :tabindex="1001 + idx * 3"
                v-model="attr.value"
                @input="updateRaw()"
                @focus="$event.target.select()"
              />
            </span>
            <span class="g8-xml__popup__control__accessories">
              <button
                class="g8-xml__popup__control__accessory"
                :tabindex="1002 + idx * 3"
                @click="deleteAttribute(idx)"
              >
                &#215;
              </button>
            </span>
          </div>
        </div>
        <div class="g8-xml__popup__control-group">
          <button
            class="g8-xml__popup__control"
            tabindex="9997"
            @click="newAttribute()"
          >
            {{ texts.addAttribute }}
          </button>
        </div>
      </div>
      <div class="g8-xml__popup__control-group" v-else>
        <textarea
          tabindex="1000"
          class="g8-xml__popup__control"
          v-model="operand[operand.type]"
          @input="updateRaw()"
          @focus="$event.target.select()"
        ></textarea>
      </div>
      <div class="g8-xml__popup__raw">
        <div class="g8-xml__popup__separator">
          <span>{{ texts.raw }}</span>
        </div>
        <div class="g8-xml__popup__control-group">
          <textarea
            tabindex="9998"
            class="g8-xml__popup__control"
            v-model="raw"
            @input="rawChanged()"
            @focus="$event.target.select()"
          ></textarea>
        </div>
      </div>
    </template>
  </popup-box>
</template>

<script lang="ts">
import { each } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  XmlElement,
  XmlInstruction,
  XmlNode,
  XmlText,
} from '../../types/types';
import { SaveNodePopupEvent } from '../../types/events';
import {
  cloneWithoutHierarchy,
  objXml,
  rectifyAttributeValue,
  rectifyNodeAttributes,
  removeHierarchyFromNode,
  xmlJs,
} from '../../utils/utils';
import { getTexts } from '../../translations/translation';
import InputName from '../inputs/input-name.vue';
import PopupBox from './popup-box.vue';
import { isElementNode, isTextNode } from '../../utils/type-guards';

/**
 * Popup box for editing XML node.
 */
@Component({
  name: 'popup-node',
  components: { InputName, PopupBox },
})
export default class PopupNode extends Vue {
  /**
   * The node to be edited.
   */
  @Prop() private node!: XmlNode;

  /**
   * Actual object to work with.
   */
  private operand!: XmlNode;

  /**
   * Text translations
   */
  private texts = getTexts();

  /**
   * Raw XML string.
   */
  private raw = '';

  /**
   * Error message of the editing node.
   */
  private errorMessage = '';

  /**
   * Error message tooltip of the editing node.
   */
  private errorMessageHint = '';

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.operand = cloneWithoutHierarchy(this.node) as XmlNode;
    if (isElementNode(this.operand) && !this.operand.attributes) {
      this.operand.attributes = [];
    }
    this.updateRaw();
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    this.$nextTick(() => this.initRawSize());
  }

  /**
   * A rough approximate height estimation of text areas. Gaps and heights of
   * other elements are not considered.
   */
  private initRawSize(): void {
    const areas = this.$el.getElementsByTagName('textarea');
    const area = areas[0] as HTMLTextAreaElement;
    const styles = window.getComputedStyle(area);
    const mh = parseInt(styles.getPropertyValue('max-height')) / areas.length;
    // remember to count borders
    /* istanbul ignore next: unable to unit test */
    const ah = (mh > area.scrollHeight ? area.scrollHeight : mh) + 2;
    each(areas, a => (a.style.height = `${ah}px`));
  }

  /**
   * Update raw XML string according to other input.
   */
  private updateRaw(): void {
    const bak = this.raw;
    if (isTextNode(this.operand)) {
      this.raw = rectifyAttributeValue(this.operand.text);
    } else {
      const node = cloneWithoutHierarchy(this.operand);
      rectifyNodeAttributes(node);
      this.raw = objXml({ nodes: [node] });
    }
    if (!this.validateXml()) this.raw = bak;
  }

  /**
   * Validate the edting node.
   */
  private validateXml(): boolean {
    const xml = isTextNode(this.operand) ? `<tmp>${this.raw}</tmp>` : this.raw;
    try {
      if (!Object.keys(xmlJs(xml)).length) {
        this.errorMessageHint = this.errorMessage = this.texts.errInvalidXml;
        return false;
      }
      this.errorMessage = '';
      this.errorMessageHint = '';
      return true;
    } catch (e) {
      this.errorMessage = this.texts.errInvalidXml;
      this.errorMessageHint = e.message;
      return false;
    }
  }

  /**
   * The raw XML has been changed.
   */
  private rawChanged(): void {
    if (!this.validateXml()) return;
    let node: XmlElement, obj: XmlNode;
    if (isTextNode(this.operand)) {
      node = xmlJs(`<tmp>${this.raw}</tmp>`) as XmlElement;
      obj = (node.nodes![0] as XmlElement).nodes![0] as XmlText;
    } else {
      node = xmlJs(this.raw, {
        instructionHasAttributes: !!(this.operand as XmlInstruction).attributes,
      }) as XmlElement;
      obj = node.nodes![0] as XmlNode;
    }
    removeHierarchyFromNode(obj);
    this.operand = obj;
  }

  /**
   * Add a new attribute to the node.
   */
  private newAttribute(): void {
    const node = this.operand as XmlElement;
    node.attributes!.push({ name: '', value: '' });
    this.$forceUpdate();
    this.$nextTick(() => {
      const input = this.$el.querySelector(
        '.g8-xml__popup__attributes .g8-xml__popup__attribute:last-child input',
      ) as HTMLInputElement;
      /* istanbul ignore else: unable to unit test */
      if (input) input.focus();
    });
  }

  /**
   * Delete the specified attribute from node.
   */
  private deleteAttribute(idx: number): void {
    const node = this.operand as XmlElement;
    node.attributes!.splice(idx, 1);
    this.updateRaw();
    this.$forceUpdate();
  }

  /**
   * The `save` button has been pressed.
   */
  private save(event: SaveNodePopupEvent): void {
    if (this.hasError()) {
      this.reportError();
      return;
    }
    const wrapper = xmlJs(
      isTextNode(this.operand) ? `<tmp>${this.raw}</tmp>` : this.raw,
      {
        instructionHasAttributes: !!(this.operand as XmlInstruction).attributes,
      },
    ) as XmlElement;
    const node = (isTextNode(this.operand)
      ? (wrapper.nodes![0] as XmlElement).nodes![0]
      : wrapper.nodes![0]) as XmlNode;
    removeHierarchyFromNode(node);
    event.data = node;
    /**
     * The node passed in the `data` field shall be saved.
     * @type {SaveNodePopupEvent}
     */
    this.$emit('save', event);
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
   * Whether current editing node has error.
   */
  private hasError(): boolean {
    return (
      this.$el.classList.contains('g8--error') ||
      this.$el.querySelector(':invalid,.g8--error') != null
    );
  }

  /**
   * Report error on first erroneous field.
   */
  private reportError(): void {
    const elem = this.$el.querySelector(':invalid') as HTMLInputElement;
    if (elem) elem.reportValidity();
  }
}
</script>
