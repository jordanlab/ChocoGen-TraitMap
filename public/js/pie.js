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

	var locData = [{"prov" : "Antioquia", "lon" : "-75.5", "lat" : "6.7"}, {"prov" : "Chocó", "lon" : "-77", "lat" : "6"}]

	if (typeof input != "undefined") {
		for (var entry in locData) {
			var key = Object.keys(input)[0];
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
}