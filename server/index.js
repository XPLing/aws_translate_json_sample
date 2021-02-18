const AWS = require('aws-sdk')
const { AWSTranslateJSON } = require('aws-translate-json')
const fs = require('fs')
const path = require('path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)
const writeFile = promisify(fs.writeFile)
const mkdirsSync = require('./util/dir')
const awsConfig = {
  accessKeyId: AWS.config.accessKeyId,
  secretAccessKey: AWS.config.secretAccessKey,
  region: 'us-west-2'
}
const resolve = function (...arg) {
  return path.resolve(__dirname, './', ...arg)
}
const originalFilePath = path.resolve('./public/translate')
const translateFiles = []

function promisify (fn) {
  return function () {
    var args = arguments
    return new Promise(function (resolve, reject) {
      [].push.call(args, function (err, result) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
      fn.apply(null, args)
    })
  }
}

function loadFiles (sourcePath, callback) {
  return readdir(sourcePath).then(files => {
    const promiseArr = files.map(file => {
      const filePath = path.resolve(sourcePath, file)
      return stat(filePath).then(stats => {
        if (stats.isDirectory()) {
          return loadFiles(filePath, callback)
        } else {
          callback && callback(filePath)
        }
      })
    })
    return Promise.all(promiseArr)
  })
}

function start (targetPath, lang) {

  const translateTarget = require(targetPath)
  const source = 'en'
  const target = /Array/.test(Object.prototype.toString.call(lang)) ? lang : [lang]
  const { translateJSON } = new AWSTranslateJSON(awsConfig, source, target)
  return translateJSON(translateTarget).then(res => {
    console.log(res)
    const promiseArr = Object.keys(res).map(key => {
      const fileName = path.basename(targetPath).split('.')[0]
      const extName = path.extname(targetPath)
      const directoryPath = resolve(`dist/${key}/`)
      mkdirsSync(directoryPath)
      const resultFileName = `${fileName}${extName}`
      const filePath = resolve(directoryPath, resultFileName)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      return writeFile(filePath, JSON.stringify(res[key], null, 2), 'utf8').then(() => {
        console.log('写入成功')
      }).catch(err => {
        console.log('写入错误', err)
      })
    })
    return Promise.all(promiseArr)
  })
}

// start('./public/translate/login.json', ['ar', 'es', 'pt'])
// start('./common.json', 'ar');
// start('./ui.json', 'ar');
loadFiles(originalFilePath, function (path) {
  translateFiles.push(path)
}).then(() => {
  const promiseArr = translateFiles.map(file => {
    return start(file, ['ar'])
  })
  Promise.all(promiseArr).then(() => {
    console.log('loadFiles 翻译完成')
    loadFiles(originalFilePath, function (path) {
      unlink(path)
    })
  })
})
