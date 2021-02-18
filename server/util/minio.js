/**
 * Created by XPL on 2020/4/17.
 */
const FS = require('fs')
const path = require('path')
const minioConfig = require('../config/minioConfig')
const { minioClient } = require('./uploader/core')

const Minio = require('minio')

class MinioClass {
  constructor (ctx) {
    this.ctx = ctx
    this.config = minioConfig
    this.minio = this.init()
  }

  init () {
    return new Minio.Client(minioConfig.client)
  }

  async createBuket (buket) {
    let res
    try {
      res = await this.checkBuket(buket)
      if (!res) {
        res = await this.minio.makeBucket(buket, this.config.region)
      }
      return res
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  checkBuket (buket) {
    return this.minio.bucketExists(buket)
  }

  async putFile (bucket, filePath, fileName, mimeType) {
    try {
      const file = FS.createReadStream(filePath)
      let res = {}
      await FS.stat(filePath, (err, stats) => {
        if (err) {
          throw err
        }
        res = stats
      })
      const etag = await this.minio.putObject(bucket, fileName, file, res.size, {
        'Content-Type': mimeType
      })
      return {
        etag,
        path: `${this.config.useSSL ? 'http://' : 'https://'}${this.config.endPoint}:${this.config.port}/${this.config.bucket}/${fileName}`
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  removeFile (bucket, file) {
    return this.minio.removeObject(bucket, file)
    //   , function (err) {
    //   if (err) {
    //     return console.log('Unable to remove object', err);
    //   }
    //   console.log('Removed the object');
    // });
  }
}

function resolve (dir) {
  return path.join(__dirname, '../../../', dir)
}

// minioClient.listBuckets(function (err, buckets) {
//   if (err) return console.log(err);
//   console.log(buckets[0].name);
//   removeObject(buckets[0].name, 'avatar');
//   putObject(buckets[0].name, resolve('components/index/left/profile/avatar.jpg'));
// });

/* eslint no-unused-vars:0 */

function putObject (bucket, filePath) {
  const file = FS.createReadStream(filePath)
  FS.stat(filePath, function (err, stats) {
    if (err) {
      return console.log(err)
    }
    console.log(stats)
    minioClient.putObject(bucket, 'avatar.jpg', file, stats.size, {
      'Content-Type': 'image/jpeg'
    }, function (err) {
      if (err) {
        return console.log('Unable to put object', err)
      }
      console.log('Put the object')
    })
  })
}

module.exports = MinioClass
