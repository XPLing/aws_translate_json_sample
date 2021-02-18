/**
 * Created by XPL on 2020/5/1.
 */
const path = require('path')
const fs = require('fs')
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}
module.exports = mkdirsSync
