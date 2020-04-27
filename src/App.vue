<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <xml-tree :xml="xml" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { XmlTree } from '.';

@Component({ components: { XmlTree } })
export default class App extends Vue {
  xml =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<!-- xslplane.1.xml -->\n' +
    '<?xml-stylesheet type="text/xsl" href="xslplane.1.xsl" ?>\n' +
    '<plane xmlns="urn:xxx" xmlns:y="urn:yyy">\n' +
    '  <![CDATA[<sender>John Smith</sender>]]>\n' +
    '  <!-- xslplane.2.xml -->\n' +
    '  <year> 1977 </year>\n' +
    '  <y:make> <c>Cessna</c> </y:make>\n' +
    '  <model>\n' +
    '    Skyhawk\n' +
    '  </model>\n' +
    '  <color> Light&nbsp;blue and white </color>\n' +
    '</plane>';
}
</script>

<style lang="scss">
html,
body {
  color: #888;
  background: #333333;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
