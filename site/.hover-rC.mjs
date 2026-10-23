import { chromium } from 'playwright-core'
import { spawn } from 'node:child_process'
const PORT = '4224', OUTDIR = '/tmp/build-rC'
const srv = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort', '--outDir', OUTDIR], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
for (const slug of process.argv.slice(2)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } })
  await page.addInitScript(() => { localStorage.setItem('googology-lang-mode', 'bi'); localStorage.setItem('googology-view-mode', 'scroll') })
  await page.goto(`http://localhost:${PORT}/#/ch/${slug}`)
  await page.waitForTimeout(6000)
  const r = await page.evaluate(() => {
    const out = []
    const W = document.documentElement.clientWidth
    for (const el of document.querySelectorAll('.chapter-flow *')) {
      const b = el.getBoundingClientRect()
      if (b.right > W + 1 && b.width > 0) {
        let p = el.parentElement, clipped = false
        while (p) { const cs = getComputedStyle(p); if (/(auto|scroll|hidden)/.test(cs.overflowX)) { clipped = true; break } p = p.parentElement }
        if (!clipped) out.push(`${el.tagName}.${el.className} r=${Math.round(b.right)} :: ${(el.textContent||'').slice(0,50)}`)
      }
    }
    return { sw: document.documentElement.scrollWidth, out: out.slice(0, 12) }
  })
  console.log(slug, 'scrollWidth', r.sw); r.out.forEach((o) => console.log('  ', o))
  await page.close()
}
await browser.close(); srv.kill()
