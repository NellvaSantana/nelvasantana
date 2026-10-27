import { chromium } from "playwright";
import fs from "node:fs";
const phase=process.argv[2]||"before";
const browser=await chromium.launch(); const results=[];
for(const [width,height] of [[375,812],[390,844],[768,1024],[1024,768],[1280,800],[1366,768],[1440,900],[1920,1080]]){
for(const zoom of width>=1024?[1,1.25]:[1]){
const page=await browser.newPage({viewport:{width:Math.round(width/zoom),height:Math.round(height/zoom)},deviceScaleFactor:zoom}); const errors=[];page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://localhost:3001",{waitUntil:"networkidle"});await page.evaluate(()=>document.fonts.ready);await page.locator(".one-hero img").evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.querySelectorAll(".one-hero img")].map(i=>({src:i.currentSrc,width:i.width,height:i.height,naturalWidth:i.naturalWidth})),hero:document.querySelector(".one-hero").getBoundingClientRect().toJSON()}));
await page.screenshot({path:`artifacts/hero-oficial/${phase}-${width}x${height}-${zoom*100}.png`});
await page.getByRole("button",{name:"Abrir menu",exact:true}).click();await page.getByRole("button",{name:"Fechar menu",exact:true}).waitFor({state:"visible"});const menu=await page.getByRole("button",{name:"Fechar menu",exact:true}).isVisible();await page.keyboard.press("Escape");results.push({width,height,zoom,...data,menu,errors});await page.close();}}
fs.writeFileSync(`artifacts/hero-oficial/${phase}.json`,JSON.stringify(results,null,2));await browser.close();console.log(`${phase}: ${results.length} cases; overflow ${results.filter(r=>r.overflow).length}; errors ${results.flatMap(r=>r.errors).length}; menus ${results.every(r=>r.menu)}`);
