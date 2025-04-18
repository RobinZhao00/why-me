import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  assetPrefix: isProd ? 'https://latteai.com/why-me/' : undefined,
  distDir: 'dist',
  output: 'export', // ⭐️ 表示导出为纯静态文件（配合 getStaticProps 使用）
};

export default nextConfig;
