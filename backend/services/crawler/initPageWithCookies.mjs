// services/crawler/utils/initPageWithCookies.mjs
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cookiePath = path.resolve(__dirname, '../cookies.json'); // or ./cookies.json based on your layout

export const initPageWithCookies = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  try {
    const exists = await fs.stat(cookiePath).then(() => true).catch(() => false);

    if (exists) {
      const cookies = JSON.parse(await fs.readFile(cookiePath, 'utf-8'));
      await page.setCookie(...cookies);
      console.log('[✔] 加载本地 cookie 成功，已带登录态访问页面');
    } else {
      console.log('[ℹ️] 未发现 cookie 文件，请手动登录...');
      await page.goto('https://www.zhipin.com/');
      await page.waitForTimeout(60_000); // 留 30 秒扫码登录

      const cookies = await page.cookies();
      await fs.writeFile(cookiePath, JSON.stringify(cookies, null, 2));
      console.log('[✔] 登录成功，cookie 已保存到本地');
    }
  } catch (err) {
    console.error('[✘] Cookie 初始化失败:', err.message);
  }

  return { browser, page };
};
