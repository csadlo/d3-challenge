
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")

// Read the data
d3.csv("assets/data/data.csv").then(function(inputData, err) {

    if (err) throw err;
    console.log(inputData);

    console.log(inputData);
    console.log([inputData]);

    // Format the data
    inputData.forEach(function(data) {
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    // Create scaling functions
    var xLinearScale = d3.scaleLinear()
        //.domain([0, 4000])
        .domain([0.9 * d3.min(inputData, d => d.poverty), d3.max(inputData, d => d.poverty) * 1.1])
        .range([0, width]);

    // Add Y axis
    var yLinearScale1 = d3.scaleLinear()
        //.domain([0, 50000])
        .domain([0.9 * d3.min(inputData, d => d.obesity), d3.max(inputData, d => d.obesity) * 1.1])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale)
    var leftAxis = d3.axisLeft(yLinearScale1);

    // Add x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(bottomAxis);

    // Add y-axis
    svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(leftAxis);

    // // Add circles
    var circlesGroup = svg.selectAll("circle")
        .data(inputData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale1(d.obesity))
        .attr("r", "15")
        .attr("fill", "#69b3a2")
        .attr("opacity", "0.75")
        .attr("stroke-width", "1")
        .attr("stroke", "darkgreen");


    // Add the state abbreviations
    var textLabelsGroup = svg.selectAll(null)
    svg.append('g')
        .selectAll(null)
        .data(inputData)
        .enter()
        .append("text")
        .attr("x", function (d) { return (xLinearScale(d.poverty)) - 10; } )
        .attr("y", function (d) { return (yLinearScale1(d.obesity)) + 6; } )
        .text(d => d.abbr)
        .style("fill", "black")


    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Poverty ${d.poverty}%<br>Obesity ${d.obesity}%`);
        });

    // Step 2: Create the tooltip in chartGroup.
    svg.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });

    // Step 3: Create "mouseover" event listener to display tooltip
    textLabelsGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
            toolTip.hide(d);
        });

    
    // Create axes labels
    var xAxisLabel = svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Poverty (%)");
    
    var yAxisLabel = svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - ((height + margin.top + 30) / 2))
        .attr("y", 0 - margin.left + 40)
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity (%)");


}).catch(function(error) {
    console.log(error);
});

