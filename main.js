// Load TopoJSON data and CSV dataset
Promise.all([
  d3.json('counties-10m.json'),
  d3.csv('data/dataset.csv')
]).then(data => {
  let geoData = data[0];
  let countyData = data[1];

  // Append tooltip div (hidden by default)
  const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "rgba(0, 0, 0, 0.8)")
    .style("color", "#fff")
    .style("padding", "10px")
    .style("border-radius", "5px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("visibility", "hidden")
    .style("z-index", 10000);

  // Extract dropdown options from dataset
  const attributes = Object.keys(countyData[0]).filter(attr => attr !== "cnty_fips" && attr !== "county_name" && attr != "display_name" && attr !== "urban_rural_status");

  const dropdowns = { map1: "#dropdown3", map2: "#dropdown4" };

  Object.entries(dropdowns).forEach(([mapId, selector]) => {
    const dropdown = d3.select(selector);

    const tit="Select an attribute for" + mapId;

    // Populate dropdown with dataset attributes
    attributes.forEach(attr => dropdown.append("option").text(attr).attr("value", attr));

    // Event listener for dropdown change
    dropdown.on("change", function () {
      updateMap(mapId, this.value);
    });
  });
  function positionTooltip(event, mapId) {
    let tooltipWidth = tooltip.node().offsetWidth;
    let tooltipHeight = tooltip.node().offsetHeight;
    let pageWidth = window.innerWidth;
    let pageHeight = window.innerHeight;

    let x = event.pageX;
    let y = event.pageY;

    if (mapId === "map1") {
        // Position tooltip at bottom-left of cursor for map1
        let left = x - tooltipWidth - 10;
        let top = y + 20;

        // Ensure tooltip stays within bounds
        if (left < 0) left = x + 10;  // If too left, move right
        if (top + tooltipHeight > pageHeight) top = y - tooltipHeight - 10; // If too low, move up

        tooltip.style("left", left + "px")
               .style("top", top + "px");
    } else if (mapId === "map2") {
        // Position tooltip at top-left of cursor for map2
        let left = x - tooltipWidth - 10;
        let top = y - tooltipHeight - 10;

        // Ensure tooltip stays within bounds
        if (left < 0) left = x + 10; // If too left, move right
        if (top < 0) top = y + 20; // If too high, move below cursor

        tooltip.style("left", left + "px")
               .style("top", top + "px");
    }
}
  function updateColorScale(attribute) {
    const colorSchemes = {
      "poverty_perc": d3.interpolateOranges,
      "percent_obesity": d3.interpolateGreens,
      "percent_diabetes": d3.interpolatePurples,
      "percent_high_cholesterol": d3.interpolateBlues,
      "percent_inactive": d3.interpolateReds,
      "percent_smoking": d3.interpolateGreys,
      "elderly_percentage": d3.interpolateGreys,
      "percent_high_blood_pressure": d3.interpolateReds,
      "percent_coronary_heart_disease": d3.interpolateReds,
      "percent_stroke": d3.interpolatePurples,
    };

    const chosenColor = colorSchemes[attribute] || d3.interpolateBlues;
    let values = countyData.map(d => +d[attribute]).filter(d => !isNaN(d));

    return d3.scaleSequential(chosenColor).domain([d3.min(values), d3.max(values)]);
  }

  function updateMap(mapId, attribute) {
    let colorScale = attribute ? updateColorScale(attribute) : null;

    geoData.objects.counties.geometries.forEach(d => {
      let county = countyData.find(c => c.cnty_fips === d.id);
      if (county) {
        d.properties = { ...county };
      }
    });

    renderMap(mapId, colorScale, attribute);
  }

  function renderMap(mapId, colorScale, attribute) {
    d3.select(`#${mapId}`).html(""); // Clear previous map
  
    const width = 960, height = 500;
    const projection = d3.geoAlbersUsa().scale(1000).translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
  
    const svg = d3.select(`#${mapId}`).append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const g = svg.append("g"); // Group element for map paths
  
    // Define zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Limits zoom level
      .on("zoom", (event) => {
        g.attr("transform", event.transform); // Apply zoom transformation only to map content (not the entire page)
      });
  
    svg.call(zoom); // Call zoom behavior on the SVG element
  
    const counties = topojson.feature(geoData, geoData.objects.counties);
  
    g.selectAll("path")
      .data(counties.features)
      .enter().append("path")
      .attr("d", path)
      .attr("fill", d => attribute && d.properties[attribute] ? colorScale(d.properties[attribute]) : "#000") // Black when idle
      .attr("stroke", "#333")
      .attr("stroke-width", 0.5)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke-width", 2);
        
        let tooltipContent = `<strong>${d.properties.display_name || "Unknown County"}</strong><br>`;
        Object.entries(d.properties).forEach(([key, value]) => {
            if (key !== "cnty_fips" && key !== "county_name") {
                tooltipContent += `<strong>${key}:</strong> ${value}<br>`;
            }
        });
    
        tooltip.style("visibility", "visible")
            .style("opacity", 1)
            .html(tooltipContent);
    
        positionTooltip(event, mapId);
    })
    .on("mousemove", function (event) {
        positionTooltip(event, mapId);
    })
    .on("mouseout", function () {
        d3.select(this).attr("stroke-width", 0.5);
        tooltip.style("opacity", 0).style("visibility", "hidden");
    })
      .on("click", function (event, d) {
        const [[x0, y0], [x1, y1]] = path.bounds(d);
        const dx = x1 - x0, dy = y1 - y0;
        const x = (x0 + x1) / 2, y = (y0 + y1) / 2;
        const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
        const translate = [width / 2 - scale * x, height / 2 - scale * y];
  
        // Apply zoom and focus on the clicked area
        svg.transition().duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(...translate).scale(scale));
      });
  
    svg.on("dblclick", function () {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });
  
    if (attribute) {
      renderLegend(mapId, colorScale);
    } else {
      d3.select(`#legend-${mapId}`).html(""); // Clear legend if idle
    }
  }

  function renderLegend(mapId, colorScale) {
    d3.select(`#legend-${mapId}`).html("");

    const legendWidth = 300, legendHeight = 50;
    const legendSvg = d3.select(`#legend-${mapId}`).append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight);

    const defs = legendSvg.append("defs");
    const linearGradient = defs.append("linearGradient")
        .attr("id", `legend-gradient-${mapId}`)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");

    const colorRange = d3.range(0, 1.1, 0.1).map(d =>
        colorScale(d3.min(colorScale.domain()) + d * (d3.max(colorScale.domain()) - d3.min(colorScale.domain())))
    );

    linearGradient.selectAll("stop")
        .data(colorRange)
        .enter().append("stop")
        .attr("offset", (d, i) => `${(i / (colorRange.length - 1)) * 100}%`)
        .attr("stop-color", d => d);

    legendSvg.append("rect").attr("width", legendWidth).attr("height", 20)
        .style("fill", `url(#legend-gradient-${mapId})`);

    const legendScale = d3.scaleLinear().domain(colorScale.domain()).range([0, legendWidth]);
    legendSvg.append("g").attr("transform", "translate(0, 20)")
        .call(d3.axisBottom(legendScale).ticks(5).tickFormat(d3.format(".2s")));
  }

  // Initial load (Render black map by default)
  updateMap("map1", "");
  updateMap("map2", "");

  // Event listener for X-axis button
d3.select("#xaxis1").on("click", function () {
  const selectedX = d3.select("#dropdown1").property("value");
  d3.select("#dropdown3").property("value", selectedX).dispatch("change");
});

d3.select("#yaxis1").on("click", function () {
  const selectedY = d3.select("#dropdown2").property("value");
  d3.select("#dropdown3").property("value", selectedY).dispatch("change");
});

d3.select("#xaxis2").on("click", function () {
  const selectedX = d3.select("#dropdown1").property("value");
  d3.select("#dropdown4").property("value", selectedX).dispatch("change");
});

// Event listener for Y-axis button
d3.select("#yaxis2").on("click", function () {
  const selectedY = d3.select("#dropdown2").property("value");
  d3.select("#dropdown4").property("value", selectedY).dispatch("change");
});

}).catch(error => console.error(error));