export default {
  env: {
    es2021: true,
  },
  extends: ["plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    "no-await-in-loop": "off",
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
            group: "builtin",
            pattern: "@altv/shared",
            position: "after",
          },
          {
            group: "builtin",
            pattern: "@altv/server",
            position: "after",
          },
          {
            group: "builtin",
            pattern: "@altv/client",
            position: "after",
          },
          {
            group: "builtin",
            pattern: "@altv/natives",
            position: "after",
          },
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
