var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Category = require('../models/category');

router.get('/', function (req, res) {
  Product.find(function (err, products) {
    if (err) {
      console.log(err);
    } else {
      res.render('all_products', {
        title: 'All Products',
        products: products
      });
    }
  })
})


router.get('/:category', function (req, res) {

  var categorySlug = req.params.category;
  Category.findOne({ slug: categorySlug }, function (err, c) {
    if (err) {
      console.log(err);
    }
    Product.find({ category: categorySlug }, function (err, products) {
      if (err) {
      } else {
        console.log(products);
        res.render('cat_products', {
          title: c.title,
          products: products
        });
      }
    })
  })
})

router.get('/:category/:product',function(req,res){

  Product.findOne({slug: req.params.product}, function(err, product){
    if(err){
      console.log(err);
    }else{
      res.render('product',{
        title: product.title,
        p: product
      })
    }
  })
})




module.exports = router;