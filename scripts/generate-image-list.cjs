const fs = require('fs')
const path = require('path')

const laImages = fs.readdirSync('./public/la')
  .filter(f => f.endsWith('.jpg'))
  .sort()

const solImages = fs.readdirSync('./public/sol')
  .filter(f => f.endsWith('.jpg'))
  .sort()

fs.writeFileSync(
  './public/la-images.json',
  JSON.stringify(laImages, null, 2)
)

fs.writeFileSync(
  './public/sol-images.json',
  JSON.stringify(solImages, null, 2)
)

console.log(`✓ Generated la-images.json (${laImages.length} files)`)
console.log(`✓ Generated sol-images.json (${solImages.length} files)`)
