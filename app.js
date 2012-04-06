var util = require('util');

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , wiki = require('./wiki');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// get a wikipage
app.get('/wikis/note/pages/:name', function(req, res) {
    wiki.getPage(req.params.name, function(err, content) {
        if (err) throw err;
        res.render('page', {
            title: req.params.name,
            content: content
        });
    });
});

// get a form to post new wiipage
app.get('/wikis/note/new', function(req, res) {
    res.render('new', {
        title: 'New Page',
    });
});

// post new wikipage
app.post('/wikis/note/pages', function(req, res) {
    wiki.writePage(req.body.name, req.body.body, function(err) {
        wiki.getPage(req.body.name, function(err, content) {
            res.render('page', {
                title: req.body.name,
                content: content
            });
        });
    });
});

wiki.init(function (err) {
    app.listen(3000);
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});