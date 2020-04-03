var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/', function (req, res) {
  Product.find(function(err,products){
    if(err){
      console.log(err);
    }else{
      res.render('all_products', {
        title: 'All Products',
        products: products
      });
    }
  })
})


router.get('/:slug', function (req, res) {

  var slug = req.params.slug.trim();

  Page.findOne({slug: slug},function(err,page){
    if(err){
      console.log(err);
    if(!page){
      res.redirect('/');
    }
    }else{
      res.render('index', {
        title: page.title,
        content: page.content
      });
    }
  })
  
})

module.exports = router;