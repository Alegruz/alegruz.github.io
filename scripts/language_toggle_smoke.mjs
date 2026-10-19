// After a Jekyll build: npm run wiki:language.
// WIKI_SITE_ROOT, LANGUAGE_SMOKE_DIR, and PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
// allow checks against an isolated build with a locally installed browser.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(process.env.WIKI_SITE_ROOT || "_site");
const shots = resolve(process.env.LANGUAGE_SMOKE_DIR || `${tmpdir()}/wiki-language-shots`);
const base = "http://wiki.test";
const types = {".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".svg":"image/svg+xml"};
const browser = await chromium.launch({headless:true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
await mkdir(shots, {recursive:true});

async function setup(options = {}, storageBlocked = false) {
  const context = await browser.newContext(options);
  await context.route(`${base}/**`, async route => {
    const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
    const path = resolve(root, `.${pathname}${pathname.endsWith("/") ? "index.html" : ""}`);
    assert.ok(path.startsWith(root+sep));
    try {
      await route.fulfill({contentType:types[extname(path)] || "application/octet-stream", body:await readFile(path)});
    } catch { await route.fulfill({status:404, body:"Not found"}); }
  });
  // These navigation checks do not need the equation renderer or external services.
  await context.route("https://cdn.jsdelivr.net/**", route => route.fulfill({contentType:"text/javascript", body:""}));
  if (storageBlocked) await context.addInitScript(() => {
    Storage.prototype.getItem = () => {throw new Error("Storage unavailable");};
    Storage.prototype.setItem = () => {throw new Error("Storage unavailable");};
  });
  return context;
}

async function switchLanguage(page, expectedPath) {
  const button = page.locator("#toggle-language");
  assert.equal(await button.isEnabled(),true);
  if (!(await button.isVisible())) await page.locator(".nav-menu-button").click();
  await button.press("Enter");
  await page.waitForURL(`${base}${expectedPath}`);
}

try {
  for (const width of [1200,375]) {
    const context = await setup({viewport:{width,height:900}});
    const page = await context.newPage(), errors = [];
    page.on("pageerror", error => errors.push(error.message));
    assert.equal((await page.goto(`${base}/wiki/`)).status(),200);
    assert.equal(await page.locator("html").getAttribute("lang"),"en");
    const enLinks = await page.locator(".home-shell section li a").evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href")));
    assert.ok(enLinks.length>0);
    assert.ok(enLinks.every(url=>!url.endsWith("-ko/")),"English index contains only English entries");
    assert.equal(await page.locator("#toggle-language").getAttribute("data-translation-ko"),"/wiki/ko/");
    await switchLanguage(page,"/wiki/ko/");
    assert.equal(await page.locator("html").getAttribute("lang"),"ko");
    assert.equal(await page.locator("h1").innerText(),"수학 위키");
    const koLinks = await page.locator(".home-shell section li a").evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href")));
    assert.ok(koLinks.length>0);
    assert.ok(koLinks.every(url=>url.endsWith("-ko/")),"Korean index contains only Korean entries");
    assert.equal(await page.locator('.site-nav a[href="/wiki/ko/"]').innerText(),"수학 위키");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await page.screenshot({path:resolve(shots,`korean-index-${width}.png`),fullPage:true});
    await switchLanguage(page,"/wiki/");
    assert.equal(await page.locator("html").getAttribute("lang"),"en");
    await page.goto(`${base}/wiki/linear-algebra/conjugate-gradient-method/`);
    await switchLanguage(page,"/wiki/linear-algebra/conjugate-gradient-method-ko/");
    assert.equal(await page.locator(".post-title").innerText(),"켤레기울기법");
    assert.equal(await page.locator("html").getAttribute("lang"),"ko");
    await page.reload();
    assert.match(await page.locator("#toggle-language").innerText(),/Switch to English/);
    await switchLanguage(page,"/wiki/linear-algebra/conjugate-gradient-method/");
    assert.equal(await page.locator(".post-title").innerText(),"Conjugate gradient method");
    // Inline home-page translations still work without navigating to another URL.
    await page.goto(`${base}/`);
    const button=page.locator("#toggle-language");
    if (!(await button.isVisible())) await page.locator(".nav-menu-button").click();
    await button.press("Enter");
    assert.equal(page.url(),`${base}/`);
    assert.equal(await page.locator("html").getAttribute("lang"),"ko");
    assert.equal(await page.locator('h2[data-lang="ko"]').isVisible(),true);
    assert.equal(await page.locator('h2[data-lang="en"]').isVisible(),false);
    // A wiki URL determines its language even when the saved preference is Korean.
    await page.goto(`${base}/wiki/`);
    assert.equal(await page.locator("html").getAttribute("lang"),"en");
    assert.deepEqual(errors,[]);
    await context.close();
  }

  const blocked = await setup({},true), page = await blocked.newPage();
  await page.goto(`${base}/wiki/`);
  await switchLanguage(page,"/wiki/ko/");
  assert.equal(await page.locator("html").getAttribute("lang"),"ko");
  await blocked.close();

  const missing = await setup(), unpaired = await missing.newPage();
  const path="/wiki/linear-algebra/lu-decomposition/";
  await unpaired.route(`${base}${path}`, async route => {
    const html=await readFile(resolve(root,`.${path}index.html`),"utf8");
    await route.fulfill({contentType:"text/html",body:html.replace(/data-translation-ko="[^"]*"/, 'data-translation-ko=""')});
  });
  await unpaired.goto(`${base}${path}`);
  assert.equal(await unpaired.locator("#toggle-language").isDisabled(),true);
  assert.equal(await unpaired.locator("#toggle-language").innerText(),"Korean translation unavailable");
  assert.equal(await unpaired.locator("html").getAttribute("lang"),"en");
  assert.equal(await unpaired.evaluate(()=>localStorage.getItem("lang")),null);
  await missing.close();
  console.log(`Wiki language switching passed on desktop/mobile, with blocked storage and missing translations; screenshots: ${shots}`);
} finally { await browser.close(); }
