/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const rules = {
  eqeqeq: 'off',
  yoda: [
    'error',
    'always',
    {
      exceptRange: true,
      onlyEquality: true,
    },
  ],
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
};

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules,
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['*.{ts?(x),vue}'],
      extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended',
      ],
      rules: Object.assign({}, rules, {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
          },
        ],
      }),
    },
  ],
};
