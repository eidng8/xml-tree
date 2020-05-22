/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {
  cloneObject,
  cloneWithoutHierarchy,
  createEmptyNode,
  isCDataNode,
  isCommentNode,
  isDeclarationNode,
  isDocTypeNode,
  isElementNode,
  isInstructionNode,
  isTextNode,
  kvpArray,
  kvpObject,
  objXml,
  XmlElement,
  xmlJs,
  XmlNode,
  XmlRoot,
} from '../../src';

describe('Type guards', () => {
  it('checks CDATA', () => {
    expect.assertions(1);
    expect(isCDataNode({ type: 'cdata' } as XmlNode)).toBe(true);
  });

  it('checks comment', () => {
    expect.assertions(1);
    expect(isCommentNode({ type: 'comment' } as XmlNode)).toBe(true);
  });

  it('checks DOCTYPE', () => {
    expect.assertions(1);
    expect(isDocTypeNode({ type: 'doctype' } as XmlNode)).toBe(true);
  });

  it('checks declaration', () => {
    expect.assertions(1);
    expect(isDeclarationNode({} as XmlNode)).toBe(true);
  });

  it('checks element', () => {
    expect.assertions(1);
    expect(isElementNode({ type: 'element' } as XmlNode)).toBe(true);
  });

  it('checks instruction', () => {
    expect.assertions(1);
    expect(isInstructionNode({ type: 'instruction' } as XmlNode)).toBe(true);
  });

  it('checks text', () => {
    expect.assertions(1);
    expect(isTextNode({ type: 'text' } as XmlNode)).toBe(true);
  });
});

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

describe('cloneObject', () => {
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

describe('cloneWithoutHierarchy', () => {
  it('clones object without parents and nodes', () => {
    expect.assertions(2);
    const fixture = {
      type: 'element',
      name: 'e',
      nodes: [],
      attributes: [],
      parent: {} as XmlRoot,
    };
    const actual = cloneWithoutHierarchy(fixture);
    expect(actual).not.toBe(fixture);
    expect(actual).toEqual({
      type: 'element',
      name: 'e',
      attributes: [],
    });
  });
});

describe('xmlJs', () => {
  it('converts xml to object', () => {
    expect.assertions(1);
    const actual = xmlJs('<a><b c="d"><e/></b></a>') as XmlElement;
    delete actual.nodes![0].parent;
    delete (actual.nodes![0] as XmlElement).nodes![0].parent;
    delete ((actual.nodes![0] as XmlElement).nodes![0] as XmlElement).nodes![0]
      .parent;
    expect(actual).toEqual({
      nodes: [
        {
          name: 'a',
          type: 'element',
          nodes: [
            {
              name: 'b',
              type: 'element',
              attributes: [{ name: 'c', value: 'd' }],
              nodes: [{ name: 'e', type: 'element' }],
            },
          ],
        },
      ],
    });
  });
});

describe('objXml', () => {
  it('converts object to xml fragment', () => {
    expect.assertions(1);
    const fixture = {
      nodes: [
        {
          name: 'a',
          type: 'element',
          attributes: [{ name: 'b', value: 'c' }],
        },
      ],
    };
    const actual = objXml(fixture);
    expect(actual).toBe('<a b="c"/>');
  });

  it('converts object to xml', () => {
    expect.assertions(1);
    const fixture = {
      declaration: {
        attributes: [
          {
            name: 'version',
            value: '1.0',
          },
          {
            name: 'encoding',
            value: 'utf-8',
          },
          {
            name: 'standalone',
          },
        ],
      },
      nodes: [
        {
          name: 'a',
          type: 'element',
          nodes: [
            {
              name: 'b',
              type: 'element',
              attributes: [{ name: 'c', value: 'd' }],
              nodes: [{ name: 'e', type: 'element' }],
            },
          ],
        },
      ],
    };
    const actual = objXml(fixture);
    expect(actual).toBe(
      `<?xml version="1.0" encoding="utf-8"?>
<a>
    <b c="d">
        <e/></b></a>`,
    );
  });
});

describe('createEmptyNode', () => {
  it('creates element', () => {
    expect(createEmptyNode('element')).toEqual({
      type: 'element',
      name: 'new-element',
      attributes: [],
    });
  });

  it('creates process instruction with attribute', () => {
    expect(createEmptyNode('instruction', true)).toEqual({
      type: 'instruction',
      name: 'new-instruction',
      attributes: [],
    });
  });
});
