const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const _ = require('lodash');
let db = {};

Date.prototype.toJSON = () => {
  return this.toLocaleString();
};

const sequelize = new Sequelize(config.mysql.db, config.mysql.user, config.mysql.pass, {
  host: config.mysql.host,
  dialect: 'mysql',
  port: config.mysql.port,
  pool: {
    max: 64,
    min: 16,
    idle: 10000
  },
  logging: config.mysql.log,
  timezone: '+08:00',
  query: { raw: false, plain: false, type: 'SELECT' },
  define: { freezeTableName: true, timestamps: true },
  operatorsAliases: {
    $gte: Sequelize.Op.gte,
    $ne: Sequelize.Op.ne,
    $like: Sequelize.Op.like,
    $regexp: Sequelize.Op.regexp,
    $notIn: Sequelize.Op.notIn,
    $between: Sequelize.Op.between
  }
});

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    /* new functions */
    model.fields = () => {
      const columns = [];
      for (let x in model.tableAttributes) {
        columns.push(x);
      }
      return columns;
    };
    model.filter_query = (data, value) => {
      const attributes = model.fields();
      const order =
        value !== undefined && value['order'] !== undefined
          ? value['order']
          : attributes[0];
      const sort =
        value !== undefined && value['sort'] !== undefined ? value['sort'] : 'desc';
      const offset =
        value !== undefined && value['offset'] !== undefined ? value['offset'] : 0;
      const limit =
        value !== undefined && value['limit'] !== undefined ? value['limit'] : 10;

      const definition = {};
      const where = {};
      let order_array = [];
      let order_str = '';

      if (
        data['order'] === undefined ||
        model.tableAttributes[data['order']] === undefined
      ) {
        order_str = order;
      } else {
        order_str = data['order'];
      }

      order_str.split(',').forEach(order => {
        order_array.push([order]);
      });

      let sort_str = '';
      if (data['sort'] !== 'desc' && data['sort'] !== 'asc') {
        sort_str = sort;
      } else {
        sort_str = data['sort'];
      }

      let sort_array = sort_str.split(',');
      order_array.forEach((item, i) => {
        item.push(sort_array[i] || 'desc');
      });
      if (_.isNumber(data['offset']) && parseInt(data['offset'], 10) >= 0) {
        definition['offset'] = parseInt(data['offset'], 10);
      } else {
        definition['offset'] = offset;
      }
      if (_.isNumber(data['limit']) && parseInt(data['limit'], 10) > 0) {
        definition['limit'] = parseInt(data['limit'], 10);
      } else {
        definition['limit'] = limit;
      }
      for (let x in data) {
        if (
          model.tableAttributes[x] !== undefined &&
          x !== 'sort' &&
          x !== 'order' &&
          x !== 'limit' &&
          x !== 'offset'
        ) {
          where[x] = data[x];
        }
      }
      definition.attributes = attributes;
      definition.where = where;
      definition.order = order_array;
      return definition;
    };
    /* new functions */
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = _.extend(
  {
    sequelize: sequelize,
    Sequelize: Sequelize
  },
  db
);
