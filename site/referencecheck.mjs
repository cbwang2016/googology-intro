// Run against a local preview: BASE_URL=http://localhost:4498 node referencecheck.mjs
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
try {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 1100, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', e => errors.push(String(e)))
  const base = process.env.BASE_URL || 'http://localhost:4173'
  await page.goto(base)
  for (const mode of ['en', 'zh', 'bi']) for (const width of [360, 390, 1100]) {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(mode => {
      localStorage.setItem('googology-lang-mode', mode)
      localStorage.setItem('googology-view-mode', 'story')
      localStorage.setItem('googology-reading-position', JSON.stringify({ chapter: 'fgh', page: 10 }))
    }, mode)
    await page.goto(`${base}/#/ch/fgh`)
    await page.reload()
    await page.waitForFunction(() => document.querySelector('.chapter-flow')?.getAttribute('data-cur') === '10' && !document.querySelector('.loading'))
    const position = await page.evaluate(() => localStorage.getItem('googology-reading-position'))
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `header fits ${mode} ${width}`)
    await page.locator('.reference-trigger').click()
    const dialog = page.locator('dialog[open]')
    await dialog.waitFor()
    assert.equal(await page.locator('input[type=search]').evaluate(e => e === document.activeElement), true)
    assert.equal(await dialog.locator('.katex-error').count(), 0)
    assert.ok(await dialog.locator('tbody tr').count() >= 28)
    for (const [query, expected] of [['BHO', 'Bachmann'], ['BO', 'Buchholz'], ['ε₀', 'ε'], ['基本列', '']]) {
      await dialog.locator('input').fill(query)
      assert.ok(await dialog.locator('tbody tr').count() > 0)
      if (expected) assert.ok((await dialog.locator('tbody tr').first().innerText()).includes(expected))
    }
    await dialog.locator('input').fill('BO')
    assert.equal(await dialog.locator('tbody tr').count(), 3, 'BO search returns BO, TFBO and EBO without prose substring matches')
    const row = dialog.locator('tbody tr').first()
    await row.locator('th').click()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press(' ')
    assert.equal(await page.locator('.chapter-flow').getAttribute('data-cur'), '10', 'reference keyboard does not turn page')
    if (width < 500) {
      const box = await row.locator('th').boundingBox()
      await page.touchscreen.tap(box.x + box.width - 10, box.y + 15)
      assert.equal(await page.locator('.chapter-flow').getAttribute('data-cur'), '10', 'reference touch does not turn page')
    }
    assert.equal(await dialog.evaluate(e => e.scrollWidth <= e.clientWidth), true, 'dialog has no horizontal overflow')
    if (mode === 'bi' && width !== 360) await page.screenshot({ path: `/tmp/reference-${width}.png` })
    await dialog.locator('input').fill('no-such-symbol-12345')
    assert.equal(await dialog.locator('.reference-empty').count(), 1)
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('dialog[open]').count(), 0)
    assert.equal(await page.locator('.reference-trigger').evaluate(e => e === document.activeElement), true, 'focus returns to trigger')
    assert.equal(await page.evaluate(() => localStorage.getItem('googology-reading-position')), position)
  }
  await page.locator('.reference-trigger').click()
  await page.locator('.reference-search input').fill('BHO')
  await page.locator('.reference-table tbody tr').first().locator('a').click()
  await page.waitForURL(/collapsing$/)
  assert.equal(await page.locator('dialog').count(), 0)
  await page.locator('.reference-trigger').click()
  assert.ok(await page.locator('.reference-table tbody tr').count() >= 28, 'available after chapter navigation')
  await page.keyboard.press('Escape')
  // The same global entry point works in scroll mode.
  await page.evaluate(() => localStorage.setItem('googology-view-mode', 'scroll'))
  await page.reload()
  await page.locator('.reference-trigger').click()
  await page.locator('dialog[open]').waitFor()
  assert.deepEqual(errors, [])
  console.log('Reference: multilingual search, all formulas, mobile layout, keyboard/touch isolation, focus, reading position, chapter links and scroll mode: PASS')
} finally { await browser.close() }
