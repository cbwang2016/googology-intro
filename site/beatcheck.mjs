// Usage: [PORT] [OUTDIR] node beatcheck.mjs <slug> [mode] [width] [height]
// Walks every story beat and reports beats whose content is taller than the viewport (needs scrolling).
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const [slug, mode = 'bi', width = '1200', height = '820'] = process.argv.slice(2)
const PORT = process.env.PORT || '4177'
const OUTDIR = process.env.OUTDIR || 'dist'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } })
await page.addInitScript((m) => { localStorage.setItem('googology-lang-mode', m); localStorage.setItem('googology-view-mode', 'story'); sessionStorage.clear() }, mode)
await page.goto(`http://localhost:${PORT}/#/ch/${slug}`)
await page.waitForTimeout(3000)
const total = Number((await page.evaluate(() => document.querySelector('.story-count')?.textContent || '0 / 0')).split('/')[1])
const tall = []
for (let i = 0; i < total; i++) {
  await page.waitForTimeout(250)
  const r = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, v: window.innerHeight, sec: document.querySelector('.story-sec')?.textContent }))
  if (r.h > r.v + 4) tall.push(`beat ${i + 1}: ${r.h}px > ${r.v}px  [${r.sec}]`)
  await page.keyboard.press('ArrowRight')
}
console.log(`${slug} (${mode} ${width}x${height}): ${total} beats, ${tall.length} too tall`)
tall.forEach((t) => console.log('  ' + t))
await browser.close(); srv.kill()
