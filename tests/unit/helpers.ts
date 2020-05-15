/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Wrapper } from '@vue/test-utils';

export async function expandTreeNode(
  wrapper: Wrapper<any>,
  node: string,
): Promise<void> {
  return wrapper.find(`${node} .g8-tree__node__entry`).trigger('click');
}

export async function rightClick(
  wrapper: Wrapper<any>,
  node: string,
): Promise<void> {
  return wrapper
    .find(`${node} .g8-tree__node__entry__label>:first-child`)
    .trigger('contextmenu');
}

export async function rightClickBadge(
  wrapper: Wrapper<any>,
  badge: string,
): Promise<void> {
  return wrapper.find(`${badge}>span`).trigger('contextmenu');
}

export async function rightClickDeclaration(
  wrapper: Wrapper<any>,
): Promise<void> {
  return wrapper.find('.g8-tree__node').trigger('contextmenu');
}

export async function click(
  wrapper: Wrapper<any>,
  item: string,
): Promise<void> {
  return wrapper.find(item).trigger('click');
}

export async function keyup(
  wrapper: Wrapper<any>,
  key: string,
  opts = {} as KeyboardEventInit,
  element?: Document | Element,
): Promise<void> {
  const evt = new KeyboardEvent('keyup', Object.assign({ key }, opts));
  (element || document).dispatchEvent(evt);
  return wrapper.vm.$nextTick();
}

export async function closePopup(wrapper: Wrapper<any>): Promise<void> {
  return click(wrapper, '.g8-xml__popup__footer button:last-child');
}

export async function savePopup(wrapper: Wrapper<any>): Promise<void> {
  return click(wrapper, '.g8-xml__popup__footer button');
}

export async function enterText(
  wrapper: Wrapper<any>,
  text: string,
  selector: string | Wrapper<any> = 'input',
  event = 'input',
): Promise<void> {
  const input = 'string' == typeof selector ? wrapper.find(selector) : selector;
  (input.element as HTMLInputElement).value = text;
  return input.trigger(event);
}

export async function enterRawXml(
  wrapper: Wrapper<any>,
  text: string,
  event = 'input',
): Promise<void> {
  return enterText(wrapper, text, '.g8-xml__popup__raw textarea', event);
}

export function inputValue(wrapper: Wrapper<any>, selector: string): string {
  return (wrapper.find(selector).element as HTMLTextAreaElement).value;
}

export function rawValue(wrapper: Wrapper<any>): string {
  return (wrapper.find('.g8-xml__popup__raw textarea')
    .element as HTMLTextAreaElement).value;
}

export async function addAttribute(wrapper: Wrapper<any>): Promise<void> {
  return click(
    wrapper,
    '.g8-xml__popup__attributes+.g8-xml__popup__control-group button',
  );
}
