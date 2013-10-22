var ideas = [];
var ideaLinks = [];
// Creating a quick Hashmap 
var map = {};

// D3js part 
var width = 960;
var height = 300;



var svg = d3.select("body").append("svg")
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
  link = link.data(force.links());
  link.enter().insert("line",".node").attr("class","link");
  
  node = node.data(force.nodes());
  node.enter().append("circle").attr("r",8)
  .on("mouseover",mouseover)
  .on("mouseout",mouseout)
  .call(force.drag);
  
  node.append("title").text(function(d){return d.node});
  //node.on("mouseover",mouseover)
  //.call(force.drag);
  force.start();
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

