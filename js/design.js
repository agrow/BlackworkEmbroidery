var createPosition = function(){
	var position = {
		x: 1,
		y: 1
	};
	return position;
};

var createPoint = function(){
	var point = {
		position: createPosition(),
		
		// Point connections
		0: null, // Up
		1: null, // Up-right
		2: null, // Right
		3: null, // Down-right
		4: null, // Down
		5: null, // Down-left
		6: null, // Left
		7: null, // Up-left
		
		// Line connections
		line0: null, // Up
		line1: null, // Up-right
		line2: null, // Right
		line3: null, // Down-right
		line4: null, // Down
		line5: null, // Down-left
		line6: null, // Left
		line7: null, // Up-left
	};
	
	return point;
};

var createLine = function(){
	var line = {
		point1: createPoint(),
		point2: createPoint(),
		direction: "NA",
		findDirection: function(){
			// Determines if the line is horizontal, vertical, or 
			// diagonal based on the x/y positions of its points
		},
	};
	
	return line;
};

var createDesign = function(){
	var design = {
		absoluteRoot: createPosition(),
		width: 10,
		height: 10,
		minWidth: 0, // calculated from points contained in the design
		minHeight: 0, 
		findMinDimensions : function(){
			// Uses included points to find the min width/height to contain them
		},
		changeRoot: function(x, y){
			// moves all points in the design by x and y amounts to keep the root
			// at the upper left corner
		},
		// Design contents
		points: [],
		lines: [],
		addPoint : function(x, y){
			// does the point exist?
			
			// if not, make it!
			var pt = createPoint();
			pt.position.x = x;
			pt.position.y = y;
			design.points.push(pt);
		},
		removePoint : function(x, y){
			
		},
		addLine : function(){
			
		},
		removeLine : function() {
			
		},
		// Design standard functions
		update: function(){
			
		},
		draw: function(){
			
		},
	};
	
	return design;
};
