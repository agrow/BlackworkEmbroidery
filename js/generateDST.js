
// 10 units in the machine is ~ 1 mm
// The Brother SE-400's space is ~ 100 x 100 mm or 3.9 x 3.9 inches
// The system also has a limit of 32,000 stitches

// 100 x 100 mm = 1000 x 1000 file units
// The 9 file unit test stitches were very small. I am going to set the default to 20 units per stitch
// means 50 stitches

var hoop = {
	//// Grid drawing info
	x:0,
	y:0,
	width:0, // my hoop is a square, so width and height should be the same...
	height:0,
	centerX:0,
	centerY:0,
	
	//// Hoop and starter scale
	unitsPerStitch:20, // 20 units / stitch
	maxNumStitchWidth:0, // Will be calculated to 50
	maxNumStitchHeight:0, // Will be calculated to 50
	fileUnitsWidth: 1000,
	fileUnitsHeight: 1000,
};

var findMaxNumHoopStitches = function(){
	hoop.maxNumStitchHeight = hoop.fileUnitsHeight/hoop.unitsPerStitch;
	hoop.maxNumStitchWidth = hoop.fileUnitsWidth/hoop.unitsPerStitch;
};

// The unitsPerStitch may change, resulting in a new hoop dimension to be calculated
// The centerX/centerY may change, resulting in a new set of hoop location calculations
var generateHoopDimensions = function(gridPixelSize){
	findMaxNumHoopStitches();
	
	hoop.width = hoop.maxNumStitchWidth * gridPixelSize;
	hoop.height = hoop.maxNumStitchHeight * gridPixelSize;
	
	hoop.x = hoop.centerX - hoop.width/2;
	hoop.y = hoop.centerY - hoop.height/2;
};

var generatePrintPattern = function(design, gridSpacing){
	
	// Remove all lines that would be outside the hoop
	console.log("design starting out with # lines: " + design.lines.length);
	for(var i = 0; i < design.lines.length; i++){
		var line = design.lines[i];
		if( line.point1.position.x * gridSpacing < hoop.x || line.point1.position.x * gridSpacing > hoop.x + hoop.width || 
			line.point2.position.x * gridSpacing < hoop.x || line.point2.position.x * gridSpacing > hoop.x + hoop.width || 
			line.point1.position.y * gridSpacing < hoop.y || line.point1.position.x * gridSpacing > hoop.y + hoop.height || 
			line.point2.position.y * gridSpacing < hoop.y || line.point2.position.x * gridSpacing > hoop.y + hoop.height){
				console.log("trying to remove line " + line.name);
				design.removeLine(line.name); 
		}
	}
	
	console.log("design AFTER TRIM # lines: " + design.lines.length);
	

};




