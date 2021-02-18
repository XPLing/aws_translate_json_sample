const { errorMsg, successMsg } = require('../util/message')
const multer = require('@koa/multer')
const path = require('path')
const mkdirsSync = require('../util/dir')
// const MinioClass = require('./minio')
// 上传文件存放路径、及文件命名
const uploadPath = path.join(__dirname, '../../', 'dist')
const uploadTempPath = path.join(uploadPath, 'temp')

function uploadPathWithFolder (path) {
  return path.join(__dirname, '../../../../../', 'VBlogFiles', path, '/')
}

function getEditorStorage (prefix, fileServerPath) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fileServerPath || uploadPath)
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname)
      cb(null, `${prefix}-${file.fieldname}-${Date.now().toString(16)}${extname}`)
    }
  })
}

function getStorage (prefix) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadTempPath)
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname)
      cb(null, `${prefix}-${file.fieldname}-${Date.now().toString(16)}${extname}`)
    }
  })
}

// 文件上传限制
const limits = {
  fields: 10, // 非文件字段的数量
  fileSize: 50 * 1024 * 1024, // 文件大小 单位 b
  files: 1 // 文件数量
}

// const minioClient = new MinioClass()
const minioClient = () => {}

const uploadMulter = multer({ storage: getEditorStorage('cache', uploadTempPath), limits })

function uploadMiddle () {
  return async (ctx, next) => {
    try {
      mkdirsSync(uploadTempPath)
      await uploadMulter.single('file')(ctx, next)
    } catch (e) {
      // ctx.throw(e);
      ctx.body = errorMsg({
        error: {
          message: e.message || 'upload failed!'
        }
      })
    }
  }
}

function mergeChunks () {
}

const editorUploadMulter = multer({ storage: getEditorStorage('editor'), limits })

function uploadMiddleEditor () {
  return async (ctx, next) => {
    try {
      mkdirsSync(uploadPath)
      await editorUploadMulter.single('upload')(ctx, next)
    } catch (e) {
      // ctx.throw(e);
      ctx.body = errorMsg({
        error: {
          message: 'upload failed!'
        }
      })
    }
  }
}

function upload () {
  return (ctx, next) => {
    const fileInfo = ctx.request.file
    const body = ctx.request.body
    ctx.body = successMsg({
      result: fileInfo,
      url: fileInfo.path
    })
  }
}

function minioMiddle () {
  return async (ctx, next) => {
    const fileInfo = ctx.request.file
    try {
      const buket = 'vblog'
      await minioClient.createBuket(buket)
      const res = await minioClient.putFile(buket, fileInfo.path, fileInfo.filename, fileInfo.mimetype)
      ctx.request.minioFile = res
      await next()
    } catch (e) {
      ctx.body = errorMsg({
        result: e,
        url: fileInfo.path,
        error: {
          messag: 'minio error'
        }
      })
    }
  }
}

function editorUpload () {
  return (ctx, next) => {
    const fileInfo = ctx.request.minioFile
    ctx.body = successMsg({
      result: fileInfo,
      url: fileInfo.path
    })
  }
}

module.exports = {
  upload,
  mergeChunks,
  uploadMiddle
}
