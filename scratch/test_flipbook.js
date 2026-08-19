const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:8080/resources.html...');
  await page.goto('http://localhost:8080/resources.html', { waitUntil: 'networkidle' });

  console.log('Clicking Open on BETON Price List card...');
  const card = page.locator('.doc-card[data-name="BETON Price List"]');
  await card.waitFor({ state: 'visible' });
  await card.click();

  console.log('Waiting for viewer overlay and PDF loading...');
  await page.waitForSelector('#viewer-overlay.visible', { state: 'visible' });
  
  // Wait until loading overlay vanishes or flip-area gets populated
  await page.waitForFunction(() => {
    const loading = document.getElementById('viewer-loading');
    return loading && (loading.style.display === 'none' || loading.style.opacity === '0');
  }, { timeout: 15000 });

  // Give additional time for page-flip rendering
  await page.waitForTimeout(1000);

  console.log('Navigating to Page 4...');
  const pgInput = page.locator('#pg-input');
  await pgInput.fill('4');
  await pgInput.press('Enter');

  // Wait for flip animation / render to complete
  await page.waitForTimeout(1500);

  // Get current page number displayed in UI
  const currentPageVal = await pgInput.inputValue();
  console.log(`Current page input value: ${currentPageVal}`);

  // Get bounding box of the flipbook container and pages
  const metrics = await page.evaluate(() => {
    const vMain = document.getElementById('viewer-main');
    const flipArea = document.getElementById('flip-area');
    const bookEl = document.getElementById('book-el');
    const pageFlipContainer = bookEl.querySelector('.st-page-flip') || bookEl.firstElementChild || bookEl;

    const vMainRect = vMain.getBoundingClientRect();
    const flipAreaRect = flipArea.getBoundingClientRect();
    const bookElRect = bookEl.getBoundingClientRect();
    const containerRect = pageFlipContainer.getBoundingClientRect();

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Check all page elements that are currently visible
    const pages = Array.from(document.querySelectorAll('.my-page')).map(p => {
      const rect = p.getBoundingClientRect();
      const style = window.getComputedStyle(p);
      return {
        id: p.id,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom },
        display: style.display,
        visibility: style.visibility
      };
    });

    return {
      screenWidth,
      screenHeight,
      vMainRect: { left: vMainRect.left, top: vMainRect.top, width: vMainRect.width, height: vMainRect.height },
      flipAreaRect: { left: flipAreaRect.left, top: flipAreaRect.top, width: flipAreaRect.width, height: flipAreaRect.height },
      bookElRect: { left: bookElRect.left, top: bookElRect.top, width: bookElRect.width, height: bookElRect.height },
      containerRect: { left: containerRect.left, top: containerRect.top, width: containerRect.width, height: containerRect.height, right: containerRect.right },
      pages
    };
  });

  console.log('Metrics:', JSON.stringify(metrics, null, 2));

  const screenW = metrics.screenWidth;
  const spreadLeft = metrics.containerRect.left;
  const spreadRight = metrics.containerRect.right;
  const spreadWidth = metrics.containerRect.width;
  const spreadCenter = spreadLeft + spreadWidth / 2;
  const screenCenter = screenW / 2;

  const leftPct = (spreadLeft / screenW) * 100;
  const rightPct = (spreadRight / screenW) * 100;
  const centerPct = (spreadCenter / screenW) * 100;

  console.log(`Screen Width: ${screenW}px`);
  console.log(`Spread Range: ${spreadLeft.toFixed(1)}px (${leftPct.toFixed(1)}%) to ${spreadRight.toFixed(1)}px (${rightPct.toFixed(1)}%)`);
  console.log(`Spread Width: ${spreadWidth.toFixed(1)}px`);
  console.log(`Spread Center: ${spreadCenter.toFixed(1)}px (${centerPct.toFixed(1)}%) vs Screen Center: ${screenCenter}px (50%)`);

  const isCenteredIn25to75 = (leftPct >= 20 && rightPct <= 80); // fits within 25%-75% or around middle screen
  const isHorizontallyCentered = Math.abs(spreadCenter - screenCenter) < 10;

  console.log(`Is horizontally centered in screen middle (25% - 75% region): ${isCenteredIn25to75}`);
  console.log(`Exact center offset from screen midpoint: ${(spreadCenter - screenCenter).toFixed(1)}px`);

  // Target paths for screenshot
  const targetDir1 = `C:\\Users\\vseri\\.gemini\\antigravity\\brain\\505357e3-8dbc-4ca5-b596-fe5555b24dce`;
  const targetDir2 = `C:\\Users\\vseri\\.gemini\\antigravity\\brain\\ca7b7454-667a-4c22-a13e-c731dcc94fcb`;

  if (!fs.existsSync(targetDir1)) fs.mkdirSync(targetDir1, { recursive: true });
  if (!fs.existsSync(targetDir2)) fs.mkdirSync(targetDir2, { recursive: true });

  const screenshotPath1 = path.join(targetDir1, 'resources_centered_flipbook.png');
  const screenshotPath2 = path.join(targetDir2, 'resources_centered_flipbook.png');

  await page.screenshot({ path: screenshotPath1, fullPage: false });
  await page.screenshot({ path: screenshotPath2, fullPage: false });

  console.log(`Saved screenshots to:`);
  console.log(` - ${screenshotPath1}`);
  console.log(` - ${screenshotPath2}`);

  await browser.close();
})();
