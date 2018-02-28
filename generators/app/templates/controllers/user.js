const wx = require('../lib/weixin.js');
const exec = require('child_process').exec;
const _ = require('lodash');
const models = require('../models');

module.exports = {
  login(req, res) {
    const code = req.query.code;
    wx
      .jscode2session(code)
      .then(data => {
        if (_.has(data, 'openid')) {
          const { openid, unionid, session_key } = data;
          exec(
            'head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168',
            (error, std) => {
              if (error) {
                res.status(500).send(error);
              } else {
                req.session[std] = session_key + openid;
                models.user
                  .findOne({ where: { openid } })
                  .then(detail => {
                    if (!detail) {
                      models.user
                        .create({ openid, unionid, session_key })
                        .then(result => {
                          _.omit(result, 'session_key');
                          res.json({ openid, unionid });
                        })
                        .catch(e => {
                          res.status(500).send(e);
                        });
                    } else {
                      models.user
                        .update({ session_key }, { where: { openid } })
                        .then(() => {
                          res.json({ openid });
                        })
                        .catch(e => {
                          res.status(500).send(e);
                        });
                    }
                  })
                  .catch(e => {
                    res.status(500).send(e);
                  });
              }
            }
          );
        } else {
          res.send({ code: 1001, data });
        }
      })
      .catch(e => {
        res.status(500).send(e);
      });
  },
  update(req, res) {
    const openid = req.params.openid;
    const data = _.pick(req.body, 'encryptedData', 'iv');
    models.user
      .findOne({ where: { openid } })
      .then(detail => {
        if (!detail) {
          res.json({ code: 1002, msg: `openid:${openid} 未找到` });
        } else {
          if (data.encryptedData && data.iv) {
            wx
              .decryptData(data.encryptedData, detail.session_key, data.iv)
              .then(decode => {
                const user = _.pick(
                  decode,
                  'nickName',
                  'gender',
                  'country',
                  'province',
                  'city',
                  'avatarUrl'
                );
                user.unionid = decode.unionId;
                models.user
                  .update(user, { where: { openid } })
                  .then(() => {
                    Object.assign(detail, user);
                    res.json(detail);
                  })
                  .catch(error => {
                    res.status(500).send(error);
                  });
              })
              .catch(err => {
                res.status(500).send(err);
              });
          } else if (!data.encryptedData) {
            res.json({ code: 1003, msg: '参数错误, 缺少 encryptedData' });
          } else if (!data.iv) {
            res.json({ code: 1004, msg: '参数错误, 缺少 iv' });
          }
        }
      })
      .catch(error => {
        res.status(500).send(error);
      });
  }
};
