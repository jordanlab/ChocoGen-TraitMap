// Retrieve population information; UNUSED FUNCTION
function getPopulation(d) {
	var pop = d.properties ? d.properties.POPULATION : null;
	return pop/100;
}

// Color only the provinces in CSV file (Choco, Antioquia)
function colorProv(d) {
	// Color provinces based on population; UNUSED
	// return color(getPopulation(d));
	if (d.properties.NOMBRE_DPT == "ANTIOQUIA") {
		return "#6ABD45";
	} else if (d.properties.NOMBRE_DPT == "CHOCO") {
		return "#8251A1";
	} else {
		return "#686868";
	}
}
// Display pie charts for Choco and Antioquia
function displayPie(d) {

	d3.selectAll('.pies').remove();
	var input = {antio:[d['clm_maj'], d['clm_min']], choco:[d['cho_maj'], d['cho_min']]};

	var color = ["#F7D912","#196AC7"]
	var prov_color = ["#6ABD45","#8251A1"]

	d3.csv("/provinceColombia.csv").then(function(locData) {
		// // Remove column headers from CSV data to avoid encountering it during iteration
		locData = locData.slice(0);
		
		if (typeof input != "undefined") {
			for (var entry in locData) {
				// console.log(input)
				var key = Object.keys(input)[0];
				// console.log(entry)
				var value = input[Object.keys(input)[0]];

				// Append pie chart data to CSV data and
				// remove additional pie chart data after it is added to CSV data
				locData[entry]["data"] = value;
				delete input[key];
			}

			var pts = gPie.selectAll("g")
				.data(locData)
				.enter()
				.append("g")
				// Position the pie chart according to province coordinates
				.attr("transform", function(e) {
					if (e.prov == "Antioquia") {
						return "translate("+projection([parseInt(e.lon,10)+2,parseInt(e.lat,10)+3.35])+")";
					} else {
						return "translate("+projection([parseInt(e.lon,10)-2.75,parseInt(e.lat,10)-0.5])+")";
					}
				})
				.attr("class", "pies");

			pts.append("rect")
				.attr("class", "tip-rect")
				.attr("width", 225)
				.attr("height", 125)
				.attr("x", -115)
				.attr("y", radius*-3.5)
				.attr("rx", 15)
				.attr("ry", 15)
				.style("fill",  function(e,i) {
					return prov_color[i];
				})

			// pts.append("polygon") // Triangle for chat-bubble type of look
			// 	.attr("points", "0, 0, 0,-50, 50,-50")
			// 	.attr("transform", "translate(5,-60)")
			// 	.style("fill",  function(e,i) {
			// 		return prov_color[i];
			// 	})

			pts.append("text")
				.attr("class", "tip-title")
				.attr("y", -radius-100)
				.style("font-size", "33px")
				.text(function(e) {return e.prov})
				.style("text-anchor", "middle")
				.style("fill", "white")
				.style("stroke-width",2)

			pts.append("text")
				.attr("class", "tip-content")
				.attr("y", -radius-45)
				.text(function(e) {
					return "EAF: "+(parseInt(e.data[1])/(parseInt(e.data[0])+parseInt(e.data[1]))).toFixed(2)
				})
				.style("fill", "white")
				.style("font-size", "33px")
				.style("text-anchor", "middle")

			// Display description
			// pts.append("text")
			// 	.attr("class", function(e) {
			// 		if (e.prov == "Antioquia") {
			// 			return "talk-bubble";
			// 		} else {
			// 			return "talk-bubble";
			// 		}
			// 	})
			// 	.attr("x", 1)
			// 	.attr("y", radius*-1.5)
			// 	.text(function(e) {return e.prov})
			// 	.style("text-anchor", "middle");

			var pies = pts.selectAll(".pies")
				.data(function(e) { return pie(e.data); })
				.enter()
				.append("g")
				.attr("class","arc");

			pies.append("path")
				.attr("d",arc)
				.attr("stroke", "white")
				.attr("stroke-width", 2)
				.attr("fill", function(e,i) {
					return color[i];
				})
		}
	});
}

// $("#rsid").on('awesomplete-selectcomplete',function(){

// 	// Remove existing pie charts once rsID is updated
// 	d3.selectAll("g.pies").remove();

// 	selectedId = this.value;
// 	d = genData[selectedId];
	
// 	choRefNum = 2 * d['choREF'] + d['choHET'];
// 	choAltNum = 2 * d['choALT'] + d['choHET'];
// 	antRefNum = 2 * d['clmREF'] + d['clmHET'];
// 	antAltNum = 2 * d['clmALT'] + d['clmHET'];

// 	// Make sure data being sent is alphabetically organized to be consistent with
// 	// province CSV data. Refer below for compatible input:
// 	// e.g. input = {antio:[20,30], choco:[30,20]};

// 	var pieData = {antio:[antRefNum, antAltNum], choco:[choRefNum, choAltNum]};
// 	displayPie(pieData);
// });
// displayPie()


// redraw()
