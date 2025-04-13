export const job = (context = document) => {
  if (!context.title.includes('2025年上海人才招聘信息')) {
    return context.title;
  }
  const cardList = Array.from(
    context.querySelectorAll('.job-list-box .job-card-wrapper'),
  );
  return cardList.map((cardItem) => {
    const jobName = cardItem?.querySelector('.job-name')?.innerText;
    const [cityName, areaDistrict, businessDistrict] =
      cardItem.querySelector('.job-area')?.innerText.split('·') || [];
    const salaryDesc = cardItem.querySelector('.salary')?.innerText;
    const [jobExperience, jobDegree] = Array.from(
      cardItem.querySelectorAll('.tag-list li'),
    ).map((item) => item?.innerText);

    const skills = Array.from(
      cardItem.querySelectorAll('.job-card-footer .tag-list li'),
    ).map((itm) => itm?.innerText);

    const welfareList =
      cardItem
        .querySelector('.job-card-footer .info-desc')
        ?.innerText?.split('，') || [];

    const companyBlock = cardItem.querySelector('.job-card-right');
    const brandLogo = companyBlock.querySelector('.company-logo a img')?.src;
    const brandName = companyBlock.querySelector('.company-name a')?.innerText;
    const normalizeArray = (arr) => {
      if (arr.length === 3) return arr;
      if (arr.length === 2) return [arr[0], '', arr[1]];
      return arr; // 如果长度不是 2 或 3，按需决定怎么处理
    }
    const [brandIndustry, brandStageName, brandScaleName] = normalizeArray([
      ...companyBlock.querySelectorAll('.company-tag-list li'),
    ].map((itm) => itm?.innerText));

    const bossTitle = cardItem.querySelector(
      '.job-info .info-public em',
    )?.innerText;

    const bossName = cardItem
      .querySelector('.job-info .info-public')
      ?.innerHTML.replace(`<em>${bossTitle}</em>`, '');
    const bossOnline = cardItem.querySelector(
      '.job-info .boss-online-tag',
    )?.innerText;

    const jobDetailLink = cardItem.querySelector('.job-card-body >a').href;

    return {
      jobDesc: {
        jobName,
        salaryDesc,
        skills,
        welfareList,
        jobExperience,
        jobDegree,
        jobDetailLink,
      },
      geoInfo: {
        cityName,
        areaDistrict,
        businessDistrict,
      },
      company: {
        brandLogo,
        brandName,
        brandIndustry,
        brandStageName,
        brandScaleName,
      },
      hr: {
        bossName,
        bossTitle,
        bossOnline,
      },
      url: jobDetailLink,
      key: jobDetailLink.match(/job_detail\/(.*?)\.html\?/)[1],
    };
  });
};

export function jobDetail(context = document) {
  const rawData = context.querySelector('.job-sec-text')?.innerHTML || '';
  const formattedData = rawData.replace(/\s|：/g, '').split('<br>') || '';
  const idx = formattedData.indexOf('职位要求');
  return {
    jd: rawData.slice(1, idx),
    need: rawData.slice(idx + 1, rawData.length),
    rawData,
    date: new Date().toISOString().slice(0, 10)
  };
}
