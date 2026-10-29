import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";

// Execute após npm run build e npm run start -- --port 3100.
const base = "http://localhost:3100";
const official = "https://nellvasantana.com.br/";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const results = {};
try {
  const response = await page.goto(base, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert(!/noindex/i.test(response.headers()["x-robots-tag"] || ""));
  const metadata = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    meta: Object.fromEntries([...document.querySelectorAll("meta[name],meta[property]")].map(m => [m.name || m.getAttribute("property"), m.content])),
    jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent)),
    h1: document.querySelectorAll("h1").length,
    main: document.querySelectorAll("main").length,
    missingAlt: [...document.images].filter(i => !i.hasAttribute("alt")).length,
    badAnchors: [...document.querySelectorAll('a[href^="#"]')].filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash),
  }));
  results.metadata = metadata;
  assert.equal(metadata.lang, "pt-BR");
  assert.equal(metadata.canonical, official);
  assert.equal(new URL(metadata.meta["og:url"]).href, official);
  assert.equal(metadata.meta["og:type"], "website");
  assert.equal(metadata.meta["og:locale"], "pt_BR");
  assert.equal(metadata.meta["twitter:card"], "summary_large_image");
  assert.equal(metadata.h1, 1);
  assert.equal(metadata.main, 1);
  assert.equal(metadata.missingAlt, 0);
  assert.deepEqual(metadata.badAnchors, []);
  assert(!/noindex|nofollow/.test(metadata.meta.robots || ""));
  assert.equal(metadata.jsonLd.length, 1);
  assert.equal(metadata.jsonLd[0].url, official);
  assert.equal(metadata.jsonLd[0].sameAs.length, 3);
  assert(!/localhost|vercel\.app/.test(JSON.stringify(metadata)));
  for (const key of ["og:image", "twitter:image"]) {
    assert(metadata.meta[key].startsWith(official));
    const url = new URL(metadata.meta[key]);
    const image = await fetch(base + url.pathname + url.search);
    assert.equal(image.status, 200);
    assert(image.headers.get("content-type").startsWith("image/"));
  }
  const sitemap = await fetch(base + "/sitemap.xml");
  assert.equal(sitemap.status, 200);
  results.sitemap = await page.evaluate(xml => {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    return { errors: doc.querySelectorAll("parsererror").length, namespace: doc.documentElement.namespaceURI, urls: [...doc.querySelectorAll("loc")].map(e => e.textContent), lastmod: doc.querySelectorAll("lastmod").length };
  }, await sitemap.text());
  assert.equal(results.sitemap.errors, 0);
  assert.equal(results.sitemap.namespace, "http://www.sitemaps.org/schemas/sitemap/0.9");
  assert.deepEqual(results.sitemap.urls, [official]);
  assert.equal(results.sitemap.lastmod, 0);
  const robots = await fetch(base + "/robots.txt");
  assert.equal(robots.status, 200);
  results.robots = await robots.text();
  assert(results.robots.includes("Allow: /"));
  assert(results.robots.includes("Sitemap: " + official + "sitemap.xml"));
  assert(!results.robots.includes("Disallow: /"));
  results.redirects = {};
  for (const [route, anchor] of Object.entries({ artista: "artista", agenda: "agenda", contato: "contato", galeria: "galeria", imprensa: "imprensa", musica: "musica", projetos: "projetos", trajetoria: "performances", videos: "videos" })) {
    const redirect = await fetch(base + "/" + route, { redirect: "manual" });
    assert.equal(redirect.status, 308);
    assert.equal(redirect.headers.get("location"), "/#" + anchor);
    results.redirects[route] = redirect.status;
  }
  assert.equal((await fetch(base + "/nao-existe")).status, 404);
  const icon = await fetch(base + "/icon");
  assert.equal(icon.status, 200);
  assert(icon.headers.get("content-type").startsWith("image/"));
  results.visual = [];
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const baseline = `/tmp/nellva-seo/before-${width}.png`;
    let samePixels = null;
    if (fs.existsSync(baseline)) {
      const shot = await page.screenshot({ path: `/tmp/nellva-seo/after-${width}.png`, fullPage: true, animations: "disabled" });
      samePixels = shot.equals(fs.readFileSync(baseline));
      const main = await page.locator("main").evaluate(el => el.outerHTML);
      assert.equal(main, JSON.parse(fs.readFileSync(`/tmp/nellva-seo/before-${width}.json`, "utf8")));
    }
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
    await page.getByRole("button", { name: "Fechar menu", exact: true }).waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    results.visual.push({ width, samePixels, mainUnchanged: fs.existsSync(baseline) ? true : null, menu: true });
  }
  assert.deepEqual(errors, []);
  results.browserErrors = errors;
  fs.writeFileSync(new URL("./validacao.json", import.meta.url), JSON.stringify(results, null, 2) + "\n");
  console.log("SEO validado: metadata, JSON-LD, sitemap XML, robots, imagens sociais, ícone, 9 redirects, 404, âncoras e menu em 390/1440px.");
  console.log(JSON.stringify(results.visual));
} finally {
  await browser.close();
}
