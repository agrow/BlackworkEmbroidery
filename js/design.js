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
		// Point and Line connections
		//0: null, // Up
		//1: null, // Up-right
		//2: null, // Right
		//3: null, // Down-right
		//4: null, // Down
		//5: null, // Down-left
		//6: null, // Left
		//7: null, // Up-left
		// Reflexive Pairs: 0-4, 1-5, 2-6, 3-7
		adjLines: [null, null, null, null, null, null, null, null],
		adjPoints: [null, null, null, null, null, null, null, null],
		
		// unordered
		lines: [],
		points: [],
	};
	
	return point;
};

var createLine = function(){
	var line = {
		point1: createPoint(),
		point2: createPoint(),
		direction: "NA",
		findDirection: function(){
			// Determines if the line is horizontal, vertical, posDiag, or 
			// negDiag based on the x/y positions of its points
			var pt1AdjNum = -1;
			var pt2AdjNum = -1;
			// for shortness' sake
			var point1 = line.point1;
			var point2 = line.point2;
			if(point1.position.x === point2.position.x){
				// Vertical
				line.direction = "vert";
				if(point1.position.y < point2.position.y){
					// point 1 is on TOP, so its line and point are DOWN (4)
					pt1AdjNum = 4;
					pt2AdjNum = 0;
					//point1.adjLines[4] = line;
					//point1.adjPoints[4] = point2;
					//point2.adjLines[0] = line;
					//point2.adjPoints[0] = point1;
				} else {
					// point 2 is on top
					pt1AdjNum = 0;
					pt2AdjNum = 4;
				}
			} else if(point1.position.y === point2.position.y){
				// Horizontal
				line.direction = "hori"
				if(point1.position.x > point2.position.x){
					// point 1 is to the RIGHT, so its line and point are to the LEFT (6)
					pt1AdjNum = 6;
					pt2AdjNum = 2;
				} else {
					// point 2 is to the right
					pt1AdjNum = 2;
					pt2AdjNum = 6;
				}
			} else {
				// Diagonal of some form
				var top;
				var right;
				if(point1.position.y < point2.position.y) top = 1;
				else top = 2;
				if(point1.position.x > point2.position.x) right = 1;
				else right = 2;
				
				if(top === right){
					line.direction = "pDiag";
					if(top === 1){
						// point 1 is to the UP-RIGHT, so its line and point are to the down-left (5)
						pt1AdjNum = 5;
						pt2AdjNum = 1;
					} else {
						// point 2 is to the UP-RIGHT, so its line and point are to the down-left (5)
						pt1AdjNum = 1;
						pt2AdjNum = 5;
					}
				} else {
					line.direction = "nDiag";
					if(top === 1){
						// point 1 is to the UP-LEFT, so its line and point are to the down-right (3)
						pt1AdjNum = 3;
						pt2AdjNum = 7;
					} else {
						pt1AdjNum = 7;
						pt2AdjNum = 3;
					}
				}
			}
			
			// finally make the link
			// Note: the adjNums should never be -1 unless the points are on top of each other
			// Which should also never happen because we check if the points exist when making the line!
			point1.adjLines[pt1AdjNum] = line;
			point1.adjPoints[pt1AdjNum] = point2;
			point2.adjLines[pt2AdjNum] = line;
			point2.adjPoints[pt2AdjNum] = point1;
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
			return pt;
		},
		removePoint : function(x, y){
			// Can only remove a point if all lines connected to it
			// have also been removed
		},
		addLine : function(x1, y1, x2, y2){
			// does the line, or its reverse, exist?
			// TO DO: Check existing lines matching x1,y1,x2,y2 or x2,y2,x1,y1
			// ..........................................................
			
			var newLine = createLine();
			// For start and end points:
			var pt1ID = null;
			var pt2ID = null;
			for(var i = 0; i < design.points.length; i++){
				if(design.points[i].position.x === x1 && design.points[i].position.y === y1) pt1ID = i;
				if(design.points[i].position.x === x2 && design.points[i].position.y === y2) pt2ID = i;
			}
				// Does this point exist? 
				//		If so, add it to this line
			if(pt1ID !== null){
				newLine.point1 = design.points[pt1ID];
			} else {
				// 		If not, create the point and add it to the line
				newLine.point1 = design.addPoint(x1, y1);
			}
			if(pt2ID !== null){
				newLine.point2 = design.points[pt2ID];
			} else {
				newLine.point2 = design.addPoint(x2, y2);
			}
				
			// Figure out its direction and where it belongs in relation to the points
			newLine.point1.lines.push(newLine);
			newLine.point2.lines.push(newLine);
			newLine.findDirection();
			// Add line to the design
			design.lines.push(newLine);
		},
		removeLine : function() {
			// For start and end points:
				// Does this point connect to any other points?
				//		If so, disconnect the line and leave the point
				//		If not, remove the point
			// Remove line
		},
		// Design standard functions
		update: function(){
			
		},
		draw: function(){
			
		},
	};
	
	return design;
};
