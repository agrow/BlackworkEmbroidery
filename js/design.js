var createPosition = function(){
	var position = {
		x: 1,
		y: 1
	};
	return position;
};

var createPoint = function(){
	var point = {
		id: null,
		findID: function(){
			var id = "";
			id += point.position.x;
			id += point.position.y;
			point.id = id;
		},
		update: function(){
			point.findID();
		},
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
		
		// Scoring for grammar! 0-1 scale.
		densityScore:-1,
		balanceScore:-1,
		scorePoint: function(){
			// For every adj point/line, add 1/8
			
			// For every reflexive pair, add 1/4
		},
		
		findPointAtOtherEndOfLine: function(line){
			for(i = 0; i < point.lines.length; i++){
				if(point.lines[i].id === line.id){
					// Figure out if this point is point 1 or 2 and return the other one
					if(point.lines[i].point1.id === point.id){
						// this is point 1. Send back point 2
						return point.lines[i].point2;
					} else {
						// this is point 2. Send back point 1
						return point.lines[i].point1;
					}
				}
			}
			// This line isn't attached!
			console.log("This point " + point.id + " is not a part of line " + line.id);
			return null;
		}
	};
	
	return point;
};

var createLine = function(){
	var line = {
		id: null,
		findID: function(){
			var id = "";
			id += line.point1.position.x;
			id += line.point1.position.y;
			id += line.point2.position.x;
			id += line.point2.position.y;
			line.id = id;
		},
		update: function(){
			// Points have been changed? Re-calculate line info
			line.findDirection(); // This also finds the point orientation
			line.findID();
		},
		point1: createPoint(),
		point2: createPoint(),
		direction: "NA",
		topOrRightPoint: null,
		bottomOrLeftPoint: null,
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
				line.direction = "hori";
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
			
			line.findPointOrientation(1, pt1AdjNum);
		},
		
		// NOTE: currently only uses point === 1 because it would be redundant copy-paste code to do it for point === 2.
		// If you ever plan to use it for point === 2, make that part of the function!
		findPointOrientation: function(point, adjNum){
			//console.log("Checking point orientation: " + point + ", " + adjNum);
			// Upper/right half of the map
			if(point === 1){
				if(adjNum === 7 || adjNum === 0 || adjNum === 1 || adjNum === 2){
					// Point 1 is dominant	
					line.topOrRightPoint = line.point1;
					line.bottomOrLeftPoint = line.point2;
					//console.log("point1 dominant");
				} else {
					// point 2 is dominant
					line.topOrRightPoint = line.point2;
					line.bottomOrLeftPoint = line.point1;
					//console.log("point2 dominant");
				}
			}  else {
				console.log("ERRROR: Don't call findPointOrientation with point !== 1 until you implement this part");
			}
			 
		},
	};
	
	return line;
};

