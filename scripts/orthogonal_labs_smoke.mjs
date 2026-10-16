// After a Jekyll build: npm run wiki:orthogonal.
// WIKI_SITE_ROOT and ORTHOGONAL_SMOKE_DIR can point to temporary directories.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { tmpdir } from "node:os";

const siteRoot=resolve(process.env.WIKI_SITE_ROOT||"_site");
const outputRoot=resolve(process.env.ORTHOGONAL_SMOKE_DIR||`${tmpdir()}/orthogonal-wiki-smoke`);
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    const path=resolve(siteRoot,`.${pathname}${pathname.endsWith("/")?"index.html":""}`);
    if(!path.startsWith(siteRoot+sep))throw new Error("Outside site");
    const content=await readFile(path);
    res.writeHead(200,{"Content-Type":mime[extname(path)]||"application/octet-stream"});res.end(content);
  }catch{res.writeHead(404);res.end("Not found");}
});
await mkdir(outputRoot,{recursive:true});
await new Promise((done,reject)=>{server.once("error",reject);server.listen(0,"127.0.0.1",done);});
let browser;
try{
  browser=await chromium.launch({headless:true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{})});
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  const base=`http://127.0.0.1:${server.address().port}`;
  const url=name=>`${base}/wiki/linear-algebra/${name}/`;
  const visit=async(name)=>{
    assert.equal((await page.goto(url(name),{waitUntil:"domcontentloaded"})).status(),200);
    const root=page.locator("[data-orthogonal-lab]");
    await root.locator(".wiki-lab-controls").waitFor({state:"visible"});
    assert.equal(await page.locator(".wiki-exercise details").count(),10);
    const first=page.locator(".wiki-exercise summary").first();await first.press("Enter");
    assert.notEqual(await first.locator("..").getAttribute("open"),null);
    return {root,field:key=>root.locator(`[data-field="${key}"]`),
      output:root.locator("[data-matrices]"),status:root.locator("[data-status]"),
      reset:root.locator('[data-action="reset"]')};
  };
  let lab=await visit("gram-schmidt-orthogonalization");
  assert.match(await lab.output.innerText(),/u₂ = \(-1, 0, 1\)/);
  assert.match(await lab.output.innerText(),/r₂₂ = ‖u₂‖₂ = 1.41421/);
  for(const key of ["a1","a2","a3"])await lab.field(key).fill("2");
  assert.match(await lab.status.innerText(),/computed remainder is zero/);
  assert.match(await lab.output.innerText(),/q₂ is not computed/);
  await lab.field("a3").fill("2.000000000000001");
  assert.match(await lab.status.innerText(),/relative resolution threshold/);
  await lab.field("a3").fill("2.000001");
  assert.match(await lab.status.innerText(),/nonzero remainder/);
  for(const value of ["","10001","0.0000000000001"]){
    await lab.field("a1").fill(value);
    assert.equal(await lab.field("a1").getAttribute("aria-invalid"),"true");
    assert.equal(await lab.root.locator("svg circle").count(),0);
    assert.equal(await lab.output.innerText(),"");
  }
  await lab.reset.press("Enter");
  assert.equal(await lab.field("a1").inputValue(),"0");
  assert.match(await lab.status.innerText(),/Invented teaching baseline/);
  await lab.field("a1").press("ArrowUp");
  assert.match(await lab.status.innerText(),/Hypothetical experiment/);
  await lab.reset.click();

  lab=await visit("qr-factorization");
  assert.match(await lab.output.innerText(),/x = \(intercept, slope\) = \(1.16667, 0.5\)/);
  assert.match(await lab.output.innerText(),/Sum of squared residuals = 0.166667/);
  for(const [key,value] of Object.entries({b1:2,b2:2,b3:5}))await lab.field(key).fill(String(value));
  assert.match(await lab.output.innerText(),/x = \(intercept, slope\) = \(1.5, 1.5\)/);
  assert.match(await lab.output.innerText(),/b − Ax = \(0.5, -1, 0.5\)/);
  for(const key of ["b1","b2","b3"])await lab.field(key).fill("0");
  assert.match(await lab.output.innerText(),/Residual norm = 0/);
  for(const [key,value] of Object.entries({b1:1,b2:3,b3:5}))await lab.field(key).fill(String(value));
  const lineOutput=await lab.output.innerText();
  const residual=Number(lineOutput.match(/Residual norm = (\S+)/)[1]);
  assert.ok(residual<1e-12,"Collinear data must fit within floating-point rounding");
  await lab.field("b1").fill("-10000");await lab.field("b3").fill("10000");
  assert.doesNotMatch(await lab.output.innerText(),/NaN|Infinity/);
  await lab.field("b2").fill("");assert.equal(await lab.output.innerText(),"");
  await lab.reset.press("Enter");assert.equal(await lab.field("b2").inputValue(),"2");

  // Real rendered anchors: catch stale section slugs and missing integration links.
  const sources=["gram-schmidt-orthogonalization","qr-factorization","matrix-decomposition","lu-decomposition","cholesky-decomposition"];
  for(const name of sources){
    await page.goto(url(name),{waitUntil:"domcontentloaded"});
    const links=await page.locator(".post-content a[href^='/wiki/linear-algebra/']").evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href")));
    if(!name.includes("factorization")&&!name.includes("orthogonalization")){
      assert.ok(links.includes("/wiki/linear-algebra/qr-factorization/"));
      assert.ok(links.includes("/wiki/linear-algebra/gram-schmidt-orthogonalization/"));
    }
    for(const href of new Set(links)){
      const target=new URL(href,base),response=await page.request.get(target.href);
      assert.equal(response.status(),200,`${name}: ${href}`);
      if(target.hash){
        const html=await response.text();
        assert.ok(html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`Missing anchor: ${href}`);
      }
    }
  }
  for(const name of ["gram-schmidt-orthogonalization","qr-factorization"]){
    lab=await visit(name);
    // Rendering math, not merely retaining TeX delimiters, is part of the check.
    await page.waitForFunction(()=>typeof window.MathJax?.startup?.promise?.then==="function",{},{timeout:60000});
    await page.evaluate(()=>window.MathJax.startup.promise);
    assert.ok(await page.locator("mjx-container").count()>30);
    assert.equal(await page.locator("mjx-merror, [data-mjx-error]").count(),0);
    await lab.root.screenshot({path:resolve(outputRoot,`${name}-desktop.png`),style:".site-header { visibility: hidden !important; }"});
    await page.locator(name.startsWith("gram")?"#worked-vectors-keep-the-new-part-then-normalize":"#shared-worked-example-the-gramschmidt-record-becomes-qr").scrollIntoViewIfNeeded();
    await page.screenshot({path:resolve(outputRoot,`${name}-math.png`)});
    await page.setViewportSize({width:375,height:850});
    await page.emulateMedia({colorScheme:"dark"});
    assert.equal(await lab.root.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await lab.root.screenshot({path:resolve(outputRoot,`${name}-mobile.png`),style:".site-header { visibility: hidden !important; }"});
    await page.setViewportSize({width:1200,height:900});
    await page.emulateMedia({colorScheme:"light"});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false}),plain=await nojs.newPage();
  for(const name of ["gram-schmidt-orthogonalization","qr-factorization"]){
    await plain.goto(url(name));
    assert.equal(await plain.locator(".wiki-lab-controls").isVisible(),false);
    assert.equal(await plain.locator(".wiki-exercise details").count(),10);
    const summary=plain.locator(".wiki-exercise summary").first();await summary.click();
    assert.notEqual(await summary.locator("..").getAttribute("open"),null);
    assert.match(await plain.locator(".wiki-lab-context").innerText(),/baseline here is invented/);
  }
  await nojs.close();assert.deepEqual(errors,[]);
  console.log("Orthogonal wiki checks passed: calculations, degeneracy, validation, keyboard controls, links and anchors, MathJax, desktop/mobile, dark mode, and no-JavaScript fallback.");
}finally{await browser?.close();await new Promise(done=>server.close(done));}
