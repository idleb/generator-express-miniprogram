const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

router.get('/login', controllers.user.login);
router.put('/user/:openid', controllers.user.update);
<% if (cos) { %>
router.post('/upload/:type', controllers.upload);
<% } %>
module.exports = router;
