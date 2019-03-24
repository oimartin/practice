
// Create function to make the scatter plot
// responsive to the size of the browser windoww
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;


  // Define the chart's margins as an object
  var margin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 50
  };

  // chart area minus margins
  var chartHeight = svgHeight - margin.top - margin.bottom;
  var chartWidth = svgWidth - margin.left - margin.right;

  // create svg container
  var svg = d3.select("#scatter").append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // state and income
  d3.csv("assets/data/data.csv").then(function(healthData) {

    // Make sure each data point for income and obesity
    // data is casted as an integer
      healthData.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
      });

      // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
      var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=> d.income) - 1000, d3.max(healthData, d => d.income) + 2000])
      .range([0, chartWidth]);

      // Create a linear scale for the vertical axis.
      var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.obesity) - 3, d3.max(healthData, d => d.obesity) + 2])
      .range([chartHeight, 0]);
      
      // Create functions to pass x & y scales in as arguments
      // These will be used to create the chart's axes
      // Limit the number of ticks on each axis
      var bottomAxis = d3.axisBottom(xLinearScale).ticks(20);
      var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

      // Append two SVG group elements to the chartGroup area,
      // and create the bottom and left axes inside of them
      chartGroup.append("g")
      .call(leftAxis);

      chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis)
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-35)");

      // Append circles or data points to chartGroup
      chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.income))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");

      // Append y axis title
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity Rates");

      // Append x axis title
        chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Avg Income (per state)");
  })
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);