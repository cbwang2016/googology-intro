import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const [slug, beats, mode = 'bi', width = '1200', height = '820'] = process.argv.slice(2)
const PORT = process.env.PORT || '4177', OUTDIR = process.env.OUTDIR || 'dist'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore', cwd: '/home/user/Documents/code/googology/site' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } })
await page.addInitScript((m) => { localStorage.setItem('googology-lang-mode', m); localStorage.setItem('googology-view-mode', 'story'); sessionStorage.clear() }, mode)
await page.goto(`http://localhost:${PORT}/#/ch/${slug}`)
await page.waitForTimeout(3000)
const want = beats.split(',').map(Number); const max = Math.max(...want)
for (let i = 1; i <= max; i++) {
  if (want.includes(i)) { await page.waitForTimeout(400); await page.screenshot({ path: `/tmp/rC-${slug.slice(0,6)}-b${i}-${mode}.png`, fullPage: true }) }
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(120)
}
await browser.close(); srv.kill()
