// Run after a Jekyll build: npm run wiki:smoke.
// WIKI_SITE_ROOT can point to another rendered site directory.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const siteRoot = resolve(process.env.WIKI_SITE_ROOT || "_site");
const mime = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".svg":"image/svg+xml" };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const path = resolve(siteRoot, `.${pathname}${pathname.endsWith("/") ? "index.html" : ""}`);
    if (!path.startsWith(siteRoot + sep)) throw new Error("Outside site");
    const content = await readFile(path);
    res.writeHead(200, {"Content-Type":mime[extname(path)] || "application/octet-stream"});
    res.end(content);
  } catch { res.writeHead(404); res.end("Not found"); }
});
await new Promise(done => server.listen(0,"127.0.0.1",done));
let browser;
try {
  browser = await chromium.launch({headless:true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {})});
  const page = await browser.newPage({viewport:{width:1200,height:900}});
  const errors=[];
  page.on("pageerror", error => errors.push(error.message));
  const base=`http://127.0.0.1:${server.address().port}`;
  const visit = async (name, exerciseDetails=16) => {
    const response=await page.goto(`${base}/wiki/linear-algebra/${name}/`,{waitUntil:"domcontentloaded"});
    assert.equal(response.status(),200);
    await page.locator(".wiki-lab-controls").waitFor({state:"visible"});
    const exercises=page.locator(exerciseDetails===16?".wiki-exercise details":".post-content details");
    assert.equal(await exercises.count(),exerciseDetails);
    const hint=exercises.first();
    assert.equal(await hint.getAttribute("open"),null);
    await hint.locator("summary").press("Enter");
    assert.notEqual(await hint.getAttribute("open"),null);
    const root=page.locator(".wiki-lab");
    return {root,field:key=>root.locator(`[data-field="${key}"]`),output:root.locator("[data-matrices]"),status:root.locator("[data-status]")};
  };

  let lab=await visit("matrix-decomposition");
  assert.match(await lab.output.innerText(),/Final output = \(3,1\)/);
  await lab.field("order").selectOption("CB");
  assert.match(await lab.output.innerText(),/Final output = \(4,1\)/);
  await lab.field("scale").focus();
  await lab.field("scale").press("ArrowRight");
  assert.match(await lab.output.innerText(),/Final output = \(4.2,1\)/);
  await lab.field("x1").fill("");
  assert.equal(await lab.field("x1").getAttribute("aria-invalid"),"true");
  assert.match(await lab.status.innerText(),/finite numbers/);
  await lab.field("x1").fill("1");
  await lab.field("scale").evaluate(el=>{el.value="0";el.dispatchEvent(new Event("input",{bubbles:true}));});
  assert.match(await lab.output.innerText(),/Final output = \(0,1\)/);

  lab=await visit("lu-decomposition");
  const next=lab.root.locator('[data-action="next"]');
  for(let i=0;i<3;i++)await next.click();
  assert.match(await lab.output.innerText(),/x from Ux = y: \(1,1\)/);
  assert.match(await lab.output.innerText(),/b − Ax: \(0,0\)/);
  await lab.field("preset").selectOption("zero");
  await next.click();
  assert.match(await lab.status.innerText(),/first pivot is zero/);
  assert.equal(await next.isDisabled(),true);
  await lab.field("pivot").check();
  for(let i=0;i<3;i++)await next.click();
  assert.match(await lab.output.innerText(),/x from Ux = y: \(1,1\)/);
  await lab.field("preset").selectOption("small");
  await lab.field("pivot").uncheck();
  await next.click();await next.click();
  assert.match(await lab.output.innerText(),/Multiplier m = 10000/);
  await lab.field("pivot").check();
  await next.click();await next.click();
  assert.match(await lab.output.innerText(),/Multiplier m = 0.0001/);
  await lab.field("preset").selectOption("singular");
  await next.click();await next.click();
  assert.match(await lab.status.innerText(),/second pivot is zero/);
  assert.equal(await next.isDisabled(),true);
  await lab.root.locator('[data-action="reset"]').click();
  assert.match(await lab.status.innerText(),/Step 0/);
  await lab.field("a").fill("");
  assert.equal(await next.isDisabled(),true);

  lab=await visit("cholesky-decomposition");
  assert.match(await lab.output.innerText(),/Remaining squared length c − b²\/a = 2/);
  assert.match(await lab.status.innerText(),/Positive definite/);
  await lab.field("preset").selectOption("flat");
  assert.match(await lab.status.innerText(),/flat direction/);
  assert.match(await lab.output.innerText(),/has energy 0/);
  await lab.field("preset").selectOption("indefinite");
  assert.match(await lab.status.innerText(),/indefinite/);
  assert.match(await lab.output.innerText(),/has energy -1/);
  await lab.field("preset").selectOption("negative");
  assert.match(await lab.status.innerText(),/Positive definite/);
  await lab.field("preset").selectOption("near");
  assert.match(await lab.status.innerText(),/remainder is small/);
  await lab.field("a").fill("0");
  assert.match(await lab.status.innerText(),/first square-root pivot is not positive/);
  await lab.field("a").fill("10001");
  assert.equal(await lab.field("a").getAttribute("aria-invalid"),"true");
  await lab.field("preset").selectOption("ordinary");
  await lab.field("b").focus();await lab.field("b").press("ArrowRight");
  assert.match(await lab.output.innerText(),/7.9599/);
  // x=(1,-1): 4 - 2(2.01) + 3 = 2.98.
  assert.match(await lab.output.innerText(),/xᵀAx for x = \(1, -1\): 2.98/);

  lab=await visit("vector-norm",8);
  assert.match(await lab.output.innerText(),/1-norm = 7\n2-norm = 5\nInfinity norm = 4/);
  await lab.field("norm").selectOption("inf");
  assert.match(await lab.output.innerText(),/Normalized vector = \(0.75,-1\)/);
  await lab.field("x1").fill("0");await lab.field("x2").fill("0");
  assert.match(await lab.status.innerText(),/normalization is undefined/);
  await lab.field("x1").fill("");
  assert.equal(await lab.field("x1").getAttribute("aria-invalid"),"true");
  await lab.field("x1").fill("1");await lab.field("x2").fill("1");
  await lab.field("norm").selectOption("1");
  assert.match(await lab.output.innerText(),/Normalized vector = \(0.5,0.5\)/);

  lab=await visit("matrix-norm",8);
  assert.match(await lab.output.innerText(),/Induced 1-norm = 4/);
  assert.match(await lab.output.innerText(),/Spectral norm = 2.92081/);
  await lab.field("angle").focus();await lab.field("angle").press("ArrowRight");
  assert.equal(await lab.field("angle").inputValue(),"91");
  for(const [key,value] of Object.entries({a:0,b:5,c:0,d:0}))await lab.field(key).fill(String(value));
  assert.match(await lab.output.innerText(),/Spectral norm = 5/);
  await lab.field("b").fill("0");
  assert.match(await lab.output.innerText(),/Spectral norm = 0/);
  assert.match(await lab.status.innerText(),/Direction stretch: 0/);
  await lab.field("a").fill("");
  assert.equal(await lab.field("a").getAttribute("aria-invalid"),"true");

  for(const name of ["matrix-decomposition","lu-decomposition","cholesky-decomposition","vector-norm","matrix-norm"]){
    await visit(name,name.endsWith("-norm")?8:16);
    await page.setViewportSize({width:375,height:850});
    assert.equal(await page.locator(".wiki-lab").evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
    await page.emulateMedia({colorScheme:"dark"});
    assert.equal(await page.locator(".wiki-lab-controls").isVisible(),true);
  }
  const noJS=await browser.newContext({javaScriptEnabled:false});
  const staticPage=await noJS.newPage();
  await staticPage.goto(`${base}/wiki/linear-algebra/cholesky-decomposition/`,{waitUntil:"commit"});
  assert.equal(await staticPage.locator(".wiki-lab-controls").isVisible(),false);
  assert.equal(await staticPage.locator("noscript").isVisible(),true);
  const solution=staticPage.locator(".wiki-exercise details").nth(1);
  await solution.locator("summary").click();
  assert.notEqual(await solution.getAttribute("open"),null);
  for(const name of ["vector-norm","matrix-norm"]){
    await staticPage.goto(`${base}/wiki/linear-algebra/${name}/`,{waitUntil:"domcontentloaded"});
    assert.equal(await staticPage.locator(".wiki-lab-controls").isVisible(),false);
    assert.equal(await staticPage.locator("noscript").isVisible(),true);
    const answer=staticPage.locator(".post-content details").nth(1);
    await answer.locator("summary").click();
    assert.notEqual(await answer.getAttribute("open"),null);
  }
  await noJS.close();
  assert.deepEqual(errors,[]);
  console.log("Wiki labs passed: composition order, keyboard controls, LU pivoting and singularity, Cholesky boundaries, vector and matrix norms, invalid inputs, 32 exercise solutions, mobile layout, dark mode, and no-JavaScript reading.");
} finally {
  if(browser)await browser.close();
  await new Promise(done=>server.close(done));
}
