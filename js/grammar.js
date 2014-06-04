/* when dealing with points, it is good to remember: 		
 * 
 *		/// Point and Line connections
		//0: null, // Up
		//1: null, // Up-right
		//2: null, // Right
		//3: null, // Down-right
		//4: null, // Down
		//5: null, // Down-left
		//6: null, // Left
		//7: null, // Up-left
		// Reflexive Pairs: 0-4, 1-5, 2-6, 3-7
*/

var rules = [];

var buildRules = function(){
	var workingName = "";
	
	// Create a line out from point
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			if (!(i === 0 && j === 0)){
				var rule = {
					name: "point_" + i + "," + j,
					xOffset: i,
					yOffset: j,
					precond: function(design, point, x, y){
						// One of these i, j pairs will always exist because we're building off an existing line
						return design.doesLineExist(point.position.x, point.position.y, point.position.x + x, point.position.y + y);
					},
					execute: function(design, point, x, y){
						//console.log("new line with offsets... " + x + ", " + y);
						design.addLine(point.position.x, point.position.y, point.position.x + x, point.position.y + y);
					}
				};
				//console.log(rule);
				rules.push(rule);
			}
		}
	}
	
	console.log(rules.length + " rules generated");
}

var randomGrammarStart = function(design, x, y){
	var i = 0;
	var j = 0;
	
	while(i === 0 && j ===0){
		i = Math.floor(Math.random() * 3) -1;
		j = Math.floor(Math.random() * 3) -1;
	}
	
	design.addLine(x, y, x + i, y + j);
}

var randomExpansion = function(design, options){
	var count = 0;
	while(count < 9999){ // 9999 is the threshold for finding a workable rule. 
		var chooseRule = Math.floor(Math.random() * rules.length);
		//console.log("chosen rule: " + chooseRule + " with name " + rules[chooseRule].name);
		//console.log(rules[chooseRule]);
		
		//var chooseLine = Math.floor(Math.random() * design.lines.length);
		var choosePoint = Math.floor(Math.random() * design.points.length);
		//console.log("chosen point: " + choosePoint + " with id " + design.points[choosePoint].id);
		//console.log(rules[chooseRule].precond);
		//console.log("checking precond: " + rules[chooseRule].precond(design, design.points[choosePoint]));
		
		if(!rules[chooseRule].precond(design, design.points[choosePoint], rules[chooseRule].xOffset, rules[chooseRule].yOffset)){
			rules[chooseRule].execute(design, design.points[choosePoint], rules[chooseRule].xOffset, rules[chooseRule].yOffset);
			return true;
		} //else {
		//	console.log("precondition failed, line likely already exists.");
		//}
		count++;
	}
};

var randomPostProduction = function(design, options){
	var postDetails = {
		greatestX: -9999,
		smallestX: 9999,
		greatestY: -9999,
		smallestY: 9999,
		width: -1,
		height:-1,
		xOffset: 0, // Math.floor(Math.random() *4) -2,
		yOffset: 0, //Math.floor(Math.random() *4) -2
	};
	
	for(var i = 0; i < design.points.length; i++){
		if(design.points[i].position.x > postDetails.greatestX) postDetails.greatestX = design.points[i].position.x;
		if(design.points[i].position.x < postDetails.smallestX) postDetails.smallestX = design.points[i].position.x;
		
		if(design.points[i].position.y > postDetails.greatestY) postDetails.greatestY = design.points[i].position.y;
		if(design.points[i].position.y < postDetails.smallestY) postDetails.smallestY = design.points[i].position.y;
	}
	
	postDetails.width = postDetails.greatestX - postDetails.smallestX;
	postDetails.height = postDetails.greatestY - postDetails.smallestY;
	
	console.log("postDetails: ");
	console.log(postDetails);
	
	var newDesignAdditions = createDesign();
	// Randomly choose: Copy, Reflect, or rotate L/R to make a horizontal manipulation
	//var firstManip = Math.floor(Math.random() * 4);
	var firstManip = 2;
	if(firstManip === 0){
		// Copy
		console.log("Copying for first manip");
		newDesignAdditions.addAllLines(design.copyLines(postDetails.width + postDetails.xOffset, 0));
	} else if (firstManip === 1){
		// Reflect
		console.log("Reflecting for first manip");
		newDesignAdditions.addAllLines(design.reflectPoints("x", postDetails.greatestX + postDetails.xOffset));
	} else if (firstManip === 2){
		// Rotate Right
		console.log("Rotating Right for first manip");
		newDesignAdditions.addAllLines(design.rotateAroundArbitraryPoint(postDetails.greatestX + postDetails.xOffset, postDetails.greatestY + postDetails.yOffset, Math.PI/2));
	} else if (firstManip ===3){
		// Rotate Left
		console.log("Rotating Left for first manip");
		// This involves a rotate and translate
	} else {
		console.log("ERROR! first manip random is off: " + firstManip);
	}
	
	// Randomly choose: Copy, Reflect, or rotate L/R to make a vertical manipulation
	//var secondManip = Math.floor(Math.random() * 4);
	var secondManip = 2;
	if(secondManip === 0){
		// Copy
		console.log("Copying for second manip");
		newDesignAdditions.addAllLines(newDesignAdditions.copyLines(0, postDetails.height + postDetails.yOffset));
		newDesignAdditions.addAllLines(design.copyLines(0, postDetails.height + postDetails.yOffset));
	} else if (secondManip === 1){
		// Reflect
		console.log("Reflecting for second manip");
		newDesignAdditions.addAllLines(newDesignAdditions.reflectPoints("y", postDetails.greatestY + postDetails.yOffset));
		newDesignAdditions.addAllLines(design.reflectPoints("y", postDetails.greatestY + postDetails.yOffset));
	} else if (secondManip === 2){
		// Rotate Right
		console.log("Rotating Right for second manip");
		newDesignAdditions.addAllLines(newDesignAdditions.rotateAroundArbitraryPoint(postDetails.greatestX + postDetails.xOffset, postDetails.greatestY + postDetails.yOffset, Math.PI));
		newDesignAdditions.addAllLines(design.rotateAroundArbitraryPoint(postDetails.greatestX + postDetails.xOffset, postDetails.greatestY + postDetails.yOffset, Math.PI));
	} else if (secondManip === 3){
		// Rotate Left // exactly same as rotating right on the second pass, ignore!
		console.log("Rotating Left for second manip");
	} else {
		console.log("ERROR! second manip random is off: " + secondManip);
	}
	
	// Find right edge
	// possibly reflect across it or copy to it
	// Find bottom edge
	// possibly reflect across it or copy to it
	// keep bottom right corner
	// possibly rotate around it 90 degrees
	// or rotate and then reflect/copy
	// use bottom-right corner to bisect diagonally and reflect across that. Repeat some other step from before to distribute
	
	return newDesignAdditions;
};
