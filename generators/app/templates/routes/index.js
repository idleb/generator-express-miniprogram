const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: '小程序后台' });
});

module.exports = router;
