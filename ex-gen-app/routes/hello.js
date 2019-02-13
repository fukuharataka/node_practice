var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var knex = require('knex')({
  client     : 'mysql',
  connection : {
    host      : 'localhost',
    user      : 'root',
    password  : '',
    database  : 'my-nodeapp-db',
    charset   : 'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);
var MyData = Bookshelf.Model.extend({
  tableName: 'mydata'
});

var mysql_setting = {
  host      : 'localhost',
  user      : 'root',
  password  : '',
  database  : 'my-nodeapp-db'
}

/* GET home page. */
router.get('/', (req, res, next)=>{
  new MyData().fetchAll().then((collection)=>{
    var data = {
      title: 'Hello',
      content: collection.toArray()
    };
    res.render('hello/index', data);
  })
  .catch((err)=>{
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

router.get('/add',(req,res,next)=>{
  var data = {
    title: 'Hello/add',
    content: '新しいレコードを入力:',
    form: {name:'',mail:'',age:0}
  }
  res.render('hello/add',data);
});

router.post('/add',(req,res,next)=>{
  var response = res;
  new MyData(req.body).save().then((model)=>{
    response.redirect('/hello');
  });
  // req.check('name','nameは必須です').notEmpty();
  // req.check('mail','mailは必須です').isEmail();
  // req.check('age','ageは整数を入力してください').isInt();
  //
  // req.getValidationResult().then((result)=>{
  //   if (!result.isEmpty()){
  //     var re = '<ul class="error">';
  //     var result_arr = result.array();
  //     for(var n in result_arr){
  //       re += '<li>'+result_arr[n].msg+'</li>'
  //     }
  //     re += '</ul>';
  //     var data = {
  //       title: 'Hello/add',
  //       content: re,
  //       form: req.body
  //     }
  //     res.render('hello/add',data);
  //   }else{
  //     var nm = req.body.name;
  //     var ml = req.body.mail;
  //     var ag = req.body.age;
  //     var data = {'name':nm,'mail':ml,'age':ag};
  //
  //     var connection = mysql.createConnection(mysql_setting);
  //     connection.connect();
  //     connection.query('insert into mydata set ?',data, function (error, results, fields){
  //       res.redirect('/hello');
  //     });
  //     connection.end();
  //   }
  // });
});

router.get('/show',(req,res,next)=>{
  var id = req.query.id;

  var connection = mysql.createConnection(mysql_setting);

  connection.connect();

  connection.query('SELECT * from mydata where id=?', id, function(error, results, fields){
    if (error == null){
      var data = {
        title: 'hello/show',
        content: 'id = '+ id + 'のレコード',
        mydata: results[0]
      }
      res.render('hello/show', data);
    }
  });
  connection.end();
});

router.get('/edit',(req,res,next)=>{
  var id = req.query.id;

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query('SELECT * from mydata where id=?',id, function (error, results, fields){
    if (error == null ){
      var data = {
        title: 'Hello/edit',
        content: 'id='+ id +'のレコード',
        mydata: results[0]
      }
      res.render('hello/edit',data);
    }
  });
  connection.end();
});

router.post('/edit',(req,res,next)=>{
  var id = req.body.id;
  var nm = req.body.name;
  var ml = req.body.mail;
  var ag = req.body.age;
  var data = {'name':nm,'mail':ml,'age':ag};

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('update mydata set ? where id = ?',[data, id], function (error, results, fields){
    res.redirect('/hello');
  });
  connection.end();
});


router.get('/delete',(req,res,next)=>{
  var id = req.query.id;

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();
  connection.query('SELECT * from mydata where id=?',id, function (error, results, fields){
    if (error == null ){
      var data = {
        title: 'Hello/delete',
        content: 'id='+ id +'のレコード',
        mydata: results[0]
      }
      res.render('hello/delete',data);
    }
  });
  connection.end();
});

router.post('/delete',(req,res,next)=>{
  var id = req.body.id;

  var connection = mysql.createConnection(mysql_setting);
  connection.connect();

  connection.query('delete from mydata where id = ?',id, function (error, results, fields){
    res.redirect('/hello');
  });
  connection.end();
});

router.get('/find',(req,res,next)=>{
  var data = {
    title: '/Hello/Find',
    content: '検索IDを入力',
    form: {fstr:""},
    mydata: null
  };
  res.render('hello/find',data);
});

router.post('/find',(req,res,next)=>{
  new MyData().where('id', '=', req.body.fstr).fetch().then((collection)=>{
    var data = {
      title: 'Hello',
      content: '※id='+req.body.fstr+'の検索結果',
      form: req.body,
      mydata: collection
    };
    res.render('hello/find',data);
  })
});

Bookshelf.plugin('pagination');

router.get('/:page',(req,res,next)=>{
  var pg = req.params.page;
  pg *= 1;
  if (pg < 1){ pg = 1;}
  new MyData().fetchPage({page:pg, pageSize:3}).then((collection)=>{
    var data = {
      title: 'hello',
      content: collection.toArray(),
      pagination: collection.pagination
    };
    console.log(collection.pagination);
    res.render('hello/index', data);
  })
  .catch((err)=>{
    res.status(500).json({error: true, data: {message: err.message}});
  });
});

module.exports = router;
