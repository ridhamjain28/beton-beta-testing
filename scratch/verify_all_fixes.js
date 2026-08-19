const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Start simple static server
const PORT = 8081;
const SRC_DIR = path.join(__dirname, '../src');

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/resources.html';
  const filePath = path.join(SRC_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Test
  console.log('\n--- Running Desktop Test (1440x900) ---');
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto(`http://localhost:${PORT}/resources.html`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check no "progress_activity" text in document library
  const bodyText = await page.innerText('body');
  console.log('Contains "progress_activity" text:', bodyText.includes('progress_activity') ? 'FAIL (Found)' : 'PASS (Clean)');

  // Take screenshot of Document Library
  const artifactDir = 'C:/Users/vseri/.gemini/antigravity/brain/505357e3-8dbc-4ca5-b596-fe5555b24dce';
  await page.screenshot({ path: path.join(artifactDir, 'resources_library_clean.png') });
  console.log('Saved resources_library_clean.png');

  // Open BETON Price List
  console.log('Clicking Open on BETON Price List...');
  await page.locator('.doc-card').first().click();
  await page.waitForTimeout(2500);

  // Navigate to Page 4
  console.log('Navigating to Page 4...');
  await page.locator('#btn-next').click();
  await page.waitForTimeout(800);
  await page.locator('#btn-next').click();
  await page.waitForTimeout(1500);

  const desktopViewerScreen = path.join(artifactDir, 'resources_desktop_page4.png');
  await page.screenshot({ path: desktopViewerScreen });
  console.log('Saved resources_desktop_page4.png');

  // Test Previous button
  console.log('Testing Previous button navigation...');
  const pageBefore = await page.locator('#pg-input').inputValue();
  await page.locator('#btn-prev').click();
  await page.waitForTimeout(800);
  const pageAfter = await page.locator('#pg-input').inputValue();
  console.log(`Page before: ${pageBefore}, Page after clicking Prev: ${pageAfter} -> ${parseInt(pageAfter) < parseInt(pageBefore) ? 'PASS' : 'FAIL'}`);

  await context.close();

  // 2. Mobile Test
  console.log('\n--- Running Mobile Test (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`http://localhost:${PORT}/resources.html`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.locator('.doc-card').first().click();
  await mobilePage.waitForTimeout(2500);

  const mobileViewerScreen = path.join(artifactDir, 'resources_mobile_viewer.png');
  await mobilePage.screenshot({ path: mobileViewerScreen });
  console.log('Saved resources_mobile_viewer.png');

  await mobileContext.close();
  await browser.close();
  server.close();
  console.log('\nAll tests complete.');
});
