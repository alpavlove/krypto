const prettierRules = require('eslint-config-prettier').rules

const prettierTypescriptRules = Object.keys(prettierRules)
  .filter((key) => key.includes('@typescript-eslint'))
  .reduce((obj, key) => {
    return {
      ...obj,
      [key]: prettierRules[key],
    }
  }, {})

module.exports = {
  parserOptions: {
    ecmaVersion: 2022,
  },
  env: {
    es2021: true,
  },
  plugins: ['import'],
  extends: [
    'eslint:recommended',
    'react-app',
    'standard',
    'plugin:cypress/recommended',
    'plugin:jsx-a11y/strict',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    'import/internal-regex': '^src/',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/ban-types': 'error',
        'camelcase': 'off',
        'indent': 'off',
        '@typescript-eslint/indent': 'error',
        '@typescript-eslint/member-delimiter-style': 'error',
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/prefer-interface': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        'jsx-a11y/label-has-for': 'off',
        'no-useless-constructor': 'off',
        'node/no-callback-literal': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        ...prettierTypescriptRules,
      },
    },
    {
      files: ['e2e/**/*'],
      rules: {
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.stories.ts', '**/*.stories.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  rules: {
    'eol-last': 'error',
    'linebreak-style': ['error', 'unix'],
    'curly': ['error', 'all'],
    'array-callback-return': 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/order': [
      'error',
      {
        'alphabetize': {
          order: 'asc',
          caseInsensitive: true,
        },
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always-and-inside-groups',
      },
    ],
    'prettier/prettier': 'error',
    'no-restricted-imports': [
      'error',
      {
        name: 'lodash',
        message: 'Please use lodash/x instead',
      },
    ],
  },
  globals: {
    cy: true,
  },
}
