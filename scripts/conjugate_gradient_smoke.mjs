// After a Jekyll build: node scripts/conjugate_gradient_smoke.mjs.
// WIKI_SITE_ROOT, CG_SMOKE_DIR, PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, and
// MATHJAX_ASSET_ROOT (an optional local es5 directory) support offline QA.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { readFile, mkdir } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { tmpdir } from "node:os";

const siteRoot = resolve(process.env.WIKI_SITE_ROOT || "_site");
const shots = resolve(process.env.CG_SMOKE_DIR || `${tmpdir()}/cg-wiki-shots`);
const types = {".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".woff":"font/woff"};
await mkdir(shots, {recursive:true});
const browser = await chromium.launch({headless:true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
try {
  const page = await browser.newPage({viewport:{width:1200, height:900}});
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("http://wiki.test/**", async route => {
    try {
      const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
      const path = resolve(siteRoot, `.${pathname}${pathname.endsWith("/") ? "index.html" : ""}`);
      assert.ok(path.startsWith(siteRoot+sep));
      await route.fulfill({contentType:types[extname(path)] || "application/octet-stream", body:await readFile(path)});
    } catch { await route.fulfill({status:404, body:"Not found"}); }
  });
  if (process.env.MATHJAX_ASSET_ROOT) await page.route("https://cdn.jsdelivr.net/npm/mathjax@3/es5/**", async route => {
    const relative = new URL(route.request().url()).pathname.split("/es5/")[1];
    await route.fulfill({contentType:types[extname(relative)] || "application/octet-stream",
      body:await readFile(resolve(process.env.MATHJAX_ASSET_ROOT, relative))});
  });
  const root = page.locator("[data-cg-lab]");
  const field = key => root.locator(`[data-field="${key}"]`);
  const output = root.locator("[data-matrices]");
  const status = root.locator("[data-status]");
  const next = root.locator('[data-action="next"]'), reset = root.locator('[data-action="reset"]');
  const expected = [[1,66],[6,65],[30,29],[20,4],[0,0]];
  for (const language of ["en", "ko"]) {
    const suffix = language === "ko" ? "-ko" : "";
    const response = await page.goto(`http://wiki.test/wiki/linear-algebra/conjugate-gradient-method${suffix}/`);
    assert.equal(response.status(),200);
    await root.locator(".wiki-lab-controls").waitFor({state:"visible"});
    assert.match(await status.innerText(),language === "ko" ? /원문 자료 기준값/ : /Original-data baseline/);
    const text = () => output.innerText();
    for (let k=0; k<=4; k++) {
      const row = await text();
      const residual = Number(row.match(language === "ko" ? /실제 잔차 노름의 제곱 = (\S+)/ : /Squared true residual norm = (\S+)/)[1]);
      const energy = Number(row.match(language === "ko" ? /에너지 오차 노름의 제곱 = (\S+)/ : /Squared energy error norm = (\S+)/)[1]);
      assert.ok(Math.abs(residual-expected[k][0]) < 1e-8);
      assert.ok(Math.abs(energy-expected[k][1]) < 1e-8);
      if (k<4) await next.press("Enter");
    }
    assert.match(await text(), /\(-65, 24, -11, 6\)/);
    assert.equal(await next.isDisabled(),true);
    await reset.press("Enter");
    await field("step").focus(); await field("step").press("ArrowRight");
    assert.equal(await field("step").inputValue(),"1");
    for (const method of ["sd","pcg"]) {
      await field("method").selectOption(method);
      assert.match(await status.innerText(),language === "ko" ? /가상 실험/ : /Hypothetical experiment/);
      await field("step").press("End");
      assert.doesNotMatch(await text(), /NaN|Infinity/);
      if (method === "pcg") assert.match(await text(), /\(-65, 24, -11, 6\)/);
    }
    for (const value of ["0","-100","100","0.00000001"]) {
      await field("start").fill(value); await field("step").press("End");
      assert.equal(await field("start").getAttribute("aria-invalid"),"false");
      assert.doesNotMatch(await text(), /NaN|Infinity/);
    }
    for (const value of ["","101","-101"]) {
      await field("start").fill(value);
      assert.equal(await field("start").getAttribute("aria-invalid"),"true");
      assert.equal(await text(),""); assert.equal(await root.locator("svg circle").count(),0);
      assert.equal(await next.isDisabled(),true);
    }
    await reset.click();
    assert.equal(await field("start").inputValue(),"1");
    assert.equal(await page.locator(".post-content details").count(),8);
    for (const details of await page.locator(".post-content details").all()) {
      await details.locator("summary").press("Enter");
      assert.notEqual(await details.getAttribute("open"),null);
    }
    await page.waitForFunction(() => window.MathJax?.startup?.promise, null, {timeout:30000});
    await page.evaluate(() => window.MathJax.startup.promise);
    assert.ok(await page.locator("mjx-container").count()>80);
    assert.equal(await page.locator("mjx-merror,[data-mjx-error]").count(),0);
    const leftovers = await page.locator(".post-content").evaluate(el => {
      const copy = el.cloneNode(true); copy.querySelectorAll("mjx-container,script,pre").forEach(n=>n.remove());
      return copy.textContent.includes("$");
    });
    assert.equal(leftovers,false,"All inline and display equations rendered");
    for (const [width,scheme] of [[1200,"light"],[375,"light"],[375,"dark"]]) {
      await page.setViewportSize({width,height:900}); await page.emulateMedia({colorScheme:scheme});
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1),true);
      assert.equal(await root.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
      await root.screenshot({path:resolve(shots,`cg-${language}-${width}-${scheme}.png`),
        style:".site-header, .skip-link { visibility: hidden !important; }"});
    }
    const links = await page.locator('.post-content a[href^="/wiki/"], .post-header nav a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href")));
    for (const href of new Set(links)) {
      const pathname = new URL(href,"http://wiki.test").pathname;
      await readFile(resolve(siteRoot,`.${pathname}index.html`));
    }
    assert.ok(links.includes(`/wiki/linear-algebra/conjugate-gradient-method${language === "ko" ? "" : "-ko"}/`));
  }
  assert.deepEqual(errors,[]);
  // Progressive enhancement: the exact table and all exercise solutions survive without JS.
  const plain = await browser.newContext({javaScriptEnabled:false});
  await plain.route("http://wiki.test/**", async route => {
    const pathname=new URL(route.request().url()).pathname;
    const path=resolve(siteRoot,`.${pathname}${pathname.endsWith("/") ? "index.html" : ""}`);
    await route.fulfill({contentType:types[extname(path)] || "application/octet-stream",body:await readFile(path)});
  });
  const fallback = await plain.newPage();
  await fallback.goto("http://wiki.test/wiki/linear-algebra/conjugate-gradient-method/");
  assert.equal(await fallback.locator(".post-content table tbody tr").count(),5);
  assert.equal(await fallback.locator(".post-content details").count(),8);
  assert.equal(await fallback.locator("[data-cg-lab] noscript").isVisible(),true);
  await plain.close();
  console.log(`CG wiki checks passed in English and Korean; screenshots: ${shots}`);
} finally { await browser.close(); }
