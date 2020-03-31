var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Admin Area')
})

router.get('/add-page', function (req, res) {
    
    var title = "";
    var slug = "";
    var content = "";
    
    res.render('admin/add_page',{
        title: title,
        slug: slug,
        content: content
    });
});

module.exports = router;