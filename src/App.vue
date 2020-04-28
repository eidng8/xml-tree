<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <div class="control-group">
      <label for="show-attr-value">Show attribute values</label>
      <input id="show-attr-value" type="checkbox" v-model="showAttrValue" />
    </div>
    <hr />
    <g8-xml-tree :xml="xml" :show-attr-value="showAttrValue" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { G8XmlTree } from '.';

@Component({ components: { G8XmlTree } })
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

  showAttrValue = false;
}
</script>

<style lang="scss">
html,
body {
  color: #888;
  background: #333333;
}

hr {
  border-width: 0 0 1px;
  border-color: rgba(0.5, 0.5, 0.5, 0.5);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.control-group {
  display: inline-flex;
}
</style>
