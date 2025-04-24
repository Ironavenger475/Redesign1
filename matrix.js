function drawCorrelationGauge(data, attr1, attr2) {
    let correlation = computeCorrelation(data, attr1, attr2);

    // Clear previous gauge
    d3.select("#correlationGauge").selectAll("*").remove();

    let width = 600, height = 220;
    let radius = Math.min(width, height - 20);

    // Define the arc for the gauge
    let arc = d3.arc()
    .innerRadius(radius - 30)
    .outerRadius(radius)
    .startAngle(-Math.PI / 2)   // -90 degrees (left)
    .endAngle(Math.PI / 2);            // End at 0 degrees (0)

    // Create SVG container for the gauge
    let svg = d3.select("#correlationGauge")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height - 20})`);

    // Draw the arc background
    svg.append("path")
        .attr("d", arc)
        .attr("fill", "#ddd").on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`Correlation: ${correlation.toFixed(2)}
                <p> This is used to show the correlation of the two attributes and if there is any relation between them. It varies between -1 and 1. The closer to 1 the value is, the more corelated the two attributes are`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });;

    // Define the needle's angle scale (mapping correlation to -180° to 0°)
    let needleAngle = d3.scaleLinear()
        .domain([-1, 0, 1])  // Ensure -1, 0, 1 map correctly
        .range([-Math.PI, -Math.PI / 2, 0]);  // -180° to -90° to 0°

    // Convert the correlation value to angle (radians)
    let angleRad = needleAngle(correlation);

    // Needle length inside the arc
    let needleLength = radius - 30;

    // Calculate the needle's end position (x2, y2)
    let x2 = needleLength * Math.cos(angleRad);
    let y2 = needleLength * Math.sin(angleRad);  // SVG uses top-down Y, so no inversion needed

    // Draw the needle line
    svg.append("line")
        .attr("x1", 0) // Starting point (center)
        .attr("y1", 0)
        .attr("x2", x2) // End point
        .attr("y2", y2)
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .on("mouseover", function(event) {
            tooltip.style("visibility", "visible")
                .style("opacity", 1)
                .html(`Correlation: ${correlation.toFixed(2)}
                <p> This is used to show the correlation of the two attributes and if there is any relation between them. It varies between -1 and 1. The closer to 1 the value is, the more corelated the two attributes are`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0)
                .style("visibility", "hidden");
        });

    // Add a center circle for pivot point
    svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "black");

    // Display the correlation value in the center of the gauge
    svg.append("text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text(correlation.toFixed(2)); // Show the correlation value rounded to 2 decimals
    // Info Icon (Top Right)
svg.append("div")
.style("position", "absolute")
.style("top", "10px")  // Adjust as needed
.style("right", "10px") // Position in the top-right
.style("font-size", "18px")
.style("cursor", "pointer")
.text("ℹ️")
.on("mouseover", function(event) {
    tooltip.style("visibility", "visible")
        .style("opacity", 1)
        .html("Hover over bars for details.")
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
})
.on("mouseout", function() {
    tooltip.style("opacity", 0)
        .style("visibility", "hidden");
});

    // Add labels for -1, 0, and 1
    svg.append("text")
        .attr("x", -radius + 10)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text("-1");

    svg.append("text")
        .attr("x", 0)
        .attr("y", radius - 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text("0");

    svg.append("text")
        .attr("x", radius - 10)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("fill", "black")
        .text("1");
    
}
function computeCorrelation(data, attr1, attr2) {
    let values1 = data.map(d => +d[attr1]);
    let values2 = data.map(d => +d[attr2]);

    let mean1 = d3.mean(values1);
    let mean2 = d3.mean(values2);

    let numerator = d3.sum(values1.map((d, i) => (d - mean1) * (values2[i] - mean2)));
    let denominator = Math.sqrt(d3.sum(values1.map(d => (d - mean1) ** 2)) * d3.sum(values2.map(d => (d - mean2) ** 2)));

    return denominator ? numerator / denominator : 0;
}

function drawCorrelationBar(data, attr1, attr2) {
    let correlation = computeCorrelation(data, attr1, attr2);

    d3.select("#correlationChart").selectAll("*").remove(); // Clear previous chart

    let svg = d3.select("#correlationChart")
        .append("svg")
        .attr("width", 300)
        .attr("height", 50);

    let scale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, 300]);

    let colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])
        .range(["red", "gray", "green"]);

    svg.append("rect")
        .attr("x", scale(-1))
        .attr("y", 10)
        .attr("width", scale(correlation) - scale(-1))
        .attr("height", 30)
        .attr("fill", colorScale(correlation));

    svg.append("text")
        .attr("x", scale(correlation))
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(correlation.toFixed(2));
}