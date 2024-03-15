/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaVersion: "latest",
  },
  plugins: ["import"],
  rules: {
    "vue/no-unused-vars": "error",
    "vue/multi-word-component-names": "off",
    endOfLine: "auto",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "unknown",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "never",
        pathGroups: [
          {
            group: "internal",
            pattern: "@shared/**",
            position: "before",
          },
          {
            group: "internal",
            pattern: "@/**",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: [],
      },
    ],
  },
};
