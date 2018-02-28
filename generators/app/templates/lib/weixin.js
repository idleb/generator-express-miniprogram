const config = require('../config');
const crypto = require('crypto');
const axios = require('axios');

module.exports = {
  jscode2session(code) {
    return new Promise((resolve, reject) => {
      const url =
        'https://api.weixin.qq.com/sns/jscode2session?' +
        'appid=' +
        config.appId +
        '&secret=' +
        config.appSecret +
        '&js_code=' +
        code +
        '&grant_type=authorization_code';
      axios
        .get(url)
        .then(body => {
          resolve(body.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  decryptData(encryptedData, session_key, iv) {
    return new Promise((resolve, reject) => {
      // 解密数据
      let decryptedData;
      try {
        decryptedData = aesDecrypt(session_key, iv, encryptedData);
        decryptedData = JSON.parse(decryptedData);
        resolve(decryptedData);
      } catch (e) {
        reject(e);
      }
    });
  },
  qrcode(params) {
    // 二维码生成器
    return new Promise((resolve, reject) => {
      access_token()
        .then(token => {
          const url =
            params.type == 'code'
              ? `https://api.weixin.qq.com/wxa/getwxacode?access_token=${token.access_token}`
              : `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token.access_token}`;
          return axios.post(url, params, { responseType: 'arraybuffer' });
        })
        .then(body => {
          resolve(body.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
};
function access_token() {
  //得到access_token
  return new Promise((resolve, reject) => {
    const url =
      'https://api.weixin.qq.com/cgi-bin/token?' +
      'grant_type=client_credential' +
      '&appid=' +
      config.appId +
      '&secret=' +
      config.appSecret;
    axios
      .get(url)
      .then(body => {
        resolve(body.data);
      })
      .catch(e => {
        reject(e);
      });
  });
}

function aesDecrypt(key, iv, crypted) {
  crypted = new Buffer(crypted, 'base64');
  key = new Buffer(key, 'base64');
  iv = new Buffer(iv, 'base64');
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decoded = decipher.update(crypted, 'base64', 'utf8');
  decoded += decipher.final('utf8');
  return decoded;
}
