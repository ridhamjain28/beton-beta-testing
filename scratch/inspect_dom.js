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

  const domInfo = await page.evaluate(() => {
    const flipArea = document.getElementById('flip-area');
    const bookEl = document.getElementById('book-el');
    
    function dumpEl(el) {
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right },
        style: {
          display: style.display,
          position: style.position,
          justifyContent: style.justifyContent,
          alignItems: style.alignItems,
          margin: style.margin,
          padding: style.padding,
          width: style.width,
          height: style.height,
          left: style.left,
          transform: style.transform
        },
        children: Array.from(el.children).map(c => dumpEl(c))
      };
    }

    return {
      flipArea: dumpEl(flipArea),
      bookEl: dumpEl(bookEl)
    };
  });

  console.log(JSON.stringify(domInfo, null, 2));
  await browser.close();
})();
