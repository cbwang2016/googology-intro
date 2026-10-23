// BASE_URL=http://localhost:5173 node languagecheck.mjs
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
try {
  const base = process.env.BASE_URL || 'http://localhost:5173'
  for (const width of [390, 1100]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', e => errors.push(String(e)))
    await page.goto(base)
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('googology-lang-mode', 'en')
      localStorage.setItem('googology-view-mode', 'story')
      localStorage.setItem('googology-reference-guide-seen', '1')
    })
    await page.goto(`${base}/#/ch/veblen-and-tree`); await page.reload()
    await page.waitForFunction(() => Number(document.querySelector('.story-count')?.textContent.split('/')[1]) > 50)
    const count = () => page.locator('.story-count').innerText().then(s => Number(s.split('/')[1]))
    const counts = { en: await count() }
    const change = async mode => {
      await page.getByRole('radio', { name: { en: 'EN', zh: '中', bi: '中/EN' }[mode], exact: true }).click()
      await page.waitForTimeout(50)
      const total = await count()
      if (counts[mode]) assert.equal(total, counts[mode], 'page count independent of switching history')
      else counts[mode] = total
    }
    // Exercise every scene, including paragraphs whose DOM wrappers are replaced.
    const total = counts.en
    for (let index = 0; index < total; index++) {
      await change('en')
      const current = Number(await page.locator('.chapter-flow').getAttribute('data-cur'))
      for (let i = current; i < index; i++) await page.locator('.story-btn.primary').click()
      for (let i = current; i > index; i--) await page.locator('.story-btn').first().click()
      const section = await page.locator('.story-sec').innerText()
      const feature = page.locator('.chapter-flow .widget:visible, .chapter-flow .thm:visible')
      const candidates = await feature.count() ? feature : page.locator('.chapter-flow h3:visible')
      const focused = await candidates.count() ? await candidates.first().elementHandle() : null
      for (const mode of ['bi', 'zh', 'en', 'zh', 'bi', 'en']) {
        await change(mode)
        if (focused) assert.ok(await focused.isVisible(), `same named scene at EN page ${index + 1}, mode ${mode}`)
        assert.ok(await page.locator('.chapter-flow [data-beats]:visible').count() > 0, 'never a blank story page')
      }
      assert.equal(await page.locator('.story-sec').innerText(), section, 'round-trip retains section')
      assert.equal(Number(await page.locator('.chapter-flow').getAttribute('data-cur')), index, 'round-trip retains page')
    }
    await change('bi')
    const saved = await page.evaluate(() => localStorage.getItem('googology-reading-position'))
    await page.reload(); await page.waitForTimeout(400)
    assert.equal(await page.evaluate(() => localStorage.getItem('googology-reading-position')), saved, 'translated position survives reload')
    assert.deepEqual(errors, [])
    console.log(`Language switching: every Veblen scene, all modes, repeated round trips and reload at ${width}px: PASS`)
    await context.close()
  }
} finally { await browser.close() }
