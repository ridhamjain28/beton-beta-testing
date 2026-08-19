const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8080/resources.html');
  await page.click('.doc-card[data-name="BETON Price List"]');
  await page.waitForSelector('#viewer-overlay.visible', { state: 'visible' });
  await page.waitForFunction(() => {
    const loading = document.getElementById('viewer-loading');
    return loading && (loading.style.display === 'none' || loading.style.opacity === '0');
  });
  await page.waitForTimeout(1000);

  const styles = await page.evaluate(() => {
    const vMain = document.getElementById('viewer-main');
    const flipArea = document.getElementById('flip-area');
    const bookEl = document.getElementById('book-el');

    return {
      vMain: {
        rect: vMain.getBoundingClientRect(),
        display: getComputedStyle(vMain).display,
        justify: getComputedStyle(vMain).justifyContent,
        align: getComputedStyle(vMain).alignItems,
      },
      flipArea: {
        rect: flipArea.getBoundingClientRect(),
        display: getComputedStyle(flipArea).display,
        justify: getComputedStyle(flipArea).justifyContent,
        align: getComputedStyle(flipArea).alignItems,
        inlineStyle: flipArea.getAttribute('style')
      },
      bookEl: {
        rect: bookEl.getBoundingClientRect(),
        display: getComputedStyle(bookEl).display,
        justify: getComputedStyle(bookEl).justifyContent,
        align: getComputedStyle(bookEl).alignItems,
        margin: getComputedStyle(bookEl).margin,
        inlineStyle: bookEl.getAttribute('style')
      }
    };
  });

  console.log(JSON.stringify(styles, null, 2));
  await browser.close();
})();
