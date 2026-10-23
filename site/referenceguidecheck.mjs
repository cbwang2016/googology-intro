// BASE_URL=http://localhost:4497 node referenceguidecheck.mjs
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
try {
  const base = process.env.BASE_URL || 'http://localhost:4173'
  for (const width of [390, 1100]) for (const mode of ['en', 'zh', 'bi']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true })
    const page = await context.newPage()
    const errors = []; page.on('pageerror', e => errors.push(String(e)))
    await page.goto(base)
    await page.evaluate(mode => { localStorage.clear(); localStorage.setItem('googology-lang-mode', mode); localStorage.setItem('googology-view-mode', 'story') }, mode)
    await page.goto(`${base}/#/ch/counting-to-towers`); await page.reload(); await page.waitForTimeout(500)
    assert.equal(await page.locator('.reference-guide').count(), 0, 'no first-page interruption')
    await page.goto(`${base}/#/ch/arrows-and-graham`); await page.waitForSelector('#ladder', { state: 'attached' }); await page.waitForTimeout(300)
    assert.equal(await page.locator('.reference-guide').count(), 0, 'not on chapter cover')
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200)
    assert.equal(await page.locator('.reference-guide').count(), 0, 'not on prerequisites')
    await page.keyboard.press('ArrowRight')
    await page.locator('.reference-guide').waitFor()
    const position = await page.locator('.chapter-flow').getAttribute('data-cur')
    const hint = page.locator('.reference-guide')
    const box = await hint.boundingBox()
    assert.ok(box.x >= 0 && box.x + box.width <= width && box.y + box.height <= 900, 'hint fits viewport')
    assert.equal(await page.locator('dialog[open]').count(), 0, 'nonmodal hint')
    if (width === 390) {
      const text = await hint.locator('p').boundingBox()
      await page.touchscreen.tap(text.x + text.width - 5, text.y + 8)
      assert.equal(await page.locator('.chapter-flow').getAttribute('data-cur'), position, 'hint tap does not advance story')
    }
    if (mode === 'bi') await page.screenshot({ path: `/tmp/reference-guide-${width}.png` })
    await hint.locator('button').last().click()
    assert.equal(await page.locator('.reference-guide').count(), 0)
    assert.equal(await page.evaluate(() => localStorage.getItem('googology-reference-guide-seen')), '1')
    await page.reload(); await page.waitForTimeout(500)
    assert.equal(await page.locator('.reference-guide').count(), 0, 'dismissed across reloads')
    // A first-time visitor who skips arrows still learns about lookup.
    await page.evaluate(() => { localStorage.removeItem('googology-reference-guide-seen'); localStorage.setItem('googology-reading-position', JSON.stringify({ chapter: 'ordinals', page: 4 })) })
    await page.goto(`${base}/#/ch/ordinals`); await page.reload()
    await page.locator('.reference-guide').waitFor()
    const before = await page.evaluate(() => localStorage.getItem('googology-reading-position'))
    await page.locator('.reference-guide button').first().click()
    await page.locator('dialog[open]').waitFor()
    assert.equal(await page.locator('.reference-guide').count(), 0)
    await page.keyboard.press('Escape')
    assert.equal(await page.evaluate(() => localStorage.getItem('googology-reading-position')), before)
    // Scroll mode uses visibility, rather than a hard-coded story page number.
    await page.evaluate(() => { localStorage.removeItem('googology-reference-guide-seen'); localStorage.setItem('googology-view-mode', 'scroll') })
    await page.goto(`${base}/#/ch/arrows-and-graham`); await page.reload()
    await page.locator('#ladder').scrollIntoViewIfNeeded()
    await page.locator('.reference-guide').waitFor()
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('.reference-guide').count(), 0)
    assert.deepEqual(errors, [])
    await context.close()
  }
  console.log('First-time guide: lesson timing, persistence, later-chapter fallback, open/dismiss, mobile taps, EN/ZH/bilingual and story/scroll modes: PASS')
} finally { await browser.close() }
