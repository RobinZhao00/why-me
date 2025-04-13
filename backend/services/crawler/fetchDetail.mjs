import { delay, getRandomUserAgent } from './utils.mjs';
import { jobDetail } from './template.mjs'
import { saveToJson } from './storage.mjs';

const fetchJobDetail = async (browser, url, retry = 3) => {
  for (let i = 0; i < retry; i++) {
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUserAgent());

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      const content = await page.evaluate((jobFunction) => {
        return eval(`(${jobFunction})(document)`);
      }, jobDetail.toString());

      return {
        key: url.match(/job_detail\/(.*?)\.html\?/)[1],
        url,
        ...content
      };
    } catch (err) {
      console.warn(`⚠️ 抓取失败（第 ${i + 1} 次尝试）：${url}`);
    } finally {
      await page.close();
      await delay(3000);
    }
  }

  return null;
};

export const fetchJobDetails = async ({ jobInfoList, browser }) => {
  const jobUrls = jobInfoList.map(item => item.url);
  for (let i = 0; i < jobUrls.length; i++) {
    const url = jobUrls[i];
    console.log(`📄 [${i + 1}/${jobUrls.length}] 抓取 ${url}`);
    const detail = await fetchJobDetail(browser, url);
    if (detail) {
      saveToJson(detail, { filename: 'job_detail', key: 'key' });
    } else {
      console.warn(`❌ 抓取详情失败，跳过：${url}`);
    }
  }
}
