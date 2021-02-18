// vue.config.js
const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolvePath (dir) {
  return path.join(__dirname, './', dir)
}

// prod
const isProd = process.env.NODE_ENV === 'production'
// 根目录
const baseUrl = '/'
module.exports = {
  // 根路径
  publicPath: baseUrl,
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: (isProd ? 'public/index.html' : 'public/index.html'),
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'AWS-Translate',
      baseUrl
    }
  },

  // 静态资源文件夹
  assetsDir: 'static',
  // 解决 error static/js/chunk-vendors.xxx.js from UglifyJs
  // transpileDependencies: [
  //   'element-ui'
  // ],

  productionSourceMap: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_debugger: true, // console
              drop_console: true,
              pure_funcs: ['console.log', 'alert'] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
    } else {
      // 为开发环境修改配置...
    }
  },

  // 本地服务器
  devServer: {
    host: '0.0.0.0', // IP
    port: 8916, // 端口号
    // 代理 完整配置参考：https://github.com/chimurai/http-proxy-middleware#proxycontext-config
    proxy: {
      '/api': {
        target: 'http://localhost:8915',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  }
}
