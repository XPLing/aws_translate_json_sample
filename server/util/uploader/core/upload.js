import * as Minio from 'minio'
// import fs from 'fs';
// import path from 'path';
import minioConfig from './minioConfig'

const defaultOpts = {}

class Uploader {
  constructor (opts) {
    this.opts = Object.assign({}, defaultOpts, opts)
    this.upload = this.init()
  }

  init () {
    return new Minio.Client(minioConfig.client)
  }
}

module.exports = Uploader
