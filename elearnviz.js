var
    width = 1300,
    height = 600;
	
var	svg = d3.select('body')
		.append('svg')
		.attr('width', width)
		.attr('height', height);
// d3.select('body').append('p').text("Exercise Relationships in E-Learning: visualization of data (based on Chang, Hsu, and Chen)").style('text-align', 'center');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


d3.csv("junyi_Exercise_table.csv", function(error, taiwan) {
  if (error) throw error;
	
	tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
		return d.name.replace(/^(\w)/,function(v) { return v.toUpperCase(); }).replace(/_/g," "); 
	});
	svg.call(tip);
	
	var graph = new Object();
	graph.nodes = taiwan;
	graph.links = [];  
	
	var h = new Object(); 
		
	taiwan.forEach(function(d, i) { 
		d.id = i;
		h[d.name] = d.id;
		
		d.fixed = true;
		d.fx = d.h_position*10+300;
		d.fy = d.v_position*10+400;
	});
	
	taiwan.forEach(function(d, i) {
		d.prerequisites.split(',').forEach(function(dd, ii) {
			if (dd && dd in h){
				graph.links.push({'source':h[dd], 'target':d.id});  
			}
		});
	});
		
  
  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      //.attr("stroke-width", function(d) { return Math.sqrt(d.value); });
      .attr("stroke-width", function(d) { return 1; });

	  
  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
      .attr("r", 5)
      //.attr("fill", function(d) { return color(d.group); })
      .attr("fill", function(d) { return color(d.area); })
	    .on('mouseover', tip.show)
		.on('mouseout', tip.hide)

	  ;
      //.call(d3.drag()
        //  .on("start", dragstarted)
          //.on("drag", dragged)
          //.on("end", dragended));
  node.append("title")
      .text(function(d) { return d.id; });

	  // node.on("click", function(d) {
		// console.log(d.name);
	  // });
	  
  simulation.nodes(graph.nodes).on("tick", ticked);

	 graph.links.forEach(function(link, index, list) {
        if (typeof graph.nodes[link.source] === 'undefined') {
            console.log('undefined source', link);
        }
        if (typeof graph.nodes[link.target] === 'undefined') {
            console.log('undefined target', link);
        }
    });	 
	  
	  //return;
  simulation.force("link").links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
