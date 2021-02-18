/**
 * Created by XPL on 2020/4/17.
 */
const Minio = require('minio')
const FS = require('fs')
const path = require('path')
const minioConfig = require('../../../config/minioConfig')

const minioClient = new Minio.Client(minioConfig.client)

function resolve (dir) {
  return path.join(__dirname, '../../../', dir)
}

minioClient.listBuckets(function (err, buckets) {
  if (err) return console.log(err)
  console.log(buckets[0].name)
  removeObject(buckets[0].name, 'avatar')
  putObject(buckets[0].name, resolve('components/index/left/profile/avatar.jpg'))
})

/* eslint no-unused-vars:0 */
function listBuckets (buckets) {
  console.log('buckets :', buckets[0].name)
  const stream = minioClient.listObjects(buckets[0].name)
  console.log('stream :', stream)
  stream.on('data', function (obj) { console.log(obj) })
  stream.on('error', function (err) { console.log(err) })
}

function removeObject (bucket, file) {
  minioClient.removeObject(bucket, file, function (err) {
    if (err) {
      return console.log('Unable to remove object', err)
    }
    console.log('Removed the object')
  })
}

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

module.exports = {
  minioClient
}
