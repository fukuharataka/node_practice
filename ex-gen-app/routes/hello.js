var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var mysql_setting = {
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database  : 'my-nodeapp-db'
}

/* GET home page. */
router.get('/', (req, res, next)=>{

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('SELECT * from mydata',function (error, results, fields){
    if (error == null){
      var data = {title:'mysql',content:results};
      res.render('hello',data);
    }
  });
  connection.end();
});

module.exports = router;
