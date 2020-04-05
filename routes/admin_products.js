var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
const fs = require('fs');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;


var Product = require('../models/product');
var Category = require('../models/category');

router.use(express.static(__dirname + "./public"))

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var Storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: Storage
}).single('file');

router.get('/', isAdmin, function (req, res) {
    var count;
    Product.countDocuments(function (err, c) {
        count = c;
    });

    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});

router.get('/add-product', isAdmin, function (req, res) {

    var title = "";
    var desc = "";
    var price = "";

    Category.find(function (err, categories) {
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    })


});


router.post('/add-product', upload, function (req, res) {

    //console.log(req.files[0]);
    if (req.file) {
        var imageFile = req.file.filename
    } else {
        var imageFile = 'noimage.png';
    }
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('desc', 'Description must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    var title = req.body.title;

    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/add_product', {
                errors: errors,
                title: title,
                desc: desc,
                categories: categories,
                price: price
            });
        })
    }
    else {
        Product.findOne({ slug: slug }, function (err, product) {
            if (product) {
                req.flash('danger', 'Product title exists, choose another.');
                Category.find(function (err, categories) {
                    res.render('admin/add_product', {
                        errors: errors,
                        title: title,
                        desc: desc,
                        categories: categories,
                        price: price
                    });
                })
            }
            else {
                var price2 = parseFloat(price).toFixed(2);
                var product = new Product({
                    title: title,
                    slug: slug,
                    desc: desc,
                    price: price2,
                    category: category.trim(),
                    image: imageFile
                });
                product.save(function (err) {
                    if (err)
                        return console.log(err);

                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products');
                });
            }
        });
    }

});

router.get('/edit-product/:id', isAdmin, function (req, res) {

    var errors;

    if (req.session.errors) errors = req.session.errors;
    req.session.errors = null;

    Category.find(function (err, categories) {

        Product.findById(req.params.id, function (err, p) {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                res.render('admin/edit_product', {
                    title: p.title,
                    errors: errors,
                    desc: p.desc,
                    categories: categories,
                    category: p.category,
                    price: parseFloat(p.price).toFixed(2),
                    image: p.image,
                    id: p._id
                });
            }
        });

    })



});


router.post('/edit-product/:id', upload, function (req, res) {

    if (req.file) {
        var imageFile = req.file.filename;
    } else {
        var imageFile = 'noimage.png';
    }
    req.checkBody('title', 'Title must have a value').notEmpty();
    req.checkBody('desc', 'Description must have a value').notEmpty();
    req.checkBody('price', 'Price must have a value').isDecimal();
    var title = req.body.title;

    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/' + id);
    }
    else {
        Product.findOne({ slug: slug, _id: { '$ne': id.trim() } }, function (err, p) {
            if (err) console.log(err);
            if (p) {
                req.flash('danger', "Product title exist, choose another.");
                res.redirect('/admin/products/edit-product/' + id);
            } else {
                Product.findById(id, function (err, p) {
                    if (err) {
                        console.log(err);
                    }
                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = price;
                    p.category = category.trim();
                    p.image = imageFile;

                    p.save(function (err) {
                        if (err)
                            console.log(err);

                        if (pimage.trim() != "noimage.png") {
                            const path = 'public/uploads/' + pimage.trim();

                            fs.unlink(path, (err) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }

                                //file removed
                            })
                        }
                        req.flash('success', 'Product edited!');
                        res.redirect('/admin/products/edit-product/' + id);
                    })
                })
            }
        })
    }

});


router.get('/delete-product/:id', isAdmin, function (req, res) {



    Product.findById(req.params.id, function (err, p) {
        if (err) {
            console.log(err);
        }
        if (p.image.trim() != "noimage.png") {
            const path = 'public/uploads/' + (p.image).trim();

            fs.unlink(path, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
        Product.findByIdAndRemove(req.params.id, function (err) {
            if (err)
                return console.log(err);

            req.flash('success', 'Product Deleted!');
            res.redirect('/admin/products/');
        })

    });
})

module.exports = router;