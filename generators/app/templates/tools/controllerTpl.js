const _ = require('lodash');
const models = require('../models');

module.exports = {
  create(req, res){
    const data = _.pick(req.body, <%- attributes.map(item => `'${item}'`).join() %>);
    models.<%= name %>.create(data).then(result =>{
      res.json(result);
    }).catch(e => {
      res.status(500).send(e);
    });
  },
  one(req, res){
    const id = req.params.id;
    models.<%= name %>.findOne({where:{id}}).then(detail => {
      if (!detail){
        res.json({code: 2001, msg: 'not found <%= name %> by id:' + id});
      } else {
        res.json(detail);
      }
    }).catch(e => {
      res.status(500).send(e);
    });
  },
  list(req, res){
    const condition = models.<%= name %>.filter_query(req.query,
      {
        order: 'createdAt',
        sort: 'desc'
      });
    let total = 0;
    models.<%= name %>.count().then(count => {
      total = count;
      return models.<%= name %>.findAll(condition);
    }).then(list => {
      res.json({total, list});
    }).catch(e => {
      res.status(500).send(e);
    });
  },
  count(req, res){
    const condition = models.<%= name %>.filter_query(req.query);
    models.<%= name %>.count(condition).then(count => {
      res.json({count});
    }).catch(e => {
      res.status(500).send(e);
    });
  },
  update(req, res){
    const id = req.params.id;
    const data = _.pick(req.body, <%= <%- attributes.map(item => `'${item}'`).join() %>);
    let detail;
    models.<%= name %>.findOne({where: {id}}).then(result => {
      if (!result){
        return Promise.resolve();
      } else {
        detail = result.dataValues;
        return models.<%= name %>.update(data, {where: {id}});
      }
    }).then(() =>{
      if (detail){
        Object.assign(detail, data);
        res.json(detail);
      } else {
        res.json({code: 2001, msg: 'not found <%= name %> by id:' + id});
      }
    }).catch(e => {
      res.status(500).send(e);
    });
  },
  destroy(req, res){
    const id = req.params.id;
    models.<%= name %>.findOne({where: {id}}).then(result => {
      if (!result){
        return Promise.resolve();
      } else {
        return models.<%= name %>.destroy({where: {id}});
      }
    }).then(result =>{
      if (result){
        res.json({success:true});
      } else {
        res.json({code: 2001, msg: 'not found <%= name %> by id:' + id});
      }
    }).catch(e => {
      res.status(500).send(e);
    });
  },
};
