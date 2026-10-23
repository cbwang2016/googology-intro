// Usage: [PORT] [OUTDIR] node storyshot.mjs <route> <outPrefix> [mode] [beats] [width] [height]
// Screenshots the first N beats of a chapter in story mode (viewport-sized).
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const [route = '/', pre = '/tmp/story', mode = 'bi', beats = '6', width = '1200', height = '820'] = process.argv.slice(2)
const PORT = process.env.PORT || '4178'
const OUTDIR = process.env.OUTDIR || 'dist'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
await page.addInitScript((m) => { localStorage.setItem('googology-lang-mode', m); localStorage.setItem('googology-view-mode', 'story'); sessionStorage.clear() }, mode)
await page.goto(`http://localhost:${PORT}/#${route}`)
await page.waitForTimeout(1500)
const total = await page.evaluate(() => document.querySelector('.story-count')?.textContent)
console.log('beats:', total)
for (let i = 0; i < Number(beats); i++) {
  await page.waitForTimeout(Number(process.env.WAIT || 600))
  await page.screenshot({ path: `${pre}_${i}.png` })
  await page.keyboard.press('ArrowRight')
}
const kerr = await page.evaluate(() => [...document.querySelectorAll('.katex-error')].map((e) => e.getAttribute('title') || e.textContent))
if (kerr.length) errors.push('KaTeX errors (red TeX): ' + kerr.join(' | '))
console.log('errors:', errors.length ? errors.join('\n') : 'none')
await browser.close(); srv.kill()