var createDesign = function(){
	var design = {
		absoluteRoot: createPosition(),
		width: 10,
		height: 10,
		greatestX: -9999, 
		smallestX: 9999, 
		greatestY: -9999,
		smallestY: 9999,
		
		resetDimensionMarkers : function(){
			design.greatestX= -9999;
			design.smallestX= 9999;
			design.greatestY= -9999;
			design.smallestY= 9999;
		},
		updateDimensions : function(){
			design.resetDimensionMarkers();
			for(var i = 0; i < design.points.length; i++){
				if(design.points[i].position.x > design.greatestX) design.greatestX = design.points[i].position.x;
				if(design.points[i].position.x < design.smallestX) design.smallestX = design.points[i].position.x;
				
				if(design.points[i].position.y > design.greatestY) design.greatestY = design.points[i].position.y;
				if(design.points[i].position.y < design.smallestY) design.smallestY = design.points[i].position.y;
			}
			
			design.width = design.greatestX - design.smallestX;
			design.height = design.greatestY - design.smallestY;
			
			if(design.width === 0) design.width = 1;
			if(design.height === 0) design.height = 1;
			
			console.log("design dimentions: " + design.smallestX + ", " + design.smallestY + " /// " +
											  + design.greatestX + ", " + design.greatestY + " /// " +
												design.width + " by " + design.height);
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
		
		doesLineExist : function(x1, y1, x2, y2){
			//var matchedPt1 = false;
			//var matchedPt2 = false;
			var lineString1 = "" + x1 + y1 + x2 + y2;
			var lineString2 = "" + x2 + y2 + x1 + y1;
			//console.log("checking lines " + lineString1 + " and " + lineString2);
			for (var i = 0; i < design.lines.length; i++){
				// NOTE: Checking the id, because it is faster and easier to code
				// If at all this fails, check that the IDs are properly being set/created
				if(design.lines[i].id === lineString1 || design.lines[i].id === lineString2){
					return true;
				}
			}
			
			return false;
		},
		lastAddedLine : null,
		addLine : function(x1, y1, x2, y2){
			// does the line, or its reverse, exist?
			// Check existing lines matching x1,y1,x2,y2 or x2,y2,x1,y1
			var lineExist = design.doesLineExist(x1, y1, x2, y2);
			//console.log("Does this line exist? " + lineExist);
			// ..........................................................
			// Also check: Do we have the same start and end point? That's not a line!
			if(!lineExist && !(x1 === x2 && y1 === y2)){
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
				newLine.point1.update();
				newLine.point2.update();
				newLine.update();
				// Add line to the design
				design.lines.push(newLine);
				design.lastAddedLine = newLine;
				return true;
			} else {
				console.log("NOPE! Not making that " + x1 + y1 + x2 + y2 + " line. It already exists.");
				return false;
			}
		},
		
		addAllLines : function(newLines){
			console.log("adding " + newLines.length + " new lines to the design");
			for(var i = 0; i < newLines.length; i++){
				design.addLine(newLines[i].point1.position.x, newLines[i].point1.position.y, 
							   newLines[i].point2.position.x, newLines[i].point2.position.y);
			}
		},
		removeLine : function() {
			// For start and end points:
				// Does this point connect to any other points?
				//		If so, disconnect the line and leave the point
				//		If not, remove the point
			// Remove line
		},
		
		reflectPoints: function(direction, value) {
			var newLines = [];
			
			if(direction === "x"){
				// Looks like |
				// Expected: value of x=? line to be reflected upon
				for(var i = 0; i < design.lines.length; i++){
					var dist1 = value - design.lines[i].point1.position.x;
					var dist2 = value - design.lines[i].point2.position.x;
					//console.log("dist 1/2: " + dist1 + ", " + dist2);
					var line = createLine();
					line.point1 = createPoint();
					line.point1.position.x = design.lines[i].point1.position.x + (dist1*2);
					line.point1.position.y = design.lines[i].point1.position.y;
					line.point2 = createPoint();
					line.point2.position.x = design.lines[i].point2.position.x + (dist2*2);
					line.point2.position.y = design.lines[i].point2.position.y;
					newLines.push(line);
				}
			} else if (direction === "y"){
				// Looks like -
				// Expected: value of y=? line to be reflected upon
				for(var i = 0; i < design.lines.length; i++){
					var dist1 = value - design.lines[i].point1.position.y;
					var dist2 = value - design.lines[i].point2.position.y;
					console.log("ydist 1/2: " + dist1 + ", " + dist2);
					var line = createLine();
					line.point1 = createPoint();
					line.point1.position.x = design.lines[i].point1.position.x;
					line.point1.position.y = design.lines[i].point1.position.y + (dist1*2);
					line.point2 = createPoint();
					line.point2.position.x = design.lines[i].point2.position.x;
					line.point2.position.y = design.lines[i].point2.position.y + (dist2*2);
					newLines.push(line);
				}
			} else if (direction === "pDiag"){
				// IE looks like /
			} else if (direction === "nDiag"){
				// IE looks like \
			} else {
				console.log("invalid direction: use 'x' 'y' 'pDiag' or 'nDiag'");
			}
			
			return newLines;
		},
		
		reflectArbitraryLines: function(a, c, x){
			var newLines = [];
			// For arbitrary line y = ax+c
			// for horizontal line y=? a = 0, c = the offset
			// for x=?, a and c are null and you use the x value instead.
			
			if(a === null && c === null){
				// Looks like |
				// Expected: value of x=? line to be reflected upon
				for(var i = 0; i < design.lines.length; i++){
					var dist1 = x - design.lines[i].point1.position.x;
					var dist2 = x - design.lines[i].point2.position.x;
					//console.log("dist 1/2: " + dist1 + ", " + dist2);
					var line = createLine();
					line.point1 = createPoint();
					line.point1.position.x = design.lines[i].point1.position.x + (dist1*2);
					line.point1.position.y = design.lines[i].point1.position.y;
					line.point2 = createPoint();
					line.point2.position.x = design.lines[i].point2.position.x + (dist2*2);
					line.point2.position.y = design.lines[i].point2.position.y;
					newLines.push(line);
				}
			} else {
				for(var i = 0; i < design.lines.length; i++){
					// (x + (y - c) * a)/(1+ (a*a))
					var dist1 = (design.lines[i].point1.position.x + (design.lines[i].point1.position.y - c) * a) / (1 + (a * a));
					var dist2 = (design.lines[i].point2.position.x + (design.lines[i].point2.position.y - c) * a) / (1 + (a * a));
					console.log("dist 1/2: " + dist1 + ", " + dist2);
					var line = createLine();
					line.point1 = createPoint();
					line.point1.position.x = 2*dist1 - design.lines[i].point1.position.x;
					line.point1.position.y = 2*dist1*a - design.lines[i].point1.position.y + 2 * c;
					line.point2 = createPoint();
					line.point2.position.x = 2*dist2 - design.lines[i].point2.position.x;
					line.point2.position.y = 2*dist2*a - design.lines[i].point2.position.y + 2 * c;
					newLines.push(line);
				}
			}
			
			return newLines;
		},
		roundNumber : function(num){
			if(num !== Math.floor(num) || num !== Math.ceil(num)){
				console.log("rounding num " + num);
				// Round the number
				if(num > Math.floor(num) + .5) return Math.ceil(num);
				else return Math.floor(num);
			}
			return num;
		},
		rotateAroundArbitraryPoint: function(cx, cy, angle){
			var newLines = [];
			
			for(var i = 0; i < design.lines.length; i++){
				
				var line = createLine();
				line.point1 = createPoint();
				line.point2 = createPoint();
				
				var s = Math.sin(angle);
				var c = Math.cos(angle);
				
				// translate to origin
				line.point1.position.x = design.lines[i].point1.position.x - cx;
				line.point1.position.y = design.lines[i].point1.position.y - cy;
				line.point2.position.x = design.lines[i].point2.position.x - cx;
				line.point2.position.y = design.lines[i].point2.position.y - cy;
				
				// rotate point
				var xnew1 = line.point1.position.x * c - line.point1.position.y * s;
				var ynew1 = line.point1.position.x * s + line.point1.position.y * c;
				var xnew2 = line.point2.position.x * c - line.point2.position.y * s;
				var ynew2 = line.point2.position.x * s + line.point2.position.y * c;
				
				// traslate point back
				line.point1.position.x = design.roundNumber(xnew1 + cx);
				line.point1.position.y = design.roundNumber(ynew1 + cy);
				line.point2.position.x = design.roundNumber(xnew2 + cx);
				line.point2.position.y = design.roundNumber(ynew2 + cy);

				newLines.push(line);
				
			}
			
			console.log("new rotation lines...");
			console.log(newLines);
			return newLines;
		},
		
		copyLines: function(xOffset, yOffset){
			var newLines = [];
			
			for(var i = 0; i < design.lines.length; i++){
				var line = createLine();
				line.point1.position.x = design.lines[i].point1.position.x + xOffset;
				line.point1.position.y = design.lines[i].point1.position.y + yOffset;
				
				line.point2.position.x = design.lines[i].point2.position.x + xOffset;
				line.point2.position.y = design.lines[i].point2.position.y + yOffset;
				
				newLines.push(line);
			}
			
			console.log("new copied lines...");
			console.log(newLines);
			return newLines;
		},
		
		translateTheseLines: function(xOffset, yOffset){
			for(var i = 0; i < design.points.length; i++){
				design.points[i].position.x += xOffset;
				design.points[i].position.y += yOffset;
				
				design.points[i].update();
			}
			
			for(var j = 0; j < design.lines.length; j++){
				design.lines[j].update();
			}
		},
		
		findMST: function(){
			var edges = [];
			var components = [];
			var activeComponent = [];
			//var components = new Array(design.points.length);
			for (var i = 0; i < design.points.length; i++){
				//components[i]= new Array();
				//components[i].add(design.points[i]);
				
				// reset a flag that determines if we've visited
				design.points[i].addedToComponent = i;
			}
			// Should be an array of arrays each with 1 point
			//console.log("MST components: " + components);
			
			for (var i = 0; i < design.lines.length; i++){
				// For each line, if the end points have not been in a component...
				if(design.lines[i].point1.addedToComponent !== design.lines[i].point2.addedToComponent){
					//arbitrarily choose one component to merge into the other
					var componentToKill = design.lines[i].point1.addedToComponent;
					var componentToSave = design.lines[i].point2.addedToComponent;
					// Go through all edges to merge into the saved component
					for(var j = 0; j < design.lines.length; j++){
						if(design.lines[j].point1.addedToComponent === componentToKill) design.lines[j].point1.addedToComponent = componentToSave;
						if(design.lines[j].point2.addedToComponent === componentToKill) design.lines[j].point2.addedToComponent = componentToSave;
					}
					
					// Even though the component to kill now should be completely killed, just be safe
					design.lines[i].point1.addedToComponent = componentToSave;
					//////////////////////////////////////////////////////
					// BUUUG BUG BUG BUGBUGBUG ***************************
					// Does not connect components depending on the order that they are added
					// If two edges get added to two different components, they are flagged as true and not connected
					// Fix: track which components the points are a part of?
					
					// and add the edge to the edges list
					edges.push(design.lines[i]);
				}
			}
			
			design.currentMST = edges;
			return edges;
		}
	};
	
	return design;
};
