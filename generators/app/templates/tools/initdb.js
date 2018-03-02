/*eslint no-console: "off"*/

const fs = require('fs');
const path = require('path');
const sequelizeAuto = require('sequelize-auto');
const { mysql: config } = require('../config');

console.log('\n======================================');
console.log('开始初始化数据库...');

// 初始化 SQL 文件路径
const INIT_DB_FILE = path.join(__dirname, './db.sql');

const DB = require('knex')({
  client: 'mysql',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.pass,
    database: config.db,
    charset: config.char,
    multipleStatements: true
  }
});

console.log(`准备读取 SQL 文件：${INIT_DB_FILE}`);

// 读取 .sql 文件内容
const content = fs.readFileSync(INIT_DB_FILE, 'utf8');

console.log('开始执行 SQL 文件...');
// 执行 .sql 文件内容
DB.raw(content).then(
  () => {
    console.log('数据库初始化成功！');
    var auto = new sequelizeAuto(config.db, config.user, config.pass, {
      dialect: 'mysql',
      output: '../models',
      camelCase: true,
      spaces: true,
      indentation: 2
    });
    console.log('开始创建 model 文件...');
    auto.run(err => {
      if (err) throw err;
      console.log('Done!');
      process.exit(0);
    });
  },
  err => {
    throw new Error(err);
  }
);
