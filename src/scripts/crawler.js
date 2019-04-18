const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const guardianTitles = await getGuardianTitles(page);
  const SpiegelTitles = await getSpiegelTitles(page);
  const timesTitles = await getTheTimesTitles(page);
  const southAfricanTitles = await getSouthAfricanTitles(page);
  const irishTitles = await getIrishTitles(page);
  const italianTitles = await getItalianTitles(page);
  const NUTitles = await getNUTitles(page);

  console.log( [{timestamp: new Date().getTime()}, ...guardianTitles, ...SpiegelTitles, ...timesTitles, ...southAfricanTitles, ...irishTitles, ...italianTitles, ...NUTitles])

  await browser.close();
})();

async function getGuardianTitles(page) {
  await page.goto('https://www.theguardian.com/international');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.fc-item__kicker');
    const allsubtitles = document.querySelectorAll('.js-headline-text');
    const subtitleArrays = Array.from(allsubtitles);
    return Array.from(alltitles).slice(0, 10).map((title, index) => {
      let subtitle = subtitleArrays[index]
      let res = {
        site: 'Guardian',
        title: title.textContent,
        subtitle: subtitle.textContent
      } 
      return res;
    });
  });
}

async function getSpiegelTitles(page) {
  await page.goto('https://www.spiegel.de/international/');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.headline');
    return Array.from(alltitles).map((title) => {
      let res = {
        site: 'der spiegel',
        title: title.textContent
      } 
      return res;
    });
  });
}

async function getTheTimesTitles(page) {
  await page.goto('https://www.thetimes.co.uk/?region=global');  
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.Item-headline a');
    return Array.from(alltitles).slice(0, 10).map((title) => {
      let res = {
        site: 'The Times',
        title: title.textContent
      } 
      return res;
    });
  });
}

async function getSouthAfricanTitles(page) {
  await page.goto('https://www.thesouthafrican.com/');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.jeg_post_title a');
    return Array.from(alltitles).slice(0, 10).map((title) => {
      let res = {
        site: 'South african',
        title: title.textContent
      } 
      return res;
    });
  });
}

async function getIrishTitles(page) {
  await page.goto('https://www.irishtimes.com/');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.jeg_post_title a');
    return Array.from(alltitles).slice(0, 10).map((title) => {
      let res = {
        site: 'Irish times',
        title: title.textContent
      } 
      return res;
    });
  });
}

async function getItalianTitles(page) {
  await page.goto('https://www.corriere.it/english/');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.title_art a');
    return Array.from(alltitles).slice(0, 10).map((title) => {
      let res = {
        site: 'Corriere',
        title: title.textContent
      } 
      return res;
    });
  });
}

async function getNUTitles(page) {
  await page.goto('https://www.nu.nl/');
  return results = await page.evaluate(() => {
    const alltitles = document.querySelectorAll('.heading1');
    return Array.from(alltitles).slice(0, 10).map((title) => {
      let res = {
        site: 'NU.nl',
        title: title.textContent
      } 
      return res;
    });
  });
}