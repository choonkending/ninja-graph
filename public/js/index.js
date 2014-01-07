var ideas = [];
var ideaLinks = [];
// Creating a quick Hashmap 
var map = {};

// used to send to server
var ideas2 = [];
var ideaLinks2 = [];

// D3js part 
var width = 960;
var height = 350;



var svg = d3.select("#canvas").append("svg")
          .attr("width", width)
          .attr("height", height);

var force = d3.layout.force()
            .nodes(ideas)
            .links(ideaLinks)
            .charge(-400)
            .linkDistance(50)
            .size([width, height]);

var node = svg.selectAll(".node");
var link = svg.selectAll(".link");

force.on("tick", function(){
  link.attr("x1", function(d){ return d.source.x;})
  .attr("y1",function(d){return d.source.y;})
  .attr("x2",function(d){return d.target.x;})
  .attr("y2",function(d){return d.target.y});
  node.attr("cx", function(d){return d.x;})
  .attr("cy", function(d){return d.y;});
});


function start(){
  console.log(ideas);
  console.log(ideaLinks);
  console.log(map);
  link = link.data(force.links());
  link.enter().insert("line",".node").attr("class","link");
  
  node = node.data(force.nodes());
  node.enter().append("circle").attr("r",8)
  .on("mouseover",mouseover)
  .on("mouseout",mouseout)
  .call(force.drag);
  
  node.append("title").text(function(d){return d.node});
  force.start();
}

// For for-each, taken from Mozilla Developer
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
        'use strict';
        var i, len;
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    };
}
// Filtering necessary data to send to server
function filterIdea(idea){
	ideas2.push({"node":idea.node, "desc":idea.desc});
}

function filterLink(link){
	console.log(link);
	ideaLinks2.push({"source":link.source.index, "target":link.target.index, value:link.value});
}

// Creating events
$('#nodeBtn').click(function(){
  var idea = $('#nodeEntry').val();
  var desc = $('#nodeDesc').val();
  var parent = $('#nodeParent').val();
  ideas.push({"node":idea,"desc":desc});
  if(map[idea] == null){
    map[idea] = ideas.length - 1;
  }
  if(parent != null && parent != "No Parent"){
    
    ideaLinks.push({"source":map[parent],"target":map[idea],value:5});
  }
  
  
  $('#nodeParent').append('<option>'+idea+'</option>');
  start();
});

// Creating share event
$('#shareBtn').click(function(){
   ideas.forEach(filterIdea);
   var ideaJSON = JSON.stringify(ideas2);
   ideaLinks.filter(filterLink);
   var ideaLinksJSON = JSON.stringify(ideaLinks2);
   var mapJSON = JSON.stringify(map);
   console.log(ideas2);
   console.log(ideaLinks2);
   console.log(mapJSON);

   // Using jQuery.ajax() to send graphical data
   $.ajax({
	type:"POST",
	url:"/ninja",
	contentType: "application/x-www-form-urlencoded", 
	dataType:"json",
	data:{
		nodes: ideaJSON,
		links: ideaLinksJSON,
		indexes: mapJSON
	},
	fail:function(){
		console.log("process failed");
	}
   });
	
});


$('#searchBtn').click(function(){
   
   // Using jQuery.ajax() to send graphical data
   $.ajax({
	type:"GET",
	url:"/ninjaGraph",
	data:{id:'Ninja'}
	
   })
	.fail(function(){
		console.log("process failed");
	})
	.done(function( data, textStatus, jqXHR ) {
		
		//console.log(data);
		var ninjaGraph = JSON.parse(data);
		for(var i = 0; i < ninjaGraph.nodes.length; i++){
			ideas.push(ninjaGraph.nodes[i]);
			console.log(ninjaGraph.nodes[i]);
		}
		for(var i = 0; i < ninjaGraph.links.length; i++){
			ideaLinks.push(ninjaGraph.links[i]);
		}
		
		//ideas = ninjaGraph.nodes;
		
		
		map = ninjaGraph.indexes;
		start();
		
	});
	
});


function mouseover(d) {
  d3.select(this).transition()
      .duration(750)
      .attr("r", 16)
      .style("fill","#2ca02c");
  d3.select("#ideaDisplay").text(d.node).attr("class","well animated fadeInLeft");
  d3.select("#descDisplay").text(d.desc).attr("class","well animated fadeInLeft");
}
function mouseout() {
  d3.select(this).transition()
      .duration(750)
      .attr("r", 8)
      .style("fill","#000");
  d3.select("#ideaDisplay").text("")
  .attr("class","animated fadeOutRight");
  d3.select("#descDisplay").text("").attr("class","animated fadeOutRight");
}

