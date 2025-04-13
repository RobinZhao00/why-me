import { defineConfig } from "eslint-define-config";

export default defineConfig({
  parser: "@typescript-eslint/parser",     // 使用 TypeScript 解析器
  parserOptions: {
    project: "./tsconfig.json",            // 指定 tsconfig 文件
    tsconfigRootDir: __dirname
  },
  extends: [
    "eslint:recommended",                   // 使用 ESLint 推荐规则
    "plugin:@typescript-eslint/recommended" // 使用 TypeScript 推荐规则
  ],
  plugins: ["@typescript-eslint"],
  env: {
    node: true,                             // Node 环境
    browser: true,                          // 浏览器环境（适用于前端）
    es2021: true
  },
  rules: {
    "no-console": "warn",                   // 控制控制台输出
    "@typescript-eslint/no-explicit-any": "off", // 关闭 any 类型警告
    // 可根据项目需要添加更多自定义规则
  },
  overrides: [
    {
      files: ["frontend/**/*.{ts,tsx}"],    // 仅对 frontend 目录下的 ts/tsx 文件生效
      parserOptions: {
        project: "./frontend/tsconfig.json"
      }
    },
    {
      files: ["backend/**/*.{ts}"],         // 仅对 backend 目录下的 ts 文件生效
      parserOptions: {
        project: "./backend/tsconfig.json"
      }
    }
  ]
});
