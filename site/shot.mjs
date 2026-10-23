// Usage: [PORT=4179] [OUTDIR=dist] node shot.mjs <hash-route> <out.png> [mode: en|zh|bi] [width]
// Build first: npx vite build --outDir <OUTDIR>. Prints runtime errors; saves a full-page screenshot.
import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const [route = '/', out = '/tmp/shot.png', mode = 'bi', width = '1200'] = process.argv.slice(2)
const PORT = process.env.PORT || '4179'
const OUTDIR = process.env.OUTDIR || 'dist'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.addInitScript((m) => { localStorage.setItem('googology-lang-mode', m); localStorage.setItem('googology-view-mode', 'scroll') }, mode)
await page.goto(`http://localhost:${PORT}/#${route}`)
await page.waitForTimeout(1500)
// open every collapsible panel so its TeX is rendered and checked too
await page.evaluate(() => document.querySelectorAll('.expand:not(.open) .expand-head').forEach((b) => b.click()))
await page.waitForTimeout(300)
// reveal everything
await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('shown')))
await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } })
await page.waitForTimeout(500)
await page.screenshot({ path: out, fullPage: true })
const kerr = await page.evaluate(() => [...document.querySelectorAll('.katex-error')].map((e) => e.getAttribute('title') || e.textContent))
if (kerr.length) errors.push('KaTeX errors (red TeX): ' + kerr.join(' | '))
console.log('errors:', errors.length ? errors.join('\n') : 'none')
await browser.close()
srv.kill()
