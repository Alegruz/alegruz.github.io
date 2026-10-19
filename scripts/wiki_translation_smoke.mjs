// Run after Jekyll: npm run wiki:translation-smoke.
// WIKI_SITE_ROOT, WIKI_MATHJAX_ROOT (optional offline es5 directory), and
// PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH can override the local test environment.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const site = resolve(process.env.WIKI_SITE_ROOT || '_site');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff':'font/woff'};
const browser = await chromium.launch({headless:true,
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
let scenarios = 0;
try {
  const context = await browser.newContext({viewport:{width:1280,height:900}});
  const routeSite = async ctx => {
    await ctx.route('http://wiki.test/**', async route => {
      const url = new URL(route.request().url());
      const path = resolve(site, '.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : ''));
      assert.ok(path.startsWith(site + sep));
      try { await route.fulfill({contentType:mime[extname(path)] || 'application/octet-stream',body:await readFile(path)}); }
      catch { await route.fulfill({status:404,body:'Missing local asset'}); }
    });
    if (process.env.WIKI_MATHJAX_ROOT) await ctx.route('https://cdn.jsdelivr.net/npm/mathjax@3/es5/**', async route => {
      const path = resolve(process.env.WIKI_MATHJAX_ROOT, new URL(route.request().url()).pathname.split('/es5/')[1]);
      await route.fulfill({contentType:mime[extname(path)] || 'application/octet-stream',body:await readFile(path)});
    });
  };
  await routeSite(context);
  const en = await context.newPage(), ko = await context.newPage();
  const failures = [];
  for (const page of [en,ko]) page.on('pageerror', error => failures.push(error.message));
  const pages = [];
  for (const subject of ['linear-algebra','optimization']) {
    for (const slug of await readdir(`${site}/wiki/${subject}`)) {
      if (slug.endsWith('-ko')) pages.push(`/wiki/${subject}/${slug}/`);
    }
  }
  const visit = async (page, url) => {
    assert.equal((await page.goto('http://wiki.test' + url)).status(),200,url);
    await page.waitForFunction(() => Boolean(window.MathJax?.startup?.promise));
    await page.evaluate(() => window.MathJax.startup.promise);
    assert.equal(await page.locator('mjx-merror,[data-mjx-error]').count(),0,url + ' math errors');
  };
  const numbers = text => [...text.matchAll(/[-−]?\d+(?:\.\d+)?(?:e[-+]?\d+)?/g)].map(m => m[0]);
  const controls = root => root.locator('[data-field]').evaluateAll(nodes => nodes.map(n => ({
    key:n.dataset.field,tag:n.tagName,type:n.type,min:n.min,max:n.max,step:n.step,
    value:n.value,checked:n.checked,options:n.options ? [...n.options].map(o => [o.value,o.disabled]) : null
  })));
  const geometry = root => root.locator('svg').evaluateAll(nodes => nodes.map(svg => [...svg.querySelectorAll('*')].map(n => [
    n.tagName,[...n.attributes].filter(a => a.name !== 'aria-label').map(a => [a.name,a.value])
  ])));
  for (const url of pages) {
    await visit(en,url.replace('-ko/','/')); await visit(ko,url);
    assert.equal(await ko.locator('html').getAttribute('lang'),'ko');
    const structure = page => page.locator('.post-content h2,.post-content h3,.post-content h4').evaluateAll(ns => ns.map(n => [n.tagName,n.id]));
    const aSections=await structure(en),bSections=await structure(ko);
    assert.deepEqual(bSections.map(x=>x[0]),aSections.map(x=>x[0]),url+' heading levels');
    if(!url.includes('conjugate-gradient-method')) assert.deepEqual(bSections,aSections,url+' section anchors');
    assert.equal(await ko.locator('.post-content details').count(),await en.locator('.post-content details').count(),url + ' reveals');
    assert.equal(await ko.locator('mjx-container[display="true"]').count(),await en.locator('mjx-container[display="true"]').count(),url + ' formulas');
    assert.equal(await ko.locator('.wiki-translation-notice').count(),0,url + ' incomplete translation');
    const hints = ko.locator('.post-content details');
    if (await hints.count()) {
      await hints.first().locator('summary').press('Enter');
      assert.notEqual(await hints.first().getAttribute('open'),null);
    }
    const englishLabs = en.locator('[data-wiki-lab],[data-orthogonal-lab],[data-sparse-storage-lab]');
    const koreanLabs = ko.locator('[data-wiki-lab],[data-orthogonal-lab],[data-sparse-storage-lab]');
    assert.equal(await koreanLabs.count(),await englishLabs.count());
    for (let i=0;i<await englishLabs.count();i++) {
      const a=englishLabs.nth(i),b=koreanLabs.nth(i);
      await b.locator('.wiki-lab-controls').waitFor({state:'visible'});
      assert.deepEqual(await controls(b),await controls(a),url+' controls');
      const compare = async () => {
        assert.deepEqual(numbers(await b.locator('[data-matrices]').innerText()),numbers(await a.locator('[data-matrices]').innerText()),url+' numeric results');
        assert.deepEqual(await geometry(b),await geometry(a),url+' plot geometry');
        assert.match(await b.locator('[data-status]').innerText(),/[가-힣]/,url+' Korean status');
        assert.match(await b.locator('[data-explanation]').innerText(),/[가-힣]/,url+' Korean explanation');
        scenarios++;
      };
      const both = async action => {await action(a);await action(b);await compare();};
      const reset = async () => {
        if(await a.locator('[data-action="reset"]').count()) await both(r=>r.locator('[data-action="reset"]').click());
      };
      await compare();
      for (const key of await a.locator('select[data-field]').evaluateAll(ns=>ns.map(n=>n.dataset.field))) {
        const values=await a.locator(`[data-field="${key}"] option:not([disabled])`).evaluateAll(ns=>ns.map(n=>n.value));
        for (const value of values) {
          await both(r=>r.locator(`[data-field="${key}"]`).selectOption(value));
          const next=a.locator('[data-action="next"]');
          if(key==='preset' && await next.count()) {
            for(let step=0;step<3 && !await next.isDisabled();step++) await both(r=>r.locator('[data-action="next"]').click());
          }
        }
        await reset();
      }
      for(const action of ['next','equal-weights','boundary','aim']) {
        const button=a.locator(`[data-action="${action}"]`);
        if(await button.count()) {
          await reset();
          for(let step=0;step<(action==='next'?3:1) && !await button.isDisabled();step++) await both(r=>r.locator(`[data-action="${action}"]`).press('Enter'));
          await reset();
        }
      }
      const field=a.locator('input[type="number"]').first();
      if(await field.count()) {
        const key=await field.getAttribute('data-field'),value=await field.inputValue();
        await both(r=>r.locator(`[data-field="${key}"]`).fill(''));
        assert.equal(await b.locator(`[data-field="${key}"]`).getAttribute('aria-invalid'),'true');
        await both(r=>r.locator(`[data-field="${key}"]`).fill('0'));
        await both(r=>r.locator(`[data-field="${key}"]`).fill(value));
      }
      const slider=a.locator('input[type="range"]').first();
      if(await slider.count()) {
        const key=await slider.getAttribute('data-field');
        await both(r=>r.locator(`[data-field="${key}"]`).press('ArrowRight'));
      }
      // Dependent columns and a zero reflection normal need distinct guard paths.
      const kind=await a.getAttribute('data-orthogonal-lab');
      if(kind==='gram-schmidt') {
        for(const key of ['a1','a2','a3']) await both(r=>r.locator(`[data-field="${key}"]`).fill('1'));
        assert.match(await b.locator('[data-status]').innerText(),/나머지.*0/);
      }
      if(kind==='householder') {
        for(const key of ['n1','n2']) await both(r=>r.locator(`[data-field="${key}"]`).fill('0'));
        assert.match(await b.locator('[data-status]').innerText(),/영 법선/);
      }
    }
    // Every Korean link with a fragment must find its destination and anchor.
    const links=await ko.locator('.post-content a[href^="/wiki/"]').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));
    for(const link of links) {
      const parsed=new URL(link,'http://wiki.test');
      const html=await readFile(resolve(site,'.'+parsed.pathname,'index.html'),'utf8');
      if(parsed.hash) assert.ok(html.includes(`id="${decodeURIComponent(parsed.hash.slice(1))}"`),link+' anchor');
    }
    await ko.setViewportSize({width:375,height:812});
    assert.ok(await ko.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),url+' mobile overflow');
    await ko.setViewportSize({width:1280,height:900});
  }
  for(const [url,suffix] of [['/wiki/',''],['/wiki/ko/','-ko']]) {
    await en.goto('http://wiki.test'+url);
    const links=await en.locator('.home-shell section li > a').evaluateAll(ns=>ns.map(n=>n.getAttribute('href')));
    assert.equal(links.length,pages.length);
    assert.ok(links.every(link=>suffix?link.endsWith('-ko/'):!link.endsWith('-ko/')));
  }
  const plain=await browser.newContext({javaScriptEnabled:false});await routeSite(plain);
  const nojs=await plain.newPage();await nojs.goto('http://wiki.test/wiki/linear-algebra/vector-norm-ko/');
  assert.equal(await nojs.locator('nav[aria-label="문서 언어"] a').getAttribute('href'),'/wiki/linear-algebra/vector-norm/');
  assert.match(await nojs.locator('noscript').first().innerText(),/JavaScript/);
  assert.equal(failures.length,0,failures.join('\n'));
  console.log(`Passed ${pages.length} complete Korean pages and ${scenarios} paired lab states: sections, math, reveals, links, mobile layout, numeric outputs, plot geometry, controls, guards, keyboard use and no-JavaScript fallback.`);
} finally { await browser.close(); }
