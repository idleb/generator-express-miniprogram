# generator-express-miniprogram [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Generate an Express server for MiniProgram

Generator quickly create web server for MiniProgram, using ES6, Express, Mysql, Sequelize.

DB init dependencies [knexjs](http://knexjs.org/), models init dependencies [sequelize-auto](https://www.npmjs.com/package/sequelize-auto).

## Installation

First, install [Yeoman](http://yeoman.io) and generator-express-miniprogram using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-express-miniprogram
```

Then generate your new project:

```bash
yo express-miniprogram
```

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## Architecture

You will get a MVC directory structure

```
├─.eslintrc.yml  
├─.gitignore  
├─app.js  
├─package.json  
├─bin/  
│  ├─www   
├─config  
│  ├─dev.js  
│  ├─index.js  
│  ├─prod.js  
├─controllers/  
│  ├─index.js  
│  ├─upload.js  
│  ├─user.js  
├─lib/  
│  ├─cos.js  
│  ├─weixin.js  
├─models/  
│  ├─index.js              
├─public/  
│  ├─favicon.ico  
│  ├─css/  
│  │  ├─style.css    
│  └─img/  
│     └─image.png  
├─routes/  
│  ├─api.js  
│  ├─index.js  
├─tools/  
│  ├─db.sql  
│  ├─initdb.js  
└─views/  
   ├─error.ejs  
   ├─footer.ejs  
   ├─header.ejs  
   ├─index.ejs  
   └─pagination.ejs  
```

## Config

General

```
port: '3000',
// Domain that cookie used, for example: .idleb.cn
domain: '',

// MiniProgram App ID
appId: '',

// MiniProgram App Secret
appSecret: '',

// MiniProgram App ID
openAppId: '',

// MiniProgram App Secret
openAppSecret: '',

// MySQL Config
mysql: {
  host: 'localhost',
  port: 3306,
  user: 'root',
  db: '',
  pass: '',
  char: 'utf8mb4',
  log: console.log // or false
},

// hostname, for example: http://example.idleb.com
host: '',
// cookie secret
secret: ''
```

If you choose use COS

```
// 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
qcloudAppId: '',
qcloudSecretId: '',
qcloudSecretKey: '',
cos: {
  /**
   * 区域
   * 华北：cn-north
   * 华东：cn-east
   * 华南：cn-south
   * 西南：cn-southwest
   * 新加坡：sg
   * @see https://www.qcloud.com/document/product/436/6224
   */
  region: 'cn-north',
  // CDN, ture 返回为 CDN 地址
  cdn: true,
  // Bucket 名称前缀, Bucket 命名格式: 前缀+文件类型
  prefix: ''
```

## Script

``` bash
# for start server
npm start
# for init mysql and create models
npm initdb
# for eslint
npm eslint
# for test, unit test use chai+mocha
npm test
```

## License

MIT © [idleb](idleb2317@hotmail.com)

[npm-image]: https://badge.fury.io/js/generator-express-miniprogram.svg
[npm-url]: https://npmjs.org/package/generator-express-miniprogram
[travis-image]: https://travis-ci.org/idleb/generator-express-miniprogram.svg?branch=master
[travis-url]: https://travis-ci.org/idleb/generator-express-miniprogram
[daviddm-image]: https://david-dm.org/idleb/generator-express-miniprogram.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/idleb/generator-express-miniprogram
