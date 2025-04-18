import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建 FlatCompat 实例
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint 配置
const eslintConfig = [
  globalIgnores(['frontend/dist/','frontend/.next/', 'node_modules', '.history', 'dist']),
  {
    // 忽略的文件和文件夹
    // 匹配的文件类型
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
  },
  ...compat.config({
    // 继承的配置
    extends: ["next/core-web-vitals", "next/typescript"],
    // 自定义规则
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "frontend/src/app"],
      'react/no-unescaped-entities': 'off', // 关闭未转义实体的警告
      '@next/next/no-page-custom-font': 'off', // 关闭自定义字体的警告
      'no-console': 'warn', // 将 console 警告级别设置为警告
    },
  })
];

// 导出 ESLint 配置
export default eslintConfig;