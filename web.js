// Runs the basic server functions for node.js
var application_root = __dirname;
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

// Create server
var app = express();

// Connect to database

// Create Schemas

// Configure Server
app.configure(function(){
        app.set('views', application_root + '/views');
        app.set('view engine', 'jade');
	
	// The order of which we use this is important
	// This way app.router gets sent to client
	app.use(app.router);
	// Serve static content
	app.use(express.static(path.join(application_root,'public')));
	//show all errors in development
        app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});

app.get('/',function(req,res){
	res.render('index');
});

// Start server
var port = process.env.PORT || 8080;
app.listen(port, function(){
    console.log("Listening on " + port);
});
