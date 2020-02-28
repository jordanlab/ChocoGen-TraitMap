function getQuantiles(array, province) {
  var sorted = array.sort(d3.ascending)
  var q1 = d3.quantile(sorted, 0.25)*100
  var median = d3.quantile(sorted, 0.5)*100
  var q3 = d3.quantile(sorted, 0.75)*100
  var iqr = (q3 - q1)*100
  var min = d3.min(sorted)*100
  var max = d3.max(sorted)*100

  var points = []
  for (var a of sorted) {
    points.push({prs:a*100, prov:province})
  }
  // console.log({q1:q1, median:median, q3:q3, iqr:iqr, min:min, max:max})
  return {q1:q1, median:median, q3:q3, iqr:iqr, min:min, max:max, points:points}
}

function displayBoxPlot(cho_scores, clm_scores) {
  var color = ["#8251A1","#6ABD45"];
  var box_width = 275;
  var jitter = 275;
  var box_x = 110;

  // var y_axis = d3.scaleLinear()
  // .domain([0,100])
  // .range([height+100, 0])

  console.log("In displayBoxPlot")
  var cho_stats = getQuantiles(cho_scores, 'CHO')
  var clm_stats = getQuantiles(clm_scores, 'CLM')

  var input = [{key: "CHO", value:cho_stats}, {key:"CLM", value:clm_stats}]

  // Adjust the y axis according to the values
  var min_y =d3.min([input[0].value['min'], input[1].value['min']])-5
  var max_y =d3.max([input[0].value['max'], input[1].value['max']])+5
  y_axis = d3.scaleLinear()
    .domain([min_y,max_y])
    .range([height-250, 0])
  svgBox.selectAll(".y-axis").call(d3.axisLeft(y_axis))

  svgBox.selectAll("vertLines")
    .data(input)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x_axis(d.key))})
      .attr("x2", function(d){return(x_axis(d.key))})
      .attr("y1", function(d){return(y_axis(d.value.min))})
      .attr("y2", function(d){return(y_axis(d.value.max))})
      .attr("stroke", "black")
      .attr("stroke-width",2)
      .style("width", 50)
      .attr("transform", "translate("+box_x+",0)");

  svgBox.selectAll("boxes") // This box is to cover the vertical lines created above
      .data(input)
      .enter()
      .append("rect")
      .attr("x", function(d){return(x_axis(d.key)-box_width/2)})
      .attr("y", function(d){return(y_axis(d.value.q3))})
      .attr("height", function(d){return(y_axis(d.value.q1)-y_axis(d.value.q3))})
      .attr("width", box_width)
      .attr("stroke", "black")
      .attr("stroke-width",2)
      .style("fill", "#FFFFFF")
      .attr("transform", "translate("+box_x+",0)");

  if (input.length < 2) {
    points_data = input[0].value.points;
  } else {
    points_data = input[0].value.points.concat(input[1].value.points); 
  }
  
  svgBox.selectAll("points")
      .data(points_data)
      .enter()
      .append("circle")
      .attr("cx", function(d){return(x_axis(d.prov) - jitter/2 + Math.random()*jitter)})
      .attr("cy", function(d){return(y_axis(d.prs))})
      .attr("r", 10)
      .style("fill", function(d) {
        if (d.prov == "CHO") {
          return color[0];
        } else {
          return color[1];
        }
      })
      .attr("stroke", "black")
      .attr("stroke-width",2.5)
      .attr("transform", "translate("+box_x+",0)");

  svgBox.selectAll("boxes")
      .data(input)
      .enter()
      .append("rect")
      .attr("x", function(d){return(x_axis(d.key)-box_width/2)})
      .attr("y", function(d){return(y_axis(d.value.q3))})
      .attr("height", function(d){return(y_axis(d.value.q1)-y_axis(d.value.q3))})
      .attr("width", box_width)
      .attr("stroke", "black")
      .attr("stroke-width",2)
      .style("fill", "#FFFFFF")
      .attr("fill-opacity", 0.5)
      .attr("transform", "translate("+box_x+",0)");

  svgBox.selectAll("medianLines")
      .data(input)
      .enter()
      .append("line")
      .attr("x1", function(d){return(x_axis(d.key)-box_width/2)})
      .attr("x2", function(d){return(x_axis(d.key)+box_width/2)})
      .attr("y1", function(d){return(y_axis(d.value.median))})
      .attr("y2", function(d){return(y_axis(d.value.median))})
      .attr("stroke", "black")
      .attr("stroke-width",2)
      .style("width", 200)
      .attr("transform", "translate("+box_x+",0)");

  svgBox.selectAll("tip-score")
      .data(input)
      .enter()
      .append("rect")
      .attr("class", "tip-score")
      .attr("width", 225)
      .attr("height", 125)
      .attr("x", function(d,i){
        if (d.key == "CHO") {
          return 165
        } else {
          return 475
        }
      })
      .attr("y", -135)
      .attr("rx", 15)
      .attr("ry", 15)
      .style("fill", function(d,i) {
        return color[i]
      })

  svgBox.selectAll("tip-score-title")
      .data(input)
      .enter()
      .append("text")
      .attr("x", function(d,i){
        if (d.key == "CHO") {
          return 275
        } else {
          return 585
        }
      })
      .attr("y", -85)
      .style("font-size", "33px")
      .text(function(d) {
        if (d.key == "CHO") {
          return "Chocó"
        } else {
          return "Antioquia"
        }
      })
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("stroke-width",2)

  svgBox.selectAll("tip-score")
      .data(input)
      .enter()
      .append("text")
      .attr("x", function(d,i){
        if (d.key == "CHO") {
          return 275
        } else {
          return 585
        }
      })
      .attr("y", -33)
      .style("font-size", "33px")
      .text(function(d) {return "PRS = " + d.value.median.toFixed(1)})
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("stroke-width",2)

}