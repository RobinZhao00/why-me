import cliProgress from 'cli-progress';
import { delay, getRandomUserAgent } from './utils.mjs';
import { job } from './template.mjs';
import { saveToJson } from './storage.mjs';

export const fetchJobList = async ({
  browser, cityCode = '101020100', keyword = '前端开发工程师', maxPages = 10
}) => {
  const jobInfoList = [];

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(maxPages, 0);

  for (let pg = 1; pg <= maxPages; pg++) {
    const url = `https://www.zhipin.com/web/geek/job?query=${encodeURIComponent(keyword)}&city=${cityCode}&page=${pg}`;
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUserAgent());
    try {
      // console.log(`🔍 正在抓取第 ${pg} 页`);
      await page.goto(url, { waitUntil: 'networkidle2' });
      const content = await page.evaluate((jobFunction) => {
        return eval(`(${jobFunction})(document)`);
      }, job.toString());
      jobInfoList.push(...content)
      bar.update(pg);
    } catch (err) {
      console.warn(`❌ 第 ${pg} 页抓取失败：${err.message}`);
    } finally {
      await page.close();
    }
    await delay(3000);
  }
  bar.stop();
  // console.log('jobInfoList', jobInfoList);
  saveToJson(jobInfoList, { filename: 'job_list', key: 'key' });
  console.log(`📦 共 ${jobInfoList.length} 个职位链接`);
  return jobInfoList;
};
