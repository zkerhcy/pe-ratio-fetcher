const fs = require('fs')

function updatePERatio (indexName, peData) {
  const path = './data/pe-ratio.json'
  let data = {}

  if (fs.existsSync(path)) {
    try {
      data = JSON.parse(fs.readFileSync(path, 'utf8'))
    } catch (e) {
      console.warn('Invalid JSON, reinitializing...')
    }
  }

  if (!data.forward) data.forward = {}
  data.forward[indexName] = peData

  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

module.exports = {
  updatePERatio
}