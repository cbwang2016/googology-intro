// Run against a local Vite preview: BASE_URL=http://localhost:4499 node storycheck.mjs
import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox'] })
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const page = await context.newPage()
  const base = process.env.BASE_URL || 'http://localhost:4173'
  await page.goto(base)
  await page.evaluate(() => {
    localStorage.clear(); sessionStorage.clear()
    localStorage.setItem('googology-lang-mode', 'en')
    localStorage.setItem('googology-view-mode', 'story')
  })
  const open = async (slug) => {
    await page.goto(`${base}/#/ch/${slug}`)
    await page.waitForSelector('.chapter-flow section', { state: 'attached' })
    await page.waitForTimeout(300)
  }
  const beat = () => page.locator('.chapter-flow').getAttribute('data-cur')
  const tap = async (x) => { await page.touchscreen.tap(x, 500); await page.waitForTimeout(200) }
  await open('fgh')
  await tap(350); assert.equal(await beat(), '1', 'right-half tap advances')
  await tap(40); assert.equal(await beat(), '0', 'left-half tap returns')
  await tap(40); assert.match(page.url(), /ordinals$/, 'left from first page opens previous chapter')
  await page.waitForSelector('.chapter-flow section', { state: 'attached' })
  await page.evaluate(() => localStorage.setItem('googology-reading-position', JSON.stringify({ chapter: 'ordinals', page: 20 })))
  await page.reload(); await page.waitForSelector('.chapter-flow section', { state: 'attached' }); await page.waitForTimeout(300)
  assert.equal(await beat(), '20', 'deep saved position survives lazy chapter loading')
  await open('fgh'); assert.equal(await beat(), '0')
  await open('ordinals'); assert.equal(await beat(), '0', 'previous chapter bookmark was replaced')
  const saved = await page.evaluate(() => ({
    legacy: Object.keys(sessionStorage).filter(k => k.startsWith('beat-')),
    position: JSON.parse(localStorage.getItem('googology-reading-position')),
    oldChapter: localStorage.getItem('googology-last'),
  }))
  assert.deepEqual(saved, { legacy: [], position: { chapter: 'ordinals', page: 0 }, oldChapter: null })
  const cdp = await context.newCDPSession(page)
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 350, y: 500 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 350, y: 300 }] })
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await page.waitForTimeout(200)
  assert.equal(await beat(), '0', 'vertical scrolling does not turn a page')
  await page.locator('.story-where').tap()
  assert.equal(await beat(), '0', 'controls do not also trigger page turns')
  await page.locator('.story-menu button').first().tap()
  assert.equal(await beat(), '0')
  console.log('Story navigation: taps, chapter boundary, controls, scroll, deep reload, single bookmark: PASS')
} finally { await browser.close() }
