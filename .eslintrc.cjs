module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    // 禁止提交调试用的 console.log
    "no-console": ["error", { allow: ["warn", "error"] }],
    // 统一使用 @/utils/storage 的 Local
    "no-restricted-globals": ["error", { name: "localStorage", message: "请使用 @/utils/storage 的 Local" }],
    "no-restricted-properties": [
      "error",
      { object: "window", property: "localStorage", message: "请使用 @/utils/storage 的 Local" },
    ],
    // 一律用 @/ 别名导入
    "no-restricted-imports": [
      "error",
      { patterns: [{ group: ["../*", "../**"], message: "请使用 @/ 别名导入" }] },
    ],
  },
  overrides: [
    {
      files: ["src/utils/storage.ts"],
      rules: {
        "no-restricted-globals": "off",
        "no-restricted-properties": "off",
      },
    },
  ],
};
