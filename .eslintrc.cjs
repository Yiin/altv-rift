module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-await-in-loop': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'never',
        pathGroups: [
          {
            group: 'builtin',
            pattern: 'alt-server',
            position: 'after',
          },
          {
            group: 'builtin',
            pattern: 'alt-client',
            position: 'after',
          },
          {
            group: 'builtin',
            pattern: 'natives',
            position: 'after',
          },
          {
            group: 'internal',
            pattern: '@shared/**',
            position: 'before',
          },
          {
            group: 'internal',
            pattern: '@/**',
            position: 'before',
          },
        ],
        "pathGroupsExcludedImportTypes": []
      },
    ],
  },
};
