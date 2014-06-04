
$( document ).ready(function() {
	// Import the rest of the functions
	
	
	console.log( "ready!" );
	
	// Resize SVG
	console.log($(document).width());
	$("#svg_canvas").width($(document).width() - 100);
	$("#svg_canvas").height($(document).height()-100);
	
	drawGrid();
	
	var testDesign = createDesign();
	//console.log(testDesign);
	/*
	testDesign.addLine(1, 1, 2, 2); // Diag down
	testDesign.addLine(2, 2, 2, 3); // Down
	testDesign.addLine(2, 3, 3, 4); // Diag down
	testDesign.addLine(3, 4, 4, 4); // Horizontal
	testDesign.addLine(4, 4, 4, 3); // Up
	testDesign.addLine(4, 3, 3, 2); // Diag down
	testDesign.addLine(3, 2, 2, 2); // Horizontal
	
	testDesign.addLine(7, 3, 8, 2); // Diag up
	
	testDesign.addLine(8, 2, 8, 3); // Down
	*/
	//testDesign.addLine(8, 3, 7, 3); // Horizontal
	//testDesign.addLine(8, 3, 7, 3); // Horizontal // Tests adding repeated lines
	//testDesign.addLine(7, 3, 8, 3); // Horizontal // Tests adding repeated line
	
	// Random start
	randomRestart(testDesign);
	
	console.log(testDesign);
	
	// Testing rules/grammar
	buildRules();
	//randomExpansion(testDesign);
	
	
	/*
	// Testing vertical reflection
	var testDesign2 = createDesign();
	testDesign2.addAllLines(testDesign.reflectPoints("x", 9));
	// Testing horizontal reflection
	var testDesign3 = createDesign();
	testDesign3.addAllLines(testDesign.reflectPoints("y", 5));
	testDesign3.addAllLines(testDesign2.reflectPoints("y", 5));
	
	//console.log(testDesign2);
	drawDesignOnGrid(testDesign2);
	drawDesignOnGrid(testDesign3);
	*/
	
	// Testing self-reflection
	//testDesign.addAllLines(testDesign.reflectPoints("x", 8));
	//testDesign.addAllLines(testDesign.reflectPoints("y", 4));
	
	// Testing new reflection
	// NOTE: These reflections happen in global space, NOT design space! 
	//		 Count 0 from the upper left corner and y is inverted.
	//testDesign.addAllLines(testDesign.reflectArbitraryLines(0, 4));
	//testDesign.addAllLines(testDesign.reflectArbitraryLines(null, null, 8));
	//testDesign.addAllLines(testDesign.reflectArbitraryLines(1, -4)) // diagonal y=x goes \ 
	//testDesign.addAllLines(testDesign.reflectArbitraryLines(-1, 10)) // diagonal y=-x / 
	
	// Testing rotation
	// ONLY LOOKS GOOD FOR INCRIMENTS OF 90
	//testDesign.addAllLines(testDesign.rotateAroundArbitraryPoint(10, 10, Math.PI/2));
	//testDesign.addAllLines(testDesign.rotateAroundArbitraryPoint(10, 10, Math.PI));
	
	//drawDensityColorMap(testDesign);
	drawDesignOnGrid(testDesign);
	
	//drawMST(testDesign);
	
	$("#randExp").click(function(){
		randomExpansion(testDesign);
		
		drawOneMoreLine(testDesign);
		//$("#svg_canvas").empty();
		//drawGrid();
		//drawDesignOnGrid(testDesign);
		
	});
	
	$("#restartGen").click(function(){
		$("#svg_canvas").empty();
		drawGrid();
		testDesign = createDesign();
		randomRestart(testDesign);
		drawDesignOnGrid(testDesign);
	});
	
	$("#randPost").click(function(){
		var designManip = randomPostProduction(testDesign);
		drawDesignOnGrid(designManip);
	});
});

var randomRestart = function(design){
	console.log("Random restart...");
	sizeGrid();
	var x = Math.floor(numAcross/2);
	var y = Math.floor(numDown/2);
	
	randomGrammarStart(design, x, y);
	console.log("Random restart complete.");
}
