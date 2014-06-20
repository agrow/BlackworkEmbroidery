
// an integer value representing the pixel space between lines drawn
var gridSpacing = 20;
// set by drawGrid
var numAcross; 
var numDown;

var clearSVG = function(){
	var svgElement = d3.selectAll("svg");
	
};

var sizeGrid = function(){
	numAcross = $("#svg_canvas").width()/gridSpacing +1;
	numDown = $("#svg_canvas").height()/gridSpacing +1;
};

var drawGrid = function(){
	console.log("Drawing grid...");
	sizeGrid();
	var svgElement = d3.selectAll("svg");
	svgElement.on("mousemove", activeLineMouseMove);
	
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
				.attr("r", 4)
				.style("fill", "#A8A8A8")
				.on("mouseover", function() {
					d3.select(this).attr("r", 6)
								   .attr("fill", "#686868");
				})
				.on("mouseout", function() {
					d3.select(this).attr("r", 4)
								   .attr("fill", "#A8A8A8");
				})
				//.on("mousedown", nodeMouseDown)
				//.on("mouseup", nodeMouseUp);
				.on("click", nodeClick);
		}	
	}
	
	console.log("Grid drawn.");
};

var makingLine = {
	startX: -1,
	startY: -1,
	endX: -1,
	endY: -1,
	activeLine: false,
	id: "activeDrawingLine",
	restart: function(){
		makingLine.startX = makingLine.endX = makingLine.startY = makingLine.endY = -1;
		makingLine.activeLine = false;
		var line = d3.selectAll("#" + makingLine.id).remove();
		//console.log(makingLine);
	}
};

var nodeClick = function(){
	console.log("clicked a node!");
	
	if(!makingLine.activeLine){
		// Start the line
		makingLine.activeLine = true;
		makingLine.startX = d3.select(this).attr("cx");
		makingLine.startY = d3.select(this).attr("cy");
		console.log("Click1 on node at " + makingLine.startX + ", " + makingLine.startY);
		
		console.log(d3.mouse(this));
		var mouse = d3.mouse(this);
		
		var svgElement = d3.selectAll("svg");
		svgElement.append("line")
			.attr("x1", makingLine.startX)
			.attr("y1", makingLine.startY)
			.attr("x2", mouse[0])
			.attr("y2", mouse[1])
			.attr("stroke-width", 2)
			.attr("stroke", "#000000")
			.attr("stroke-linecap", "round")
			.attr("id", makingLine.id);
	} else {
		
		// Active line, finish it if the line is valid ()
		makingLine.endX = d3.select(this).attr("cx");
		makingLine.endY = d3.select(this).attr("cy");
		
		if(Math.pow(makingLine.startX - makingLine.endX, 2) + Math.pow(makingLine.startY - makingLine.endY, 2) < Math.pow(1.5*gridSpacing, 2)){
			
			console.log("Click2 on node at " + makingLine.endX + ", " + makingLine.endY);
			// Make new line and add it to design[0]
			// Don't forget to divide by gridspace
			allDesigns[0].addLine(makingLine.startX/gridSpacing, makingLine.startY/gridSpacing, makingLine.endX/gridSpacing, makingLine.endY/gridSpacing);
			drawOneMoreLine(allDesigns[0]);
			redrawDesignBoundary(allDesigns[0]);
			
			makingLine.restart();
		}
	}
};

var nodeMouseDown = function(){
	/*
	 makingLine.activeLine = true;
	 makingLine.startX = d3.select(this).attr("cx");
	 makingLine.startY = d3.select(this).attr("cy");
	 console.log("Mouse down on node at " + makingLine.startX + ", " + makingLine.startY);
	 
	 console.log(d3.mouse(this));
	 var mouse = d3.mouse(this);
	 
	 var svgElement = d3.selectAll("svg");
	 svgElement.append("line")
		.attr("x1", makingLine.startX)
		.attr("y1", makingLine.startY)
		.attr("x2", mouse[0])
		.attr("y2", mouse[1])
		.attr("stroke-width", 2)
		.attr("stroke", "#000000")
		.attr("stroke-linecap", "round")
		.attr("id", makingLine.id);*/
};

