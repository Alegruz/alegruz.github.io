// After a Jekyll build: npm run wiki:householder.
// WIKI_SITE_ROOT and HOUSEHOLDER_SMOKE_DIR may point to temporary directories.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { tmpdir } from "node:os";

const siteRoot=resolve(process.env.WIKI_SITE_ROOT||"_site");
const outputRoot=resolve(process.env.HOUSEHOLDER_SMOKE_DIR||`${tmpdir()}/householder-wiki-smoke`);
const mime={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    const path=resolve(siteRoot,`.${pathname}${pathname.endsWith("/")?"index.html":""}`);
    if(!path.startsWith(siteRoot+sep))throw new Error("Outside site");
    const content=await readFile(path);
    res.writeHead(200,{"Content-Type":mime[extname(path)]||"application/octet-stream"});
    res.end(content);
  }catch{if(!res.headersSent)res.writeHead(404);res.end("Not found");}
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
  assert.equal((await page.goto(url("householder-reflection"),{waitUntil:"domcontentloaded"})).status(),200);
  const root=page.locator('[data-orthogonal-lab="householder"]');
  await root.locator(".wiki-lab-controls").waitFor({state:"visible"});
  const field=key=>root.locator(`[data-field="${key}"]`);
  const output=root.locator("[data-matrices]"),status=root.locator("[data-status]");
  const aim=root.locator('[data-action="aim"]'),reset=root.locator('[data-action="reset"]');
  const fill=async values=>{for(const [key,value] of Object.entries(values))await field(key).fill(String(value));};
  const reflected=async()=>{
    const text=await output.innerText(),match=text.match(/\nHx = \(([^)]+)\)/);
    assert.ok(match,text);assert.doesNotMatch(text,/NaN|Infinity/);
    return match[1].split(", ").map(Number);
  };
  const close=(actual,expected,tolerance=1e-5)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
  let y=await reflected();close(y[0],-5);close(y[1],0);
  assert.match(await status.innerText(),/Invented teaching baseline/);
  await fill({n1:0,n2:1});y=await reflected();assert.deepEqual(y,[3,-4]);
  await fill({n2:-10000});assert.deepEqual(await reflected(),y);
  await fill({n1:1,n2:0,x1:0,x2:4});assert.deepEqual(await reflected(),[0,4]);
  await fill({x1:0,x2:0});assert.deepEqual(await reflected(),[0,0]);assert.equal(await aim.isDisabled(),true);
  await fill({n1:0,n2:0});assert.match(await status.innerText(),/zero normal cannot define/);
  assert.equal(await output.innerText(),"");assert.equal(await root.locator("svg circle").count(),0);
  await fill({x1:3,x2:4});await aim.press("Enter");y=await reflected();close(y[0],-5);close(y[1],0);
  for(const [x1,x2] of [[-3,4],[0,5],[5,0],[-5,0],[1,1e-10],[10000,1e-12],[10000,10000]]){
    await fill({x1,x2});await aim.press("Enter");y=await reflected();
    close(y[0],(x1<0?1:-1)*Math.hypot(x1,x2),1e-5*Math.max(1,Math.hypot(x1,x2)));
    close(y[1],0,1e-9);
    assert.equal(await field("n2").getAttribute("aria-invalid"),"false");
  }
  // Different geometries must preserve length and bisect the joining segment.
  for(const [x1,x2,n1,n2] of [[2,7,3,1],[-4,2,-1,3],[8,-9,1,1],[1,2,5e-324,5e-324],[1e-12,-1e-12,0,1]]){
    await fill({x1,x2,n1,n2});y=await reflected();
    close(Math.hypot(...y),Math.hypot(x1,x2),1e-5*Math.max(1,Math.hypot(x1,x2)));
    const scale=Math.max(Math.abs(n1),Math.abs(n2)),normal=[n1/scale,n2/scale];
    close(normal[0]*(x1+y[0])/2+normal[1]*(x2+y[1])/2,0,1e-4);
  }
  for(const [key,value] of [["x1",""],["x1","10001"],["x1","0.0000000000001"],["n1",""]]){
    await reset.click();await field(key).fill(value);
    assert.equal(await field(key).getAttribute("aria-invalid"),"true");
    assert.equal(await output.innerText(),"");assert.equal(await aim.isDisabled(),true);
    assert.equal(await root.locator("svg circle").count(),0);
  }
  await reset.press("Enter");assert.equal(await field("x1").inputValue(),"3");
  await field("x1").press("ArrowUp");assert.match(await status.innerText(),/Hypothetical experiment/);
  await reset.click();
  assert.equal(await page.locator(".wiki-exercise details").count(),12);
  for(const details of await page.locator(".wiki-exercise details").all()){
    await details.locator("summary").press("Enter");assert.notEqual(await details.getAttribute("open"),null);
  }
  await page.waitForFunction(()=>typeof window.MathJax?.startup?.promise?.then==="function",null,{timeout:30000});
  await page.evaluate(()=>window.MathJax.startup.promise);
  assert.ok(await page.locator("mjx-container").count()>100);
  assert.equal(await page.locator("mjx-merror,[data-mjx-error]").count(),0);
  assert.equal(await page.locator(".post-content").evaluate(el=>{
    const clone=el.cloneNode(true);clone.querySelectorAll("mjx-container,script").forEach(n=>n.remove());
    return clone.textContent.includes("$");
  }),false,"No unrendered TeX delimiters");
  for(const [width,scheme] of [[1200,"light"],[375,"light"],[375,"dark"]]){
    await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:scheme});
    assert.equal(await root.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
    await root.screenshot({path:resolve(outputRoot,`lab-${width}-${scheme}.png`),style:".site-header { visibility: hidden !important; }"});
  }
  await page.setViewportSize({width:1200,height:900});await page.emulateMedia({colorScheme:"light"});
  for(const [id,name] of [["#calculate-the-reflector-and-read-its-geometry","calculation"],["#construct-a-reflection-that-zeros-a-column-tail","derivation"]]){
    await page.locator(id).scrollIntoViewIfNeeded();
    await page.screenshot({path:resolve(outputRoot,`${name}.png`)});
  }
  for(const name of ["householder-reflection","qr-factorization","gram-schmidt-orthogonalization","matrix-decomposition"]){
    await page.goto(url(name),{waitUntil:"domcontentloaded"});
    const links=await page.locator('.post-content a[href^="/wiki/"]').evaluateAll(nodes=>nodes.map(a=>a.getAttribute("href")));
    if(name!=="householder-reflection")assert.ok(links.includes("/wiki/linear-algebra/householder-reflection/"));
    for(const href of new Set(links)){
      const target=new URL(href,base),response=await page.request.get(target.href);
      assert.equal(response.status(),200,`${name}: ${href}`);
      if(target.hash)assert.ok((await response.text()).includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`Missing anchor: ${href}`);
    }
  }
  const plain=await browser.newContext({javaScriptEnabled:false}),nojs=await plain.newPage();
  await nojs.goto(url("householder-reflection"),{waitUntil:"domcontentloaded"});
  assert.equal(await nojs.locator(".wiki-lab-controls").isVisible(),false);
  assert.equal(await nojs.locator('img[src$="householder-reflection.svg"]').count(),1);
  assert.match(await nojs.locator(".wiki-lab-context").innerText(),/invented geometry/);
  const solution=nojs.locator(".wiki-exercise details").nth(1);await solution.locator("summary").press("Enter");
  assert.notEqual(await solution.getAttribute("open"),null);await plain.close();
  assert.deepEqual(errors,[]);
  console.log("Householder checks passed: reflection geometry, stable axis construction, degeneracy, input validation, keyboard controls, exercises, MathJax, links and anchors, mobile/dark layouts, and no-JavaScript reading.");
}finally{await browser?.close();await new Promise(done=>server.close(done));}
