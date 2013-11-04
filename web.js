// Runs the basic server functions for node.js
var application_root = __dirname;
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

// Create server
var app = express();

// Connect to database
// Here we find an appropriate database to connect to, defaulting to localhost if there is none
var uristring = 
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost/HelloNinja';


// Create Schemas
var Schema = mongoose.Schema;

var NodeSchema = new Schema({
	node: String,
	desc: String,
    	index: Number,
   	weight: Number,
    	x: Number,
    	y: Number,
    	px: Number,
    	py: Number,
    	fixed: Number
});


var LinkSchema = new Schema({
    	source: {
		type: Schema.ObjectId,
		ref: 'Node'
	},
	target: {
		type: Schema.ObjectId,
		ref: 'Node'
	}
});

var IndexSchema = new Schema({
	name: String,
	index: Number
});

var NinjaGraphSchema = new Schema({
 	name: String,
	date: { type: Date, default: Date.now },
	author: String,
	visibility: {
		type: String,
		enum: ['public','private'],
		required:true
	},
	nodes:[NodeSchema],
	links:[LinkSchema],
	indexes: [IndexSchema]
});

var NinjaSchema = new Schema({
	username: String,
	email: String,
	password: String,
	ninjaType: String,
	rank: Number,
	points: Number,
	graphs: [NinjaGraphSchema]
});


var Node = mongoose.model('Node',NodeSchema);
// var NinjaModel
var NinjaModel = mongoose.model('Ninja', NinjaSchema);


mongoose.connect(uristring,function(err,res){
 	if(err){
   		console.log('Failed in connecting to ' + uristring + '. ' + err);
	}else{
   		console.log('Succeeded in connecting to ' + uristring);
	}
});


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

app.post('/ninja',function(req,res){
	var ninja;
	console.log("POST: ");
	console.log(req.body);
});

// Start server
var port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log("Listening on " + port);
});