var activeLineMouseMove = function(){
	// grab svg activeLine. Change its x and y to mouseX and mouseY
	//console.log(makingLine.activeLine);
	if(makingLine.activeLine){
		var mouse = d3.mouse(this);
		//console.log("updating mouse position: " + mouse);
		var line = d3.selectAll("#" + makingLine.id);
		if(makingLine.startY < mouse[1]){
			line.attr("x2", mouse[0])
				.attr("y2", mouse[1]-2);
		} else {
			line.attr("x2", mouse[0])
				.attr("y2", mouse[1]+2);
		}
	}
};

var nodeMouseUp = function(){
	/*
	makingLine.endX = d3.select(this).attr("cx");
	makingLine.endY = d3.select(this).attr("cy");
	console.log("Mouse up on node at " + makingLine.endX + ", " + makingLine.endY);
	// Make new line and add it to design[0]
	// Don't forget to divide by gridspace
	allDesigns[0].addLine(makingLine.startX/gridSpacing, makingLine.startY/gridSpacing, makingLine.endX/gridSpacing, makingLine.endY/gridSpacing);
	drawOneMoreLine(allDesigns[0]);
	redrawDesignBoundary(allDesigns[0]);
	
	makingLine.restart();*/
};

var lineClick = function(){
	// Remove the line	
	var lineName = d3.select(this).attr("id");
	lineName = lineName.substring(5);
	console.log("line name to delete: " + lineName);
	for(var i = 0; i < allDesigns.length; i++) {
		allDesigns[i].removeLine(lineName);
	}
	d3.select(this).remove();
	// Redraw the design outline of the main design in case it's changed'
	if(allDesigns[0]) redrawDesignBoundary(allDesigns[0]);
};

var lineMouseEnter = function(){
	// Make bigger
	d3.select(this).style("stroke-width", 5);
	// Maybe show an info pane?
	
};

var lineMouseLeave = function(){
	// Make smaller
	d3.select(this).style("stroke-width", 3);
	// Maybe hide an info pane?
};

var drawDesignLine = function(svgElement, line, options){

	svgElement.append("line")
		.attr("x1", line.point1.position.x * gridSpacing)
		.attr("y1", line.point1.position.y * gridSpacing)
		.attr("x2", line.point2.position.x * gridSpacing)
		.attr("y2", line.point2.position.y * gridSpacing)
		.attr("stroke-width", 3)
		.attr("stroke", "#000000")
		.attr("stroke-linecap", "round")
		.attr("id", "line_" +line.id)
		.attr("class", function(d){
			if(options && options.class) return options.class;
			else return "";
		})
		.on("mouseover", lineMouseEnter)
		.on("mouseout", lineMouseLeave)
		.on("click", lineClick);
	
};

var drawDensityColorMap = function(design){
	var svgElement = d3.selectAll("svg");
	
	// init map
	var map = new Array(Math.floor(numAcross));
	for(var i = 0; i < numAcross; i++){
		map[i] = new Array(Math.floor(numDown));
	}
	
	for(var i = 0; i < design.points.length; i++){
		map[design.points[i].position.x][design.points[i].position.y] = design.points[i].lines.length;
	}
	
	for(var i = 0; i < numAcross; i++){
		for(var j = 0; j < numDown; j++){
			if (isNaN(map[i][j])) map[i][j] = 0;
			
			svgElement.append("rect")
				.attr("x", (i * gridSpacing) - (gridSpacing/2))
				.attr("y", (j * gridSpacing) - (gridSpacing/2))
				.attr("width", gridSpacing)
				.attr("height", gridSpacing)
				.style("fill", "hsla(" + (map[i][j] * 40) + ", 50%, 50%, 0.5)");
		}
	}
	
	
};

var drawMST = function(design){
	var svgElement = d3.selectAll("svg");
	var edges = design.findMST();
	console.log("MST found: "); console.log(edges);
	for(var i = 0; i < edges.length; i++){
		svgElement.append("line")
			.attr("x1", edges[i].point1.position.x * gridSpacing)
			.attr("y1", edges[i].point1.position.y * gridSpacing)
			.attr("x2", edges[i].point2.position.x * gridSpacing)
			.attr("y2", edges[i].point2.position.y * gridSpacing)
			.attr("stroke-width", 1)
			.attr("stroke", "yellow")
			.attr("stroke-linecap", "round");
	}
};

