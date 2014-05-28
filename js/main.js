
$( document ).ready(function() {
	// Import the rest of the functions
	
	
	console.log( "ready!" );
	
	// Resize SVG
	console.log($(document).width());
	$("#svg_canvas").width($(document).width() - 100);
	$("#svg_canvas").height($(document).height()-100);
	
	drawGrid();
	
	var testDesign = createDesign();
	console.log(testDesign);
	testDesign.addLine(1, 1, 2, 2); // Diag down
	testDesign.addLine(2, 2, 2, 3); // Down
	testDesign.addLine(2, 3, 3, 4); // Diag down
	testDesign.addLine(3, 4, 4, 4); // Horizontal
	testDesign.addLine(4, 4, 4, 3); // Up
	testDesign.addLine(4, 3, 3, 2); // Diag down
	testDesign.addLine(3, 2, 2, 2); // Horizontal
	
	testDesign.addLine(7, 3, 8, 2); // Diag up
	testDesign.addLine(8, 2, 8, 3); // Down
	testDesign.addLine(8, 3, 7, 3); // Horizontal
	
	console.log(testDesign);
	
	//drawDensityColorMap(testDesign);
	drawDesignOnGrid(testDesign);
	
	drawMST(testDesign);
});