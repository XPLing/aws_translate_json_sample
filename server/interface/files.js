const Router = require('koa-router')
const { uploadMiddle, upload } = require('../util/files')

const router = new Router({
  prefix: '/files'
})
router.post('/upload', uploadMiddle(), upload())

module.exports = router
