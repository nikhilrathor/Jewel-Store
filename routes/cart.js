var express = require('express');
var router = express.Router();

var Product = require('../models/product');

router.get('/add/:product', function (req, res) {

  var slug = req.params.product;

  Product.findOne({ slug: slug }, function (err, p) {
    if (err) {
      console.log(err);
    }
    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        qty: 1,
        price: p.price,
        image: '/uploads/' + p.image
      });
    }
    else {
      var cart = req.session.cart;
      var newItem = true;

      for (var i = 0; i < cart.length; i++) {
        if(cart[i].title == slug){
          cart[i].qty++;
          newItem = false;
          break;
        }
      }
      if(newItem){
        cart.push({
          title: slug,
          qty: 1,
          price: p.price,
          image: '/uploads/' + p.image
        });
      }
    }
    req.flash('success','Product Added!');
    res.redirect('back');
  });
});


module.exports = router;