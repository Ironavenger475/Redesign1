const tooltip = d3.select("#tooltip");
// function drawHeatmap(matrix, labels) {
//     const svg = d3.select("#heatmap").html("").attr("width", 500).attr("height", 500);
//     const cellSize = 20; 

//     const colorScale = d3.scaleLinear()
//         .domain([0, 1])
//         .range(["white", "blue"]);

//     svg.selectAll("rect")
//         .data(matrix.flat())
//         .enter().append("rect")
//         .attr("x", (d, i) => (i % labels.length) * cellSize)
//         .attr("y", (d, i) => Math.floor(i / labels.length) * cellSize)
//         .attr("width", cellSize)
//         .attr("height", cellSize)
//         .attr("fill", d => colorScale(d));

//     // Add labels
//     svg.selectAll("text")
//         .data(labels)
//         .enter().append("text")
//         .attr("x", (d, i) => i * cellSize + 5)
//         .attr("y", labels.length * cellSize + 15)
//         .text(d => d)
//         .attr("font-size", "10px");

//     svg.selectAll(".y-label")
//         .data(labels)
//         .enter().append("text")
//         .attr("x", -5)
//         .attr("y", (d, i) => i * cellSize + 15)
//         .text(d => d)
//         .attr("font-size", "10px")
//         .attr("text-anchor", "end");
// }

function drawScatterplot(filteredData, title, Attribute1, Attribute2) {
    const svg = d3.select("#scatterplot").html("").attr("width", 400).attr("height", 400);
    const validData = filteredData.filter(d => d.x !== -1 && d.y !== -1 && !isNaN(d.x) && !isNaN(d.y));
    const xScale = d3.scaleLinear()
        .domain([d3.min(validData, d => d.x), d3.max(validData, d => d.x)])
        .range([60, 360]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(validData, d => d.y), d3.max(validData, d => d.y)])
        .range([360, 40]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", "translate(0, 360)")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(yAxis);

    svg.selectAll("circle")
        .data(validData)
        .enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .attr("fill", "#e35424")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<b>County:${d.display_name}</b><br><strong>${Attribute1}: </strong>${d.x}<br><strong>${Attribute2}: </strong>${d.y}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    // Title for scatter plot
    svg.append("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);

        svg.append("text")
        .attr("x", 200)
        .attr("y", 380)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(Attribute1);  // Replace with actual attribute name
    
    // Add y-axis label
    svg.append("text")
        .attr("x", -200)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("transform", "rotate(-90)") // Rotate to align with the y-axis
        .text(Attribute2);

    // Info Icon (Top Right)
    svg.append("text")
        .attr("x", 370)
        .attr("y", 20)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("cursor", "pointer")
        .text("ℹ️")
        .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html("This chart compares the two attributes selected and shows them on a scatterplot ")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });
}

function drawBarGraph1(data, title,Attribute1) {
    const width = 400, height = 400;
    const svg = d3.select("#bargraph1").html("")
        .attr("width", width)
        .attr("height", height);

    // Sort data in ascending order
    data.sort((a, b) => a.x - b.x);

    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([40, 360])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x)])
        .range([360, 40]);

    const yAxis = d3.axisLeft(yScale);

    const g = svg.append("g");

    g.append("g")
        .attr("transform", "translate(40, 0)")
        .call(yAxis);

    g.append("line")
        .attr("x1", 40)
        .attr("x2", 360)
        .attr("y1", 360)
        .attr("y2", 360)
        .attr("stroke", "black");

    g.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d.x))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 360 - yScale(d.x))
        .attr("fill", "#8d6cc2")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<strong>County: </strong>${d.display_name}<br><strong>Value: </strong>${d.x}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    g.append("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
    
    // Add x-axis label
svg.append("text")
.attr("x", 200)
.attr("y", 380)
.attr("text-anchor", "middle")
.style("font-size", "14px")
.text("Counties");  // Replace with actual attribute name

// Add y-axis label
svg.append("text")
.attr("x", -200)
.attr("y", 20)
.attr("text-anchor", "middle")
.style("font-size", "14px")
.attr("transform", "rotate(-90)") // Rotate to align with the y-axis
.text(Attribute1);  // Replace with actual attribute name
    
        svg.append("text")
        .attr("x", 370)
        .attr("y", 20)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("cursor", "pointer")
        .text("ℹ️")
        .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html("This bargraph shows the values of the selected attribute for each county and shows them in an ascending order to show the slow rise over the counties")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });
}

