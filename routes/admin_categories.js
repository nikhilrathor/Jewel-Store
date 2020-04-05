var express = require('express');
var router = express.Router();
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;

var Category = require('../models/category')

router.get('/', isAdmin, function (req, res) {
    Category.find(function (err, categories) {
        res.render('admin/categories', {
            categories: categories
        });
    });
});

router.get('/add-category', isAdmin, function (req, res) {

    var title = "";

    res.render('admin/add_category', {
        title: title
    });
});


router.post('/add-category', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
            slug: slug
        });
    }
    else {
        Category.findOne({ slug: slug }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category slug exists, choose another.');
                res.render('admin/add_category', {
                    title: title
                });
            }
            else {
                var category = new Category({
                    title: title,
                    slug: slug
                });
                category.save(function (err) {
                    if (err)
                        return console.log(err);
                    Category.find(function (err, categories) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.app.locals.categories = categories;
                        }
                    })
                    req.flash('success', 'Category added!');
                    res.redirect('/admin/categories');
                });
            }
        });
    }

});


router.get('/edit-category/:id', isAdmin, function (req, res) {

    Category.findById(req.params.id.trim(), function (err, category) {
        if (err) {
            return console.log(err);
        }
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });
    })

});


router.post('/edit-category/:id', function (req, res) {

    req.checkBody('title', 'Title must have a value').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }
    else {
        Category.findOne({ slug: slug, _id: { '$ne': id.trim() } }, function (err, category) {
            if (category) {
                req.flash('danger', 'Category title exists, choose another.');
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            }
            else {
                Category.findById(id.trim(), function (err, category) {
                    if (err)
                        return console.log(err);
                    category.title = title;
                    category.slug = slug;
                    category.save(function (err) {
                        if (err)
                            return console.log(err);
                        Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        })
                        req.flash('success', 'Category edited!');
                        res.redirect('/admin/categories/edit-category/' + id);
                    });
                })

            }
        });
    }

});


router.get('/delete-category/:id', isAdmin, function (req, res) {
    Category.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return console.log(err);

        Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        })

        req.flash('success', 'Category Deleted!');
        res.redirect('/admin/categories/');
    })
})

module.exports = router;