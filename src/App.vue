<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app" :class="{ 'g8--dark': darkTheme }">
    <div class="controls">
      <div class="control-group">
        <label for="show-attr-value">Show attribute values</label>
        <input id="show-attr-value" type="checkbox" v-model="showAttrValue" />
      </div>
      <div class="control-group">
        <label for="pi-attr">Processing instructions use attributes</label>
        <input
          id="pi-attr"
          type="checkbox"
          v-model="piAttr"
          @change="piChanged()"
        />
      </div>
      <div class="control-group">
        <label for="dark-theme">Use dark theme</label>
        <input id="dark-theme" type="checkbox" v-model="darkTheme" />
      </div>
    </div>
    <hr />
    <g8-xml-edit
      :xml="xml"
      :show-attr-value="showAttrValue"
      :pi-use-attribute="piAttr"
      @declaration-changed="eventFired('declaration-changed', $event)"
      @attribute-changed="eventFired('attribute-changed', $event)"
      @node-changed="eventFired('node-changed', $event)"
      @node-created="eventFired('node-created', $event)"
      @node-removed="eventFired('node-removed', $event)"
      @default-declaration="eventFired('...', $event)"
      @menu-open="eventFired('...', $event)"
      @select-node="eventFired('...', $event)"
      @edit-node="eventFired('...', $event)"
      @save-node="eventFired('...', $event)"
    />
    <hr />
    <div id="event">
      <code id="event-name">{{ evtName }}</code>
      <code> : </code>
      <code>{{ evtNode }}</code>
    </div>
    <pre class="xml">{{ output }}</pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { cloneWithoutHierarchy, G8XmlEdit, XmlDeclaration, XmlNode } from '.';
import EventBase from './events/event-base';

@Component({ components: { G8XmlEdit } })
export default class App extends Vue {
  xml =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<!DOCTYPE note [\n' +
    '  <!ELEMENT note    (to,from,heading,body)>\n' +
    '  <!ELEMENT to      (#PCDATA)>\n' +
    '  <!ELEMENT from    (#PCDATA)>\n' +
    '  <!ELEMENT heading (#PCDATA)>\n' +
    '  <!ELEMENT body    (#PCDATA)>\n' +
    ']>' +
    // '<!DOCTYPE note SYSTEM "note.dtd">' +
    '<!-- xslplane.1.xml -->\n' +
    '<?xml-stylesheet type="text/xsl" href="xslplane.1.xsl" ?>\n' +
    '<plane xmlns="urn:xxx" xmlns:y="urn:yyy">\n' +
    '  <![CDATA[<sender>John Smith</sender>]]>\n' +
    '  <!-- xslplane.2.xml -->\n' +
    '  <year> 1977 </year>\n' +
    '  <y:make> <c>Cessna</c><c></c><c></c> </y:make>\n' +
    '  <model>\n' +
    '    Skyhawk\n' +
    '  </model>\n' +
    '  <color> Light&nbsp;blue and white </color>\n' +
    '</plane>';

  showAttrValue = true;

  piAttr = true;

  darkTheme = true;

  output = '';

  evtName = '';

  evtNode: XmlNode | XmlDeclaration | null = null;

  // noinspection JSUnusedGlobalSymbols
  created(): void {
    this.output = this.xml;
  }

  piChanged(): void {
    this.$nextTick(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tree = this.$children[0] as any;
      tree.reloadXml();
      tree.$forceUpdate();
    });
  }

  eventFired(
    name: string,
    // eslint-disable-next-line
    evt: XmlNode | XmlDeclaration | EventBase<any>,
  ): void {
    // eslint-disable-next-line
    const e = evt as EventBase<any>;
    this.evtName = e.type || name;
    this.evtNode = cloneWithoutHierarchy(
      e.detail ? e.detail.node || e.detail : evt,
    );
    this.output = this.$children[0] ? this.$children[0].toString() : '';
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

hr {
  height: 1px;
  width: 100%;
  border-width: 0 0 1px;
  border-color: rgba(0.5, 0.5, 0.5, 0.5);
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &.g8--dark {
    color: #888;
    background: #333;
  }

  > .controls {
    padding: 2px 6px;

    > * {
      margin-right: 1em;
    }
  }

  > .g8-xml__container {
    flex: 1 0 auto;
  }
}

.control-group {
  display: inline-flex;
}

.xml {
  overflow: auto;
  max-height: 30em;
}
</style>
