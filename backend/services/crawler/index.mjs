import puppeteer from 'puppeteer';
import { fetchJobList } from './fetchList.mjs';
import { fetchJobDetails } from './fetchDetail.mjs';
import { saveToJson } from './storage.mjs';
import { initPageWithCookies } from './initPageWithCookies.mjs';

const browser = await puppeteer.launch({
  // headless: 'new'
  headless: false, // ✅ 设置为 false，显示浏览器
  defaultViewport: null, // 可选：使用默认分辨率
  slowMo: 50,            // 可选：让浏览器每个操作慢 50ms，方便观察
});

try {
  const jobInfoList = await fetchJobList({ browser, maxPages: 50 });
  await fetchJobDetails({ browser, jobInfoList });
} catch (error) {
  console.error('🛑 程序异常：', error);
} finally {
  // await browser.close();
  console.log('✅ 全部抓取完成');
}