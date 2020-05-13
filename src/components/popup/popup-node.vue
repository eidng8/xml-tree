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
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span :class="[`g8-xml__${node.type}`]">
        {{ texts[node.type] }}
      </span>
    </template>
    <template>
      <div class="g8-xml__popup__name" v-if="node.name">
        <div class="g8-xml__popup__control-group">
          <div class="g8-xml__popup__control">
            <input
              type="text"
              tabindex="999"
              class="g8-xml--large"
              v-model="node.name"
              @input="updateRaw()"
              @focus="$event.target.select()"
            />
          </div>
        </div>
      </div>
      <div v-if="node.attributes">
        <div class="g8-xml__popup__attributes">
          <div class="g8-xml__popup__separator">
            <span>{{ texts.attributes }}</span>
          </div>
          <div
            class="g8-xml__popup__control-group g8-xml__popup__attribute"
            v-for="(attr, idx) in node.attributes"
            :key="idx"
          >
            <span class="g8-xml__popup__control-label">
              <input
                type="text"
                pattern="[\w_]+"
                :tabindex="1000 + idx * 3"
                v-model="attr.name"
                @input="updateRaw()"
                @focus="$event.target.select()"
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
          v-model="node[node.type]"
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
import XRegExp from 'xregexp';
import { Component, Prop, Vue } from 'vue-property-decorator';
import PopupBox from './popup-box.vue';
import {
  isTextNode,
  SaveNodeKeyboardEvent,
  SaveNodeMouseEvent,
  XmlElement,
  XmlInstruction,
  XmlNode,
} from '../../types/types';
import {
  cloneWithoutHierarchy,
  objXml,
  rectifyAttributeValue,
  rectifyNodeAttributes,
  removeHierarchyFromNode,
  xmlJs,
} from '../../utils';
import { getTexts } from '../../translations/translation';

@Component({
  name: 'popup-node',
  components: { PopupBox },
})
export default class PopupNode extends Vue {
  @Prop() private node!: XmlNode;

  private texts = getTexts();

  private raw = '';

  private errorMessage = '';

  private errorMessageHint = '';

  // noinspection JSUnusedLocalSymbols
  private created(): void {
    this.updateRaw();
  }

  // noinspection JSUnusedLocalSymbols
  private mounted(): void {
    each(
      this.$el.querySelectorAll(
        '.g8-xml__popup__attributes .g8-xml__popup__control-label input',
      ),
      e => {
        e.setAttribute('pattern', XRegExp('[\\p{L}_]+').toString());
      },
    );
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

  private updateRaw(): void {
    // removeHierarchyFromNode(this.node);
    // rectifyNodeAttributes(this.node);
    if (isTextNode(this.node)) {
      this.raw = rectifyAttributeValue(this.node.text);
    } else {
      const node = cloneWithoutHierarchy(this.node);
      rectifyNodeAttributes(node);
      this.raw = objXml({ nodes: [node] });
    }
    this.validateXml();
  }

  private validateXml(): boolean {
    if (isTextNode(this.node)) return true;
    try {
      xmlJs(this.raw);
      this.errorMessage = '';
      this.errorMessageHint = '';
      return true;
    } catch (e) {
      this.errorMessage = this.texts.errInvalidXml;
      this.errorMessageHint = e.message;
      return false;
    }
  }

  private rawChanged(): void {
    if (!this.validateXml()) return;
    const node = xmlJs(this.raw) as XmlElement;
    const obj = node.nodes![0] as XmlNode;
    removeHierarchyFromNode(obj);
    Object.assign(this.node, obj);
  }

  private newAttribute(): void {
    const node = this.node as XmlElement;
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

  private deleteAttribute(idx: number): void {
    const node = this.node as XmlElement;
    node.attributes!.splice(idx, 1);
    this.updateRaw();
    this.$forceUpdate();
  }

  private save(evt: SaveNodeMouseEvent | SaveNodeKeyboardEvent): void {
    const wrapper = xmlJs(
      isTextNode(this.node) ? `<tmp>${this.raw}</tmp>` : this.raw,
      {
        instructionHasAttributes: !!(this.node as XmlInstruction).attributes,
      },
    ) as XmlElement;
    const node = (isTextNode(this.node)
      ? (wrapper.nodes![0] as XmlElement).nodes![0]
      : wrapper.nodes![0]) as XmlNode;
    removeHierarchyFromNode(node);
    evt.data = node;
    /**
     * The node passed in the `data` field shall be saved.
     * @param {SaveNodeMouseEvent|SaveNodeKeyboardEvent} event
     */
    this.$emit('save', evt);
  }
}
</script>
