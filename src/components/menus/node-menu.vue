<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <g8-popup-menu
    class="g8-menu g8-menu--off"
    :add-element-id="true"
    @select="$emit('select', $event)"
  />
</template>

<script lang="ts">
import { head, last, map } from 'lodash';
import { Component, Vue } from 'vue-property-decorator';
import { G8MenuItem, G8PopupMenu } from 'g8-popup-menu';
import {
  isElementNode,
  isTextNode,
  XmlElement,
  XmlNode,
} from '../../types/types';
import { getTexts } from '../../translations/translation';

@Component({ name: 'node-menu', components: { G8PopupMenu } })
export default class NodeMenu extends Vue {
  private texts = getTexts();

  private separator = { label: '---' };

  open(node: XmlNode, isRoot = false, evt?: MouseEvent): void {
    (this.$children[0] as G8PopupMenu).open(
      this.generateNodeMenu(node, isRoot),
      evt,
    );
  }

  /**
   * Generate context menu according to `node`.
   * @param node
   * @param isRoot
   */
  private generateNodeMenu(node: XmlNode, isRoot = false): G8MenuItem[] {
    const subtitle = `< ${(node as XmlElement).name || node.type} >`;
    const menu = [
      { id: 'g8-xml-menu-edit', label: this.texts.menuEdit, subtitle },
      this.separator,
      {
        id: 'g8-xml-menu-insert-after',
        label: this.texts.menuInsertAfter,
        subtitle,
        children: this.generateInsertMenu(
          'g8-xml-menu-insert-after',
          node,
          isRoot,
        ),
      },
      {
        id: 'g8-xml-menu-insert-before',
        label: this.texts.menuInsertBefore,
        subtitle,
        children: this.generateInsertMenu(
          'g8-xml-menu-insert-after',
          node,
          isRoot,
        ),
      },
    ] as G8MenuItem[];
    if (isElementNode(node)) menu.concat(this.generateElementMenu(node));
    if (!isRoot || !isElementNode(node)) {
      menu.push(this.separator, {
        id: 'g8-xml-menu-remove',
        label: this.texts.menuRemove,
        subtitle,
      });
    }
    return menu;
  }

  /**
   * Generate context menu according to `node`.
   * @param node
   */
  private generateElementMenu(node: XmlElement): G8MenuItem[] {
    const subtitle = `< ${(node as XmlElement).name || node.type} >`;
    return [
      {
        id: 'g8-xml-menu-append-child',
        label: this.texts.menuAppend,
        subtitle,
        children: this.generateInsertChildMenu(
          'g8-xml-menu-append-child',
          node,
        ),
      },
      {
        id: 'g8-xml-menu-prepend-child',
        label: this.texts.menuPrepend,
        subtitle,
        children: this.generateInsertChildMenu(
          'g8-xml-menu-prepend-child',
          node,
        ),
      },
    ];
  }

  /**
   * Generate context menu according to `node`.
   * @param parentId
   * @param node
   * @param isRoot
   */
  private generateInsertMenu(
    parentId: string,
    node: XmlNode,
    isRoot = false,
  ): G8MenuItem[] {
    const nodes = ['CDATA', 'comment', 'instruction'];
    if (isRoot) {
      nodes.push('DOCTYPE');
    } else {
      nodes.push('element');
      if (!isTextNode(node)) nodes.push('text');
    }
    return map(nodes.sort(), e => {
      return {
        id: `${parentId}-${e}`.toLowerCase(),
        label: e,
      } as G8MenuItem;
    });
  }

  private generateInsertChildMenu(
    parentId: string,
    node: XmlElement,
  ): G8MenuItem[] {
    const items = ['CDATA', 'comment', 'element', 'instruction'];
    if (
      !(
        (parentId.indexOf('-append-') > -1 &&
          isTextNode(last(node.nodes) as XmlNode)) ||
        (parentId.indexOf('-prepend-') > -1 &&
          isTextNode(head(node.nodes) as XmlNode))
      )
    ) {
      items.push('text');
    }
    return map(items.sort(), item => {
      return {
        id: `${parentId}-${item}`.toLowerCase(),
        label: item,
      };
    });
  }
}
</script>
