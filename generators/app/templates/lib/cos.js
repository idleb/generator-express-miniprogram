const fs = require('fs');
const CosSdk = require('cos-nodejs-sdk-v5');
const shortid = require('shortid');
const config = require('../config');
const fileType = require('file-type');

module.exports = {
  /**
   * cos 文件存储
   * @param {Buffer || Object} file 文件对象或流
   * @param {String} type 文件类型
   */
  save(file, type) {
    const bucket = `${config.cos.prefix}${type}-${config.qcloudAppId}`;
    // 初始化 sdk
    const cos = new CosSdk({
      // AppId: config.qcloudAppId,
      SecretId: config.qcloudSecretId,
      SecretKey: config.qcloudSecretKey,
      Domain: `http://${bucket}.${config.cos.region}.myqcloud.com/`
    });

    let params = {
      Bucket: bucket,
      Region: config.cos.region
    };
    const srcpath = file.path || '';
    if (srcpath) {
      let ext = srcpath.match(/\.[0-9a-zA-Z]+$/g);
      Object.assign(params, {
        Key: `${Date.now()}-${shortid.generate()}${ext}`,
        Body: fs.createReadStream(srcpath),
        ContentLength: file.size
      });
    } else if (file instanceof Buffer) {
      let ext = `.${fileType(file).ext}`;
      Object.assign(params, {
        Key: `${Date.now()}-${shortid.generate()}${ext}`,
        Body: file,
        ContentLength: file.length
      });
    } else {
      return Promise.reject('params file error');
    }

    return new Promise((resolve, reject) => {
      // 检查 bucket 是否存在，不存在则创建 bucket
      cos.getService(params, (err, data) => {
        if (err) {
          reject(err);
          // remove uploaded file
          if (srcpath) fs.unlink(srcpath, () => {});
        }
        // 检查提供的 Bucket 是否存在
        const hasBucket =
          data.Buckets &&
          data.Buckets.reduce((pre, cur) => {
            return pre || cur.Name === `${bucket}`;
          }, false);

        if (data.Buckets && !hasBucket) {
          cos.putBucket(
            {
              Bucket: bucket,
              Region: config.cos.region,
              ACL: 'public-read'
            },
            err => {
              if (err) {
                reject(err);
                // remove uploaded file
                if (srcpath) fs.unlink(srcpath, () => {});
              } else {
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    }).then(() => {
      return new Promise((resolve, reject) => {
        // 上传对象
        cos.putObject(params, err => {
          if (err) {
            reject(err);
            // remove uploaded file
            if (srcpath) fs.unlink(srcpath, () => {});
          }

          resolve({
            url: `https://${bucket}.${config.cos.cdn?'file':config.cos.region}.myqcloud.com/${params.audioKey}`,
            name: params.audioKey
          });

          // remove uploaded file
          if (srcpath) fs.unlink(srcpath, () => {});
        });
      });
    });
  }
};
