
// an integer value representing the pixel space between lines drawn
var gridSpacing = 20;

var drawGrid = function(){
	var numAcross = $("#svg_canvas").width()/gridSpacing +1;
	var numDown = $("#svg_canvas").height()/gridSpacing +1;
	var svgElement = d3.selectAll("svg");
	
	for(var i = 0; i < numAcross ; i++){
		svgElement.append("line")
			.attr("x1", i*gridSpacing)
			.attr("y1", 0)
			.attr("x2", i*gridSpacing)
			.attr("y2", $("#svg_canvas").height())
			.attr("stroke-width", 2)
			.attr("stroke", "#E8E8E8");
	}
	
	for(var j = 0; j < numDown ; j++){
		svgElement.append("line")
			.attr("x1", 0)
			.attr("y1", j*gridSpacing)
			.attr("x2", $("#svg_canvas").width())
			.attr("y2", j*gridSpacing)
			.attr("stroke-width", 2)
			.attr("stroke", "#E8E8E8");
	}
	
	// Grid points
	for(var i = 0; i < numAcross ; i++){
		for(var j = 0; j < numDown ; j++){
			svgElement.append("circle")
				.attr("cx", i*gridSpacing)
				.attr("cy", j*gridSpacing)
				.attr("r", 3)
				.style("fill", "grey")
				.on("mouseover", function() {
					d3.select(this).attr("r", 5);
				})
				.on("mouseout", function() {
					d3.select(this).attr("r", 3);
				})
				.on("click", nodeClick);
		}	
	}
};

var nodeClick = function(){
	//console.log("I clicked on a node! or did I? What is this?");
	//console.log(this);
	d3.select(this).style("fill", "red");
};
