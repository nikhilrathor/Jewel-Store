var express = require('express');
var router = express.Router();

var Page = require('../models/page');

router.get('/', function (req, res) {
  Page.findOne({slug: 'home'},function(err,page){
    if(err){
      console.log(err);
    }else{
      res.render('index', {
        title: page.title,
        content: page.content
      });
    }
  })
})


router.get('/:slug', function (req, res) {

  var slug = req.params.slug.trim();

  Page.findOne({slug: slug}).then((page)=>{
    if(!page){
      res.redirect('/');
    }
    res.render('index', {
      title: page.title,
      content: page.content
    });
  }).catch((e)=>{
    res.status(400);
  });
});

module.exports = router;