//set up global absolute variables
// first the size and margins
var bar_margin = {top: 20, right: 20, bottom: 30, left: 40},
	    bar_width = 600 - bar_margin.left - bar_margin.right,
	    bar_height = 400 - bar_margin.top - bar_margin.bottom;

// set the ranges
var xScale = d3.scaleBand()
          .range([0, bar_width])
          .padding(0.1);
var yScale = d3.scaleLinear()
          .range([bar_height, 0]);

//set the colour scale
var color = d3.scaleOrdinal(d3.schemeCategory20);

var svg;

function setup_bar(){

	// append the svg object to the #bar div
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	svg = d3.select("#bar").append("svg")
		.attr("id", "bar_svg")
	    .attr("width", bar_width + bar_margin.left + bar_margin.right)
	    .attr("height", bar_height + bar_margin.top + bar_margin.bottom)
	  .append("g")
	    .attr("transform", 
	          "translate(" + bar_margin.left + "," + bar_margin.top + ")");

	// add the x Axis
	svg.append("g")
		.attr("class", "xAxis")
	    .attr("transform", "translate(0," + bar_height + ")")
	    .call(d3.axisBottom(xScale));
	// add the y Axis
	svg.append("g")
		.attr("class", "yAxis")
	    .call(d3.axisLeft(yScale));

	svg.append("text")
	    .attr("class", "y label")
	    .attr("id", "c_bar_label")
	    .attr("text-anchor", "end")
	    .attr("y", 6)
	    .attr("dy", ".75em")
	    .attr("transform", "rotate(-90)")
	    .text("");  

	update_bar();

}

//here's the update function
function update_bar(){
	//read the data
	//console.log('updating the bar chart')

	var bar_data = [];

	var m = $('#methodChoice').val() - 1;

	for (i=0; i < bound_data.results.length; i++){
		this_bar = {
			value: bound_data.results[i].scores[m],
			label: bound_data.results[i].ps_name,
		};
		bar_data.push(this_bar);
	}

	// Scale the range of the data in the domains
	xScale.domain(bar_data.map(function(d) { return d.label; }));
	//yScale.domain([0, d3.max(bar_data, function(d) { return d.value; })]);
	yScale.domain([Math.min(0, d3.min(bar_data, function(d) { return d.value; })), Math.max(0, d3.max(bar_data, function(d) { return d.value; }))]).nice();

	// append the rectangles for the bar chart
	var bars = svg.selectAll(".bar")
		.data(bar_data);

	bars.exit().remove();

	bars.enter().append("rect")
	    .attr("class", "bar")
	    .attr("fill", function(d){return color(d.label);})
	    .attr("x", function(d) { return xScale(d.label); })
	    .attr("width", xScale.bandwidth())
	    .attr("y", function(d) { return yScale(Math.max(0, d.value)); })
	    .attr("height", function(d) { return Math.abs(yScale(d.value) - yScale(0)); })
	    //.attr("height", function(d) { return bar_height - yScale(d.value); })

	    .merge(bars).transition()
		  .attr("x", function(d) { return xScale(d.label); })
	      .attr("width", xScale.bandwidth())
	      .attr("y", function(d) { return yScale(Math.max(0, d.value)); })
	      .attr("height", function(d) { return Math.abs(yScale(d.value) - yScale(0)); })
	      //.attr("y", function(d) { return yScale(d.value); })
	      //.attr("height", function(d) { return bar_height - yScale(d.value); });


	svg.select('.xAxis')
		//.attr("transform", "translate(0," + yScale(0) + ")")
		.call(d3.axisBottom(xScale));
		

	svg.select('.yAxis')
		.call(d3.axisLeft(yScale));

	if(yScale.domain()[0] != 0){
		svg.append("g")
	       .attr("transform", "translate(0, "+ (yScale(0) + 0.25) +")")
	       .attr("class", "zeroline")
	       .append("line")
	       .attr("x2", xScale.range()[1])
	       .style("stroke", "black")
	       .style("stroke-width", ".5px")
	}

	svg.select('#c_bar_label')
		.text(bound_data.results[0].units[m]);

}

$(document).ready(function(){
	 $('#bar_export_button').click(function(){
    export_StyledSVG('bar_svg', 'bar.png', bar_height + bar_margin.top + bar_margin.bottom , bar_width + bar_margin.left + bar_margin.right);
  });
})