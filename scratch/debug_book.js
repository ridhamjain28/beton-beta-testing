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

  const pgInput = page.locator('#pg-input');
  await pgInput.fill('4');
  await pgInput.press('Enter');
  await page.waitForTimeout(1500);

  const debug = await page.evaluate(() => {
    const bookEl = document.getElementById('book-el');
    const kids = Array.from(bookEl.children).map(c => {
      const r = c.getBoundingClientRect();
      const s = window.getComputedStyle(c);
      return {
        tag: c.tagName,
        cls: c.className,
        rect: { left: r.left, width: r.width, right: r.right },
        margin: s.margin,
        display: s.display,
        position: s.position,
        left: s.left
      };
    });
    return {
      bookElRect: bookEl.getBoundingClientRect(),
      bookElStyle: window.getComputedStyle(bookEl).cssText,
      children: kids
    };
  });

  console.log('BookEl rect:', debug.bookElRect);
  console.log('Children:', debug.children);

  await browser.close();
})();
