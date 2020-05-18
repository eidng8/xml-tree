/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

declare module 'e2e/*' {
  import { EnhancedElementInstance, NightwatchAPI } from 'nightwatch';

  // noinspection JSUnusedGlobalSymbols
  interface ElementCommands {
    savePopup(): this;
    cancelPopup(): this;
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
  }

  interface NightwatchAPI {
    assert: NightwatchCustomAssertions;
  }
}
