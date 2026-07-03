import { chromium } from "@playwright/test";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { tmpdir } from "node:os";

const siteRoot = resolve("_site");
const outputRoot = resolve(process.env.VISUAL_SMOKE_DIR || join(tmpdir(), "alegruz-visual-smoke"));

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"]
]);

function resolveRequestPath(rawUrl) {
  const url = new URL(rawUrl, "http://127.0.0.1");
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  let target = normalize(join(siteRoot, pathname));
  if (!target.startsWith(siteRoot + sep)) {
    return null;
  }

  if (!existsSync(target) && !extname(target)) {
    target = join(target, "index.html");
  }
  if (!existsSync(target)) {
    const fallback = join(siteRoot, "404.html");
    return existsSync(fallback) ? { path: fallback, status: 404 } : null;
  }
  return { path: target, status: 200 };
}

function startServer() {
  const server = createServer((request, response) => {
    const resolved = resolveRequestPath(request.url || "/");
    if (!resolved) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const contentType = contentTypes.get(extname(resolved.path).toLowerCase()) || "application/octet-stream";
    response.writeHead(resolved.status, { "Content-Type": contentType });
    createReadStream(resolved.path).pipe(response);
  });

  return new Promise((resolveServer) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolveServer({ server, baseUrl: `http://127.0.0.1:${address.port}` });
    });
  });
}

function firstPostUrl() {
  const searchPath = join(siteRoot, "search.json");
  const records = JSON.parse(readFileSync(searchPath, "utf-8"));
  const first = records.find((record) => record.url);
  if (!first) {
    throw new Error("No post URL found in _site/search.json");
  }
  return first.url;
}

async function checkPage(browser, baseUrl, target) {
  const context = await browser.newContext({
    colorScheme: target.colorScheme || "light",
    viewport: target.viewport
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${target.path}`, { waitUntil: "networkidle" });

  const metrics = await page.evaluate(() => ({
    bodyTextLength: document.body.innerText.trim().length,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    title: document.title
  }));

  if (metrics.bodyTextLength < 20) {
    throw new Error(`${target.name}: page looks blank`);
  }
  if (metrics.scrollWidth > metrics.clientWidth + 2) {
    throw new Error(`${target.name}: horizontal overflow ${metrics.scrollWidth}px > ${metrics.clientWidth}px`);
  }

  await page.screenshot({
    path: join(outputRoot, `${target.name}.png`),
    fullPage: true
  });
  await context.close();
}

if (!existsSync(siteRoot)) {
  throw new Error("_site does not exist; run `bundle exec jekyll build` first");
}
mkdirSync(outputRoot, { recursive: true });

const postUrl = firstPostUrl();
const targets = [
  { name: "home-desktop", path: "/", viewport: { width: 1440, height: 1000 } },
  { name: "home-mobile", path: "/", viewport: { width: 390, height: 844 } },
  { name: "home-dark", path: "/", colorScheme: "dark", viewport: { width: 1440, height: 1000 } },
  { name: "post", path: postUrl, viewport: { width: 1440, height: 1000 } },
  { name: "series", path: "/series/", viewport: { width: 1280, height: 900 } },
  { name: "not-found", path: "/visual-smoke-missing-page/", viewport: { width: 1280, height: 900 } }
];

const { server, baseUrl } = await startServer();
try {
  const browser = await chromium.launch();
  try {
    for (const target of targets) {
      await checkPage(browser, baseUrl, target);
    }
  } finally {
    await browser.close();
  }
  console.log(`visual smoke passed (${targets.length} screenshots)`);
} finally {
  server.close();
}
