const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ejs = require('ejs');
const sequelize = require('../models').sequelize;
const models = sequelize.models;

_.each(models, (Model, name) => {
  console.log('\n======================================');
  console.log('开始创建 controller 文件...');
  // pick primaryKeys
  const primaryKeys = _.keys(_.pickBy(Model.rawAttributes, item => item.primaryKey));
  // pick attributes
  const attributes = _.keys(
    _.omit(Model.rawAttributes, primaryKeys.concat(['createdAt', 'updatedAt']))
  );
  const TPL_FILE = path.join(__dirname, './controllerTpl.js');
  const tpl = fs.readFileSync(TPL_FILE, 'utf8');
  // write controller file
  const content = ejs.render(tpl, { name, primaryKeys, attributes });
  fs.writeFileSync(`./controllers/${name}.js`, content, 'utf8');

  console.log('Done!');
  console.log('\n======================================');
  console.log('开始初始化路由...');

  let params_str = ``;
  primaryKeys.forEach(key => {
    const field = Model.rawAttributes[key].field;
    let entityName = field.split('_')[0];
    let paramType = Model.rawAttributes[key].type.constructor.name;
    let paramLength = Model.rawAttributes[key].type._length;

    let regexp;
    if (['INTEGER', 'BIGINT'].indexOf(paramType) > -1){ // number types
      regexp = `d{${paramLength}}`;
    }  else { // string types
      regexp = `S{${paramLength}}`;
    }

    if (field.match(/\S+_\S+/gi)) {
      params_str += `/${entityName}s/:${key}(\\${regexp})`;
    } else {
      params_str += `:${key}(\\${regexp})`
    }
  });

  let routes = [
    {method:'post',path:`/${name}s`, func:'create'},
    {method:'get',path:`/${name}s`, func:'list'},
    {method:'get',path:`/${name}s/count`, func:'count'},
    {method:'get',path:`/${name}s/${params_str}`, func:'one'},
    {method:'put',path:`/${name}s/${params_str}`, func:'update'},
    {method:'delete',path:`/${name}s/${params_str}`, func:'destory'}
  ];

  const ROUTER_FILE = path.join(__dirname, '../routes/api.js');

  const route = fs.readFileSync(ROUTER_FILE, 'utf8');

  const api = require('../routes/api.js');
  const routerVar = 'router';
  const controllerVar = 'controllers';
  let routesContent = '\n';
  routes.filter(item => {
    return !(api.stack.find(layer => {
      return layer.route.path == item.path && layer.route.methods[item.method]
    }));
  }).forEach(item => {
    routesContent += `${routerVar}.${item.method}('${item.path.replace("\\","\\\\")}', ${controllerVar}.${item.func});\n`;
  });
  fs.writeFileSync(`./routes/api.js`, route + routesContent, 'utf8');
  console.log('Done!');
});
