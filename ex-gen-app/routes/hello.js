var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  var data = {
    title: 'Hello',
    content: 'これはサンプルプログラム'
  }
  res.render('hello', data);
});

module.exports = router;
