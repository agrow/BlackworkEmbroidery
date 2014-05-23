
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
	drawDesignOnGrid(testDesign);
});