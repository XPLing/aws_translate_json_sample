const Uploader = require('./core/upload')

function uploader (app) {
  app.context.uploader = new Uploader()
  // return async (ctx, next) => {
  //   // ctx.uploader = new Uploader();
  //   await next();
  // };
}
