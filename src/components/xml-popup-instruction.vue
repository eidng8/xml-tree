<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-xml-popup
    class="g8-xml__popup_instruction"
    @save="$emit('save', $event)"
    @close="$emit('close', $event)"
  >
    <template v-slot:title>
      <span class="g8-xml-tree__instruction">{{ node.type }}</span>
    </template>
    <template>
      <div>
        <label class="g8-xml__popup_control_group">
          <input
            type="text"
            class="g8-xml__popup_control"
            v-model="node.name"
          />
        </label>
        <label class="g8-xml__popup_control_group">
          <textarea
            class="g8-xml__popup_control"
            v-model="node[node.type]"
          ></textarea>
        </label>
      </div>
    </template>
  </g8-xml-popup>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import G8XmlPopup from './xml-popup.vue';
import { XmlTreeInstruction } from './types';

@Component({
  name: 'g8-xml-popup-instruction',
  components: { G8XmlPopup },
})
export default class G8XmlPopupInstruction extends Vue {
  @Prop() node!: XmlTreeInstruction;
}
</script>
