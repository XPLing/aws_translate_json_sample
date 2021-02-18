const fs = require('fs')
const path = require('path')

function readDir (entry, currentPath, isDeep) {
  const dirInfo = fs.readdirSync(entry)
  const files = []
  dirInfo.forEach((item) => {
    const location = path.join(entry, item)
    const info = fs.statSync(location)
    if (info.isDirectory()) {
      if (isDeep) {
        readDir(location, currentPath, isDeep)
      }
    } else {
      files.push(path.relative(currentPath, location))
    }
  })
  return files
}

module.exports = readDir
