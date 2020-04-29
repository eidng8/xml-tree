/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { cloneObject, kvpArray, kvpObject } from '../../src';

describe('kvpArray', () => {
  it('coverts object to kvp array', () => {
    expect.assertions(1);
    expect(kvpArray({ a: 1, b: '2', c: [] })).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: '2' },
      { key: 'c', value: [] },
    ]);
  });

  it('coverts array to kvp array', () => {
    expect.assertions(1);
    expect(kvpArray([1, 'a', {}] as { [key: number]: unknown })).toEqual([
      { key: '0', value: 1 },
      { key: '1', value: 'a' },
      { key: '2', value: {} },
    ]);
  });

  it('removes undefined items', () => {
    expect.assertions(1);
    expect(kvpArray({ a: 1, b: '2', c: undefined }, 'k', 'v')).toEqual([
      { k: 'a', v: 1 },
      { k: 'b', v: '2' },
    ]);
  });

  it('keeps undefined items', () => {
    expect.assertions(1);
    expect(
      kvpArray({ a: 1, b: '2', c: undefined }, undefined, undefined, {
        keepUndefined: true,
      }),
    ).toEqual([
      { key: 'a', value: 1 },
      { key: 'b', value: '2' },
      { key: 'c', value: undefined },
    ]);
  });
});

describe('kvpObject', () => {
  it('coverts kvp array to object', () => {
    expect.assertions(1);
    expect(
      kvpObject([
        { key: 'a', value: 1 },
        { key: 'b', value: '2' },
        { key: 'c', value: [] },
      ]),
    ).toEqual({ a: 1, b: '2', c: [] });
  });

  it('removes undefined items', () => {
    expect.assertions(1);
    expect(kvpObject([{ k: 'a', v: 1 }, { k: 'b' }], 'k', 'v')).toEqual({
      a: 1,
    });
  });

  it('keeps undefined items', () => {
    expect.assertions(1);
    expect(
      kvpObject([{ key: 'a', value: 1 }, { key: 'b' }], undefined, undefined, {
        keepUndefined: true,
      }),
    ).toEqual({ a: 1, b: undefined });
  });
});

describe('clone', () => {
  it('clones object deeply', () => {
    expect.assertions(5);
    const fixture = {
      a: {
        b: {
          c: 'd',
        },
      },
    };
    const actual = cloneObject(fixture) as {
      a: { b: { c: string } };
      e: string;
    };
    expect(actual).not.toBe(fixture);
    expect(actual.a).not.toBe(fixture.a);
    expect(actual.a.b).not.toBe(fixture.a.b);
    expect(actual).toEqual(fixture);
    actual.e = 'f';
    expect(actual).not.toEqual(fixture);
  });

  it('ignores specified keys', () => {
    const fixture = {
      a: {
        b: {
          c: 'd',
        },
      },
      e: 'f',
    };
    const actual = cloneObject(fixture, ['e']) as {
      a: { b: { c: string } };
      e: string;
    };
    delete fixture.e;
    expect(actual).toEqual(fixture);
  });
});
