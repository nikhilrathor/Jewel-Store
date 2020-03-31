var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database')

mongoose.connect(config.database, {useUnifiedTopology: true, useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connected to mongodb')
});

var app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));

var pages = require('./routes/pages.js')
var adminPages = require('./routes/admin_pages.js')

app.use('/admin/pages',adminPages);
app.use('/',pages);

var port = 3200;
app.listen(port,function(){
    console.log("Server started on port"+port);
})