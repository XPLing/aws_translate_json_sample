const readDir = require('../util/readDir')
const path = require('path')
const httpConfig = require('../config/http')
const Router = require('koa-router')

const router = new Router()

function loadRoutes (app) {
  const routes = readDir(path.join(__dirname, '../', 'interface'), path.resolve(__dirname))
  routes.forEach((item) => {
    item = item.replace(/\.js/, '')
    const route = require(item)
    app.use(route.routes()).use(route.allowedMethods())
    router.use(httpConfig.apiPrefix, route.routes())
  })
}

module.exports = loadRoutes
