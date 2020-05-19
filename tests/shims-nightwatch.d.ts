/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

declare module 'e2e/*' {
  import { EnhancedElementInstance, NightwatchAPI } from 'nightwatch';
  import { XmlNodeTypes } from '../src';

  // noinspection JSUnusedGlobalSymbols
  interface ElementCommands {
    /**
     * Press the `Save` button in popup box. Waits until the box went away.
     */
    savePopup(): this;

    /**
     * Press the `Cancel` button in popup box. Waits until the box went away.
     */
    cancelPopup(): this;

    /**
     * Expand the specified tree node. Waits until child branch were visible.
     * @param selector
     */
    expandNode(selector: string | EnhancedElementInstance): this;

    /**
     * Open context menu on the given element. Waits until the menu were
     * visible.
     * @param selector
     */
    menuOn(selector: string | EnhancedElementInstance): this;

    /**
     * Open context menu on the given element. Then click the 'Edit' menu item
     * to popup the edit box. Waits until the popup box were visible.
     * @param selector
     */
    menuEdit(selector: string | EnhancedElementInstance): this;

    /**
     * Open context menu on the given element. Then click the 'Remove' menu
     * item. Doesn't wait for anything.
     * @param selector
     */
    menuRemove(selector: string | EnhancedElementInstance): this;

    /**
     * Open context menu on the given element. Then click the 'Append' menu
     * item to popup the edit box. If `type` is also specified, the specified
     * sub-menu item will be clicked too.
     * Waits until the popup box were visible unless `dontWait` were `true`.
     * @param selector
     * @param type
     * @param dontWait defaults to `false`
     */
    menuAppend(
      selector: string | EnhancedElementInstance,
      type?: XmlNodeTypes,
      dontWait = false,
    ): this;

    /**
     * Open context menu on the given element. Then click the 'Prepend' menu
     * item to popup the edit box. If `type` is also specified, the specified
     * sub-menu item will be clicked too.
     * Waits until the popup box were visible unless `dontWait` were `true`.
     * @param selector
     * @param type
     * @param dontWait defaults to `false`
     */
    menuPrepend(
      selector: string | EnhancedElementInstance,
      type?: XmlNodeTypes,
      dontWait = false,
    ): this;

    /**
     * Open context menu on the given element. Then click the 'Insert After'
     * menu item to popup the edit box. If `type` is also specified, the
     * specified sub-menu item will be clicked too.
     * Waits until the popup box were visible unless `dontWait` were `true`.
     * @param selector
     * @param type
     * @param dontWait defaults to `false`
     */
    menuInsertAfter(
      selector: string | EnhancedElementInstance,
      type?: XmlNodeTypes,
      dontWait = false,
    ): this;

    /**
     * Open context menu on the given element. Then click the 'Insert Before'
     * menu item to popup the edit box. If `type` is also specified, the
     * specified sub-menu item will be clicked too.
     * Waits until the popup box were visible unless `dontWait` were `true`.
     * @param selector
     * @param type
     * @param dontWait defaults to `false`
     */
    menuInsertBefore(
      selector: string | EnhancedElementInstance,
      type?: XmlNodeTypes,
      dontWait = false,
    ): this;
  }

  interface NightwatchCustomAssertions {
    elementCount(
      selectorOrObject: string | EnhancedElementInstance,
      count: number,
      message?: string,
    ): NightwatchAPI;
    outputContains(search: string, message?: string): NightwatchAPI;
    eventFired(event: string, message?: string): NightwatchAPI;
    noEventFired(message?: string): NightwatchAPI;
    eventContains(search: string, message?: string): NightwatchAPI;
    menuHasEdit(): NightwatchAPI;
    menuHasRemove(): NightwatchAPI;
    menuHasAppend(...types: XmlNodeTypes[]): NightwatchAPI;
    menuHasPrepend(...types: XmlNodeTypes[]): NightwatchAPI;
    menuHasInsertAfter(...types: XmlNodeTypes[]): NightwatchAPI;
    menuHasInsertBefore(...types: XmlNodeTypes[]): NightwatchAPI;
  }

  interface NightwatchAPI {
    assert: NightwatchCustomAssertions;
  }
}
