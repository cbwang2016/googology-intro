import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const [slug, mode = 'bi', width = '1200', height = '820', only = ''] = process.argv.slice(2)
const PORT = process.env.PORT || '4177', OUTDIR = process.env.OUTDIR || 'dist'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore', cwd: '/home/user/Documents/code/googology/site' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) } })
await page.addInitScript((m) => { localStorage.setItem('googology-lang-mode', m); localStorage.setItem('googology-view-mode', 'story'); sessionStorage.clear() }, mode)
await page.goto(`http://localhost:${PORT}/#/ch/${slug}`)
await page.waitForTimeout(3000)
const total = Number((await page.evaluate(() => document.querySelector('.story-count')?.textContent || '0 / 0')).split('/')[1])
const want = only ? only.split(',').map(Number) : null
for (let i = 0; i < total; i++) {
  await page.waitForTimeout(200)
  const r = await page.evaluate(() => {
    const h = document.documentElement.scrollHeight, v = window.innerHeight
    const els = [...document.querySelectorAll('.chapter-flow [data-beats]')].filter((e) => e.offsetParent !== null && !e.matches('section'))
    return { h, v, els: els.map((e) => `${Math.round(e.getBoundingClientRect().height)}px <${e.tagName.toLowerCase()} ${e.className}> ${(e.textContent || '').slice(0, 70).replace(/\s+/g, ' ')}`) }
  })
  if ((want && want.includes(i + 1)) || (!want && r.h > r.v + 4)) { console.log(`beat ${i + 1}: ${r.h}`); r.els.forEach((e) => console.log('   ' + e)) }
  await page.keyboard.press('ArrowRight')
}
await browser.close(); srv.kill()
