const express = require('express');
const router = express.Router();
const db = require('../models/index');
const { Op } = require('sequelize');

const pnum = 10;

// ログインチェックの関数
function check(req,res) {
    if (req.session.login == null) {
      req.session.back = '/sche';
      res.redirect('/users/login');
      return true;
    } else {
      return false;
    }
  }

  router.get('/', (req, res, next)=> {
    if (check(req,res)){ return };
    db.Schedule.findAll({
      where:{userId: req.session.login.id},
      limit:pnum,
      order: [
        ['begin', 'ASC']
      ]
    }).then(sche=> {
      var data = {
        title: 'スケジュール管理アプリ',
        login: req.session.login,
        message: '※最近の投稿データ',
        form: {find:''},
        content:sche
      };
      res.render('sche/index', data);    
    });
  });

  router.get('/add', (req, res, next) => {
    if (check(req,res)){ return };
    res.render('sche/add', { title: 'スケジュール追加' });
  });
  
  // 新規作成フォームの送信処理
  router.post('/add', (req, res, next) => {
    if (check(req,res)){ return };
    db.sequelize.sync()
    .then(() => db.Schedule.create({
      userId: req.session.login.id,
      begin: req.body.begin,
      end: req.body.end,
      place: req.body.place,
      content: req.body.content,
    })
    .then(model => {
       res.redirect('/sche');
    })
    );
  });

// router.get('/add',(req, res, next)=> {
//     var data = {
//       title: 'スケジュール追加',
//       form: new db.Schedule(),
//       err:null
//     }
//     res.render('sche/add', data);
//   });
  
//   router.post('/add',(req, res, next)=> {
//     const form = {
//       begin: req.body.begin,
//       end: req.body.end,
//       place: req.body.place,
//       content: req.body.content
//     };
//     db.sequelize.sync()
//       .then(() => db.Schedule.create(form)
//       .then(sche=> {
//         res.redirect('/sche')
//       })
//       .catch(err=> {
//         var data = {
//           title: 'スケジュール追加',
//           form: form,
//           err: err
//         }
//         res.render('sche/add', data);
//       })
//       )
//   });

router.get('/edit',(req, res, next)=> {
  db.Schedule.findByPk(req.query.id)
  .then(sche => {
    var data = {
      title: 'スケジュール編集',
      form: sche
    }
    res.render('sche/edit', data);
  });
});

router.post('/edit',(req, res, next)=> {
  db.Schedule.findByPk(req.body.id)
  .then(sche => {
    sche.begin = req.body.begin;
    sche.end = req.body.end;
    sche.place = req.body.place;
    sche.content = req.body.content;
    sche.save().then(()=>res.redirect('/sche'));
  });
});

router.get('/delete',(req, res, next)=> {
  db.Schedule.findByPk(req.query.id)
  .then(sche => {
    var data = {
      title: 'スケジュール削除',
      form: sche
    }
    res.render('sche/delete', data);
  });
});

router.post('/delete',(req, res, next)=> {
  db.Schedule.findByPk(req.body.id)
  .then(sche => {
    sche.destroy().then(()=>res.redirect('/sche'));
  });
});


module.exports = router;
