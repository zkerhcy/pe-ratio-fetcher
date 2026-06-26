const puppeteer = require('puppeteer')
const { updatePERatio } = require('./utils.js')

const URL = 'https://sc.macromicro.me/series/20052/sp500-forward-pe-ratio'
const CURRENT_SELECTOR = '#panel main .chart-theater-sidebar .stat-val > span.val'
const PREV_SELECTOR = '#panel main .chart-theater-sidebar .prev-val > span.val'

;(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  })

  let page
  try {
    page = await browser.newPage()

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
    })

    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    await page.setViewport({ width: 1280, height: 800 })

    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 0 })

    await page.screenshot({ path: 'debug.png' })

    await page.waitForSelector(CURRENT_SELECTOR, { timeout: 60000 })
    await page.waitForSelector(PREV_SELECTOR, { timeout: 60000 })

    const result = await page.evaluate((currentSel, prevSel) => ({
      current: document.querySelector(currentSel)?.innerText.trim() ?? null,
      previous: document.querySelector(prevSel)?.innerText.trim() ?? null
    }), CURRENT_SELECTOR, PREV_SELECTOR)

    console.log('Fetched:', result)
    updatePERatio('S&P-500', result)
  } finally {
    await browser.close()
  }
})()