function drawBarGraph2(data, title, Attribute2) {
    const width = 400, height = 400;
    const svg = d3.select("#bargraph2").html("")
        .attr("width", width)
        .attr("height", height);

    // Sort data in ascending order
    data.sort((a, b) => a.y - b.y);

    const xScale = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([40, 360])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y)])
        .range([360, 40]);

    const yAxis = d3.axisLeft(yScale);

    const g = svg.append("g");

    g.append("g")
        .attr("transform", "translate(40, 0)")
        .call(yAxis);

    g.append("line")
        .attr("x1", 40)
        .attr("x2", 360)
        .attr("y1", 360)
        .attr("y2", 360)
        .attr("stroke", "black");

    g.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d.y))
        .attr("width", xScale.bandwidth())
        .attr("height", d => 360 - yScale(d.y))
        .attr("fill", "#a1c26c")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<strong>County: </strong>${d.display_name}<br><strong>Value: </strong>${d.y}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    g.append("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);
        // Add x-axis label
svg.append("text")
.attr("x", 200)
.attr("y", 380)
.attr("text-anchor", "middle")
.style("font-size", "14px")
.text("Counties");  // Replace with actual attribute name

// Add y-axis label
svg.append("text")
.attr("x", -200)
.attr("y", 20)
.attr("text-anchor", "middle")
.style("font-size", "14px")
.attr("transform", "rotate(-90)") // Rotate to align with the y-axis
.text(Attribute2);  // Replace with actual attribute name

        svg.append("text")
        .attr("x", 370)
        .attr("y", 20)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("cursor", "pointer")
        .text("ℹ️")
        .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html("This bargraph shows the values of the selected attribute for each county and shows them in an ascending order to show the slow rise over the counties")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });
}

function createHistogram(data, selectedAttribute, containerId, title, color) {
    const margin = { top: 30, right: 40, bottom: 50, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear existing SVG
    d3.select(containerId).select("svg").remove();

    // Append SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Filter and clean data
    const filteredData = data
        .map(d => +d[selectedAttribute])  // Convert to number
        .filter(d => !isNaN(d) && d !== -1);

    // Compute x-axis domain correctly
    let xDomain = d3.extent(filteredData);
    if (xDomain[0] == null || xDomain[1] == null) {
        xDomain = [0, 10]; // Default range if data is empty
    }

    // Define x-scale
    const x = d3.scaleLinear()
        .domain([Math.floor(xDomain[0]), Math.ceil(xDomain[1])]) // Ensures a proper range
        .nice() // Makes the range round numbers
        .range([0, width]);

    // Create histogram bins
    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(10)); // Define bins explicitly

    const bins = histogram(filteredData);

    // Define y-scale
    const yMax = d3.max(bins, d => d.length) || 1; // Avoid 0 max issue
    const y = d3.scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

    // Append X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .attr("font-size", "12px");

    // Append Y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .attr("font-size", "12px");

    // Tooltip setup
    const tooltip = d3.select("#tooltip");

    // Draw bars
    svg.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", d => x(d.x0))
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(1, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => height - y(d.length))
        .attr("fill", color)
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<strong>Range: </strong>${d.x0} - ${d.x1}<br><strong>Count: </strong>${d.length}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);

        svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 30)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(selectedAttribute);  // Replace with the attribute name
    

    // Info Icon
    svg.append("text")
        .attr("x", width - 20)
        .attr("y", -5)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("cursor", "pointer")
        .text("ℹ️")
        .on("mouseover", function (event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html("The histogram shows the distribution of the selected attribute.")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });
}

