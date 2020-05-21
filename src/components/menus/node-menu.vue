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
import { XmlElement, XmlNode } from '../../types/types';
import { getTexts } from '../../translations/translation';
import { isElementNode, isTextNode } from '../../utils/type-guards';
import MenuOpenEvent from '../../events/menu-open';

@Component({ name: 'node-menu', components: { G8PopupMenu } })
export default class NodeMenu extends Vue {
  private static readonly SEPARATOR = { label: '---' };

  private texts = getTexts();

  /**
   * Generates and shows the menu with on the given node.
   */
  open(node: XmlNode, isRoot = false, evt?: MouseEvent): void {
    const items = this.generateNodeMenu(node, isRoot);
    const ovt = new MenuOpenEvent({
      detail: { items, node, rootLevel: isRoot, originalEvent: evt },
    });
    this.$emit(MenuOpenEvent.TYPE, ovt);
    if (ovt.defaultPrevented) return;
    (this.$children[0] as G8PopupMenu).open(items, evt);
  }

  /**
   * Generate context menu according to `node`.
   * @param node
   * @param isRoot
   */
  private generateNodeMenu(node: XmlNode, isRoot: boolean): G8MenuItem[] {
    const subtitle = `< ${(node as XmlElement).name || node.type} >`;
    const menu = [
      { id: 'g8-xml-menu-edit', label: this.texts.menuEdit, subtitle },
      NodeMenu.SEPARATOR,
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
          'g8-xml-menu-insert-before',
          node,
          isRoot,
        ),
      },
    ] as G8MenuItem[];
    if (isElementNode(node)) menu.push(...this.generateElementMenu(node));
    if (!isRoot || !isElementNode(node)) {
      menu.push(NodeMenu.SEPARATOR, {
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
    const subtitle = `< ${node.name} >`;
    return [
      NodeMenu.SEPARATOR,
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
    isRoot: boolean,
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

  /**
   * Generate sub-menu items for append and prepend.
   * @param parentId
   * @param node
   */
  private generateInsertChildMenu(
    parentId: string,
    node: XmlElement,
  ): G8MenuItem[] {
    const items = ['CDATA', 'comment', 'element', 'instruction'];
    if (
      !(
        node.nodes &&
        ((parentId.indexOf('-append-') > -1 &&
          isTextNode(last(node.nodes) as XmlNode)) ||
          (parentId.indexOf('-prepend-') > -1 &&
            isTextNode(head(node.nodes) as XmlNode)))
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
