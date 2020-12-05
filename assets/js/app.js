// @TODO: YOUR CODE HERE!

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

// // //Read the data
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
        .domain([0.9 * d3.min(inputData, d=> d.poverty), d3.max(inputData, d => d.poverty) * 1.1])
        .range([0, width]);

    // Add Y axis
    var yLinearScale1 = d3.scaleLinear()
        //.domain([0, 50000])
        .domain([d3.min(inputData, d=> d.poverty), d3.max(inputData, d => d.obesity) * 1.1])
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

    // Add circles
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
    //var textLabelsGroup = svg.selectAll(null)
    svg.append('g')
        .selectAll("dot")
        .data(inputData)
        .enter()
        .append("text")
        .attr("x", function (d) { return (xLinearScale(d.poverty)) - 10; } )
        .attr("y", function (d) { return (yLinearScale1(d.obesity)) + 5; } )
        .text(d => d.abbr)
        .style("fill", "black")


// //     // // new X axis
// //     // x.domain([0, 4000])
// //     // svg.select(".myXaxis")
// //     //     .transition()
// //     //     .duration(2000)
// //     //     .attr("opacity", "1")
// //     //     .call(d3.axisBottom(x));

// //     // svg.selectAll("circle")
// //     //     .transition()
// //     //     .delay(function(d,i){return(i*3)})
// //     //     .duration(2000)
// //     //     .attr("cx", function (d) { return x(d.GrLivArea); } )
// //     //     .attr("cy", function (d) { return y(d.SalePrice); } )
}).catch(function(error) {
    console.log(error);
});


//});