// Function to draw Diverging Bar Chart (Urban vs Rural)
function drawDivergingBarChart(data, attribute1, attribute2, divId) {
    const margin = { top: 20, right: 40, bottom: 40, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(divId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3.select("#tooltip");

    // Set up the scales
    const x = d3.scaleLinear()
        .domain([
            d3.min(data, d => Math.min(d[attribute1], d[attribute2])),
            d3.max(data, d => Math.max(d[attribute1], d[attribute2]))
        ])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.county))
        .range([0, height])
        .padding(0.1);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

    const yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    // Draw the bars for attribute1 (Urban)
    svg.selectAll(".bar1")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", d => x(Math.min(0, d[attribute1]))) // Left for negative values
        .attr("y", d => y(d.county))
        .attr("width", d => Math.abs(x(d[attribute1]) - x(0))) // Width as absolute value
        .attr("height", y.bandwidth())
        .attr("fill", "#FF6347")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<strong>County: </strong>${d.county}<br><strong>Urban: </strong>${d[attribute1]}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    // Draw the bars for attribute2 (Rural)
    svg.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", d => x(Math.max(0, d[attribute2]))) // Right for positive values
        .attr("y", d => y(d.county))
        .attr("width", d => Math.abs(x(d[attribute2]) - x(0))) // Width as absolute value
        .attr("height", y.bandwidth())
        .attr("fill", "#32CD32")
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`<strong>County: </strong>${d.county}<br><strong>Rural: </strong>${d[attribute2]}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });


}

function drawScatterplotLine(filteredData, title, Attribute1, Attribute2, targetDiv) {
    const margin = {top: 40, right: 30, bottom: 80, left: 50};
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG element with viewBox to make it scale nicely
    const svg = d3.select(targetDiv).html("") // Clear previous content
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const validData = filteredData.filter(d => d.x !== -1 && d.y !== -1 && !isNaN(d.x) && !isNaN(d.y));

    const xScale = d3.scaleLinear()
        .domain([d3.min(validData, d => d.x), d3.max(validData, d => d.x)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(validData, d => d.y), d3.max(validData, d => d.y)])
        .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    // Draw scatterplot points
    // svg.selectAll("circle")
    //     .data(validData)
    //     .enter().append("circle")
    //     .attr("cx", d => xScale(d.x))
    //     .attr("cy", d => yScale(d.y))
    //     .attr("r", 5)
    //     .attr("fill", "#e35424")
    //     .on("mouseover", function(event, d) {
    //         tooltip.style("visibility", "visible")
    //             .style("opacity", 1)
    //             .html(`<b>County:${d.display_name}</b><br><strong>${Attribute1}: </strong>${d.x}<br><strong>${Attribute2}: </strong>${d.y}`)
    //             .style("left", (event.pageX + 10) + "px")
    //             .style("top", (event.pageY + 10) + "px");
    //     })
    //     .on("mousemove", function(event) {
    //         tooltip.style("left", (event.pageX + 10) + "px")
    //             .style("top", (event.pageY + 10) + "px");
    //     })
    //     .on("mouseout", function() {
    //         tooltip.style("opacity", 0)
    //             .style("visibility", "hidden");
    //     });

    // Title for scatter plot
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(title);

    // x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(Attribute1);

    // y-axis label
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .attr("transform", "rotate(-90)") // Rotate to align with the y-axis
        .text(Attribute2);

    // Info Icon (Top Right)
    svg.append("text")
        .attr("x", width - 20)
        .attr("y", -20)
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .attr("cursor", "pointer")
        .text("ℹ️")
        .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html("This chart shows the regression line of the scatterplot")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    // Calculate the linear regression line (y = mx + b)
    const n = validData.length;
    const sumX = d3.sum(validData, d => d.x);
    const sumY = d3.sum(validData, d => d.y);
    const sumXY = d3.sum(validData, d => d.x * d.y);
    const sumX2 = d3.sum(validData, d => d.x * d.x);

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    // Create data for the regression line (y = mx + b)
    const lineData = [
        { x: d3.min(validData, d => d.x), y: m * d3.min(validData, d => d.x) + b },
        { x: d3.max(validData, d => d.x), y: m * d3.max(validData, d => d.x) + b }
    ];

    // Plot the regression line
    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "#1f77b4")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
        );
}