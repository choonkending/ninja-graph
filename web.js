// Runs the basic server functions for node.js
var application_root = __dirname;
var express = require('express');

var path = require('path');

// Create server
var app = express();

/*
// Commented so that modifications can be done later
var mongoose = require('mongoose');
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
	desc: String
});


var LinkSchema = new Schema({
    	source: Number,
	target: Number
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
	indexes: Object
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


var NodeModel = mongoose.model('Node',NodeSchema);

var NinjaGraphModel = mongoose.model('NinjaGraph', NinjaGraphSchema);

// var NinjaModel
var NinjaModel = mongoose.model('Ninja', NinjaSchema);


mongoose.connect(uristring,function(err,res){
 	if(err){
   		console.log('Failed in connecting to ' + uristring + '. ' + err);
	}else{
   		console.log('Succeeded in connecting to ' + uristring);
	}
});

// End of mongoose connect
// Commented so that modifications can be done on it later
*/

// Configure Server
app.configure(function(){
        app.set('views', application_root + '/views');
        app.set('view engine', 'jade');

	//You must make sure that you define all configurations BEFORE defining routes
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// The order of which we use this is important
	// This way app.router gets sent to client
	app.use(app.router);
	// Serve static content
	app.use(express.static(path.join(application_root,'public')));
	
	//show all errors in development
        app.use(express.errorHandler({dumpExceptions:true,showStack:true}));
});

// Begin traffic! hehe
app.get('/',function(req,res){
	res.render('index');
});

// Post a ninja graph
// So far the ninja graph nodes are fixed
/* 
// Basic interaction with the server
// Commented for modifications later
app.post('/ninja',function(req,res){
	
	var ninjaGraph = new NinjaGraphModel({
		name: "Ninja",
		author: "Choon Ken Ding",
		visibility: 'public'
	});
	
	var node = JSON.parse(req.body.nodes);
	node.forEach(function(node){
		ninjaGraph.nodes.push(node);
		console.log(node);
	});
	var link = JSON.parse(req.body.links);
	link.forEach(function(link){
		ninjaGraph.links.push(link);
	});
	var index = JSON.parse(req.body.indexes);
	ninjaGraph.indexes = index;
	ninjaGraph.save(function(err){
		console.log(err);
		if(err) return err;
	});
	
});


// get a ninja graph
// Parameters -  id = Ninja (This is an example)
app.get('/ninjaGraph',function(request,response){
	console.log(request.query.id);
        return NinjaGraphModel.findOne( { name : request.query.id },function(err,ninjaGraph){
                if(!err){
                        console.log("It's working");
                        return response.send(JSON.stringify(ninjaGraph));
                }else{
                        console.log("It's not working");
                        return console.log(err);
                }
        });
});
*/
// Start server
var port = process.env.PORT || 5000;
app.listen(port, function(){
    console.log("Listening on " + port);
});
