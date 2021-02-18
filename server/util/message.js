/**
 * Created by XPL on 2019/12/1.
 */
const { STATUS_OK, STATUS_ERR } = require('../config/common')

function successMsg ({ code = STATUS_OK, message = 'success' }) {
  let obj = {
    success: true,
    code,
    message
  }
  obj = Object.assign({}, obj, arguments[0])
  return obj
}

function errorMsg ({ code = STATUS_ERR, message = 'fail' }) {
  let obj = {
    success: false,
    code,
    message
  }
  obj = Object.assign({}, obj, arguments[0])
  return obj
}

function throwError ({ code = STATUS_ERR, message = 'fail' }) {
  let obj = {
    code,
    message
  }
  obj = Object.assign({}, obj, arguments[0])
  const error = new Error(message)
  error.originObj = obj
  return error
}

function ctxThrow (ctx, e) {
  return ctx.throw((e.originObj && e.originObj.code) || 400, e && e.message)
}

module.exports = {
  successMsg,
  errorMsg,
  ctxThrow,
  throwError
}
