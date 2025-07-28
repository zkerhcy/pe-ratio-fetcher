// == Market Valuation Widget for Scriptable ==
// Description: Displays Estimated P/E for S&P 500 and CSI 300
const COMMON_TEXT_COLOR = Color.dynamic(Color.black(), Color.white())
const RISE_COLOR = new Color('#00C16A')
const FAIL_COLOR = new Color('#FF3B30')
const DIVIDER_COLOR = Color.dynamic(new Color('#E0E0E0'), new Color('#444444'))


// Show the widget
let data = await loadData()
let convertedData = convertData(data)
let widget = await createWidget(convertedData)
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}
Script.complete()

async function createWidget (data = {}) {
  let widget = new ListWidget()
  // widget.backgroundColor = Color.dynamic(new Color('#F9F9F9'), new Color('#0E1116'))
  widget.backgroundGradient = createGradientBackground()
  widget.url = 'https://sc.macromicro.me/series/20052/sp500-forward-pe-ratio'
  widget.useDefaultPadding()

  // Title
  const titleStack = widget.addStack()
  const headerText = titleStack.addText('Forward P/E ratio')
  headerText.font = Font.semiboldSystemFont(15)
  headerText.textColor = COMMON_TEXT_COLOR

  // Horizontal Divider Below Title
  widget.addSpacer(12)
  let titleLine = widget.addStack()
  titleLine.size = new Size(128, 1)
  titleLine.backgroundColor = DIVIDER_COLOR
  widget.addSpacer(12)

  // Main Horizontal Row
  let row = widget.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()

  // Left: S&P 500
  let left = row.addStack()
  left.layoutVertically()
  left.centerAlignContent()
  left.spacing = 4

  let spName = left.addText('S&P 500')
  spName.font = Font.mediumSystemFont(13)
  spName.textColor = COMMON_TEXT_COLOR

  let spPE = left.addText(String(data.sp500Current))
  spPE.font = Font.boldSystemFont(20)
  spPE.textColor = COMMON_TEXT_COLOR

  let spChange = left.addText(data.sp500Change)
  spChange.font = Font.systemFont(12)
  spChange.textColor = parseFloat(data.sp500Change) > 0 ? RISE_COLOR : FAIL_COLOR

  // Divider Line
  row.addSpacer(8)
  let divider = row.addStack()
  divider.size = new Size(1, 64)
  divider.backgroundColor = DIVIDER_COLOR
  row.addSpacer(8)

  // Right: 沪深 300
  let right = row.addStack()
  right.layoutVertically()
  right.centerAlignContent()
  right.spacing = 4

  let csiName = right.addText('沪深 300')
  csiName.font = Font.mediumSystemFont(13)
  csiName.textColor = COMMON_TEXT_COLOR

  let csiPE = right.addText(String(data.csi300Current))
  csiPE.font = Font.boldSystemFont(20)
  csiPE.textColor = COMMON_TEXT_COLOR

  let csiChange = right.addText(data.csi300Change)
  csiChange.font = Font.systemFont(12)
  csiChange.textColor = parseFloat(data.csi300Change) > 0 ? RISE_COLOR : FAIL_COLOR

  return widget
}

function convertData (data = {}) {
  const sp500Current = parseFloat(data.forward['S&P-500'].current).toFixed(2)
  const sp500Previous = parseFloat(data.forward['S&P-500'].previous).toFixed(2)
  const csi300Current = parseFloat(data.forward['CSI-300'].current).toFixed(2)
  const csi300Previous = parseFloat(data.forward['CSI-300'].previous).toFixed(2)

  const sp500Change = sp500Current - sp500Previous > 0 ? `+${(sp500Current - sp500Previous).toFixed(2)}` : `${(sp500Current - sp500Previous).toFixed(2)}`
  const csi300Change = csi300Current - csi300Previous > 0 ? `+${(csi300Current - csi300Previous).toFixed(2)}` : `${(csi300Current - csi300Previous).toFixed(2)}`

  return {
    sp500Current,
    sp500Previous,
    sp500Change,
    csi300Current,
    csi300Previous,
    csi300Change
  }
}

async function loadData () {
  const url = 'https://zkerhcy.github.io/pe-ratio-fetcher/data/pe-ratio.json'
  let req = new Request(url)
  req.method = "get"
  req.headers = {
    "Content-Type": "text/html; charset=utf8"
  }
  const data = await req.loadString()
  return JSON.parse(data)
}

function createGradientBackground() {
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]

  gradient.colors = [
    Color.dynamic(new Color('#f9f9f9'), new Color('#1c1c1e')),
    Color.dynamic(new Color('#e6e6e6'), new Color('#2c3e50'))
  ]

  return gradient
}