var drawDesignOnGrid = function(design, options){
	console.log("Drawing design...");
	var svgElement = d3.selectAll("svg");
	for(var i = 0; i < design.lines.length; i++){
		//console.log("drawing line... " + (design.lines[i].point1.position.x * gridSpacing) + ", " + design.lines[i].point1.position.y * gridSpacing + " /// " +
		//							   + (design.lines[i].point2.position.x * gridSpacing) + ", " + design.lines[i].point2.position.y * gridSpacing);
		drawDesignLine(svgElement, design.lines[i], options);
	}
	console.log("Design drawn " + design.lines.length + " lines.");
};

var drawDesignOnGridAsEdge = function(design, options){
	var testCount = 0;
	// Determine how many designs we can fit on here
	design.updateDimensions();
	var numDesigns = Math.ceil(numAcross/design.width) +2;
	console.log("Can fit " + numDesigns + " on X axis... " + numAcross + "/" + design.width);
	
	// Translate to the beginning
	while(design.greatestX > 0 && testCount < 100){
		console.log("GREATESTX?! " + design.greatestX);
		design.translateTheseLines(-design.width, 0);
		design.updateDimensions();
		testCount ++;
	}
	console.log("Move design " + testCount + " times");
	//design.updateDimensions();
	
	// NOTE: Figure out how to not duplicate lines later
	// Stamp them across the X axis
	for(var i = 0; i < numDesigns; i++){
		drawDesignOnGrid(design, options);
		design.translateTheseLines(design.width, 0);
	}
	
};

var drawDesignOnGridAsFill = function(design, options){
	var testCount = 0;
	// Determine how many designs we can fit on here
	design.updateDimensions();
	var numDesigns = Math.ceil(numDown/design.height) +2;
	console.log("Can fit " + numDesigns + " on Y axis... " + numDown + "/" + design.height);
	
	//Translate to the top
	while(design.greatestY > 0 && testCount < 100){
		console.log("GREATESTY?! " + design.greatestY);
		design.translateTheseLines(0, -design.height);
		design.updateDimensions();
		testCount ++;
	}
	console.log("Move design " + testCount + " times");
	
	//design.translateTheseLines(0, -design.height * Math.floor(numDesigns/2));
	
	// Stamp them across the Y axis
	console.log("num designs?! " + numDesigns);
	for(var i = 0; i < numDesigns; i++){
		console.log("drawing row " + i);
		//console.log(design);
		drawDesignOnGridAsEdge(design, options);
		//drawDesignOnGrid(design, options);
		//console.log(design);
		design.translateTheseLines(0, design.height);
	}
};

var drawOneMoreLine = function(design){
	if(design.lastAddedLine !== null){
		var svgElement = d3.selectAll("svg");
		
		drawDesignLine(svgElement, design.lastAddedLine);
	}
};

var redrawDesignBoundary = function(design){
	var svgElement = d3.selectAll("svg");
	removeObjectsWithClassName("designBoundary");
	design.updateDimensions();
	
	svgElement.append("rect")
		.attr("x", design.smallestX * gridSpacing - gridSpacing/4)
		.attr("y", design.smallestY * gridSpacing - gridSpacing/4)
		.attr("width", design.width * gridSpacing + gridSpacing/2)
		.attr("height", design.height * gridSpacing + gridSpacing/2)
		.attr("stroke-width", 2)
		.attr("stroke", "pink")
		.attr("fill", "none")
		.attr("class", "designBoundary");
};

var redrawPostProductionBoundary = function(postProdDesign) {
	
};

var removeObjectsWithClassName = function(name){
	var svgElements = d3.selectAll("." + name);
	//console.log("SVG ELEMENTS!?!?!?!?!?!!! ");
	//console.log(svgElements);
	svgElements.remove();
};

var removeObjectByID = function(id){
	var svgElements = d3.selectAll("#" + id);
	console.log("SVG ELEMENTS!?!?!?!?!?!!! ");
	console.log(svgElements);
	svgElements.remove();
};
