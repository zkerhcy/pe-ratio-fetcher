const puppeteer = require('puppeteer')
const { updatePERatio } = require('./utils.js')

;(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const page = await browser.newPage()

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
  await page.setViewport({ width: 1280, height: 800 })

  await page.goto('https://sc.macromicro.me/series/20052/sp500-forward-pe-ratio', {
    waitUntil: 'networkidle2',
    timeout: 0
  })

  const currentSelector = '#panel main .chart-theater-sidebar .stat-val > span.val'
  const previousSelector = '#panel main .chart-theater-sidebar .prev-val > span.val'

  await page.waitForSelector(currentSelector, { timeout: 60000 })
  await page.waitForSelector(previousSelector, { timeout: 60000 })

  const result = await page.evaluate((currentSel, previousSel) => {
    const currentValEl = document.querySelector(currentSel)
    const prevValEl = document.querySelector(previousSel)

    return {
      current: currentValEl ? currentValEl.innerText.trim() : null,
      previous: prevValEl ? prevValEl.innerText.trim() : null
    }
  }, currentSelector, previousSelector)

  updatePERatio('S&P-500', result)

  await browser.close()
})()
