const AWS = require('aws-sdk');
const { AWSTranslateJSON } = require('aws-translate-json');
const fs = require('fs');
const path = require('path');

const awsConfig = {
  accessKeyId: AWS.config.accessKeyId,
  secretAccessKey: AWS.config.secretAccessKey,
  region: 'us-west-2'
};
const resolve = function (filePath) {
  return path.resolve(__dirname, './', filePath);
};

function start (targetPath, lang) {
  const translateTarget = require(targetPath);
  const source = 'en';
  const target = [lang];
  const { translateJSON } = new AWSTranslateJSON(awsConfig, source, target);
  translateJSON(translateTarget).then(res => {
    Object.keys(res).forEach(key => {
      const fileName = path.basename(targetPath).split('.')[0];
      const extName = path.extname(targetPath);
      const resultFileName = `${fileName}.${key}${extName}`
      const filePath = resolve(resultFileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fs.writeFile(resultFileName, JSON.stringify(res[key], null, 2), 'utf8', (error) => {
        if (error) console.log('写入出错');
        console.log('写入成功');
      });
    });
  });
}

start('./setting.json', 'ar');
start('./common.json', 'ar');
start('./ui.json', 'ar');
