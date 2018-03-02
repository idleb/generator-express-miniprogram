const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ejs = require('ejs');
const sequelize = require('../models').sequelize;
const models = sequelize.models;

_.each(models, (Model, name) => {
  // 提取主键
  const primaryKeys = _.keys(_.pickBy(Model.rawAttributes, item => item.primaryKey));
  // 过滤可编辑属性
  const attributes = _.keys(
    _.omit(Model.rawAttributes, primaryKeys.concat(['createdAt', 'updatedAt']))
  );
  const TPL_FILE = path.join(__dirname, './controllerTpl.js');
  const tpl = fs.readFileSync(TPL_FILE, 'utf8');
  const content = ejs.render(tpl, { name, primaryKeys, attributes });
  fs.writeFileSync(`./controllers/${name}.js`, content, 'utf8');
});
