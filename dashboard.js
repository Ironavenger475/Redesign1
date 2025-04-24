
// Declare global data variable
let data = [];

// Load the CSV file
d3.csv("data/dataset.csv").then(loadedData => {
    console.log("Data loading complete.");
    data = loadedData; // Assign loaded data to global variable

    // Process the data
    data.forEach(d => {
        d.poverty_perc = +d.poverty_perc;
        d.percent_obesity = +d.percent_obesity;
        d.percent_inactive = +d.percent_inactive;
        d.percent_smoking = +d.percent_smoking;
        d.elderly_percentage = +d.elderly_percentage;
        d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
        d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
        d.percent_stroke = +d.percent_stroke;
        d.percent_diabetes = +d.percent_diabetes;
        d.percent_high_cholesterol = +d.percent_high_cholesterol;
        d.cnty_fips = +d.cnty_fips;
        d.display_name = +display_name;

        let tokens = d.display_name.split(", ");
        d.state = tokens[1] || "Unknown";
        d.isUrban = (d.urban_rural_status.toLowerCase() === "urban");
    });

    console.log("Processed Data:", data);

    // Initialize charts after data is loaded
    updateCharts();
}).catch(error => {
    console.error("Error loading data:", error);
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdown1 = d3.select("#dropdown1");
    const dropdown2 = d3.select("#dropdown2");

    const columns1 = [
        "hello",
        "poverty_perc",
        "percent_obesity",
        "percent_inactive",
        "percent_smoking",
        "elderly_percentage"
    ];

    const columns2 = [
        "world",
        "percent_high_blood_pressure",
        "percent_coronary_heart_disease",
        "percent_stroke",
        "percent_high_cholesterol",
        "percent_diabetes"
    ];
    dropdown1.selectAll("option")
        .data(columns1)
        .enter().append("option")
        .text(d => d);

    dropdown2.selectAll("option")
        .data(columns2)
        .enter().append("option")
        .text(d => d);

    function updateCharts() {
        if (!data.length) {
            console.warn("Data is not yet loaded.");
            return;
        }

        let Attribute1 = dropdown1.node().value;
        let Attribute2 = dropdown2.node().value;

        console.log("Attribute 1:", Attribute1, "Attribute 2:", Attribute2);

        const filteredData = data
    .map(d => ({
        x: +d[Attribute1],  // Convert to number
        y: +d[Attribute2],
        display_name: d.display_name
    }))
    .filter(d => d.x !== -1 && d.y !== -1 && !isNaN(d.x) && !isNaN(d.y)); // Ensure proper filtering
    

        console.log("Filtered Data for Charts:", filteredData);
        let Title1="Scatterplot";
        let Title2=Attribute1 + " Vs " + Attribute2;
        createHistogram(data, Attribute1, "#histogramdropdown1", Attribute1,"#69b3a2");
        createHistogram(data, Attribute2, "#histogramdropdown2", Attribute2,"#b3697a");
        drawScatterplot(filteredData,Title1,Attribute1,Attribute2);
        drawBarGraph1(filteredData,"Bar chart of " + Attribute1, Attribute1);
        drawBarGraph2(filteredData,"Bar chart of " + Attribute2, Attribute2);
        drawCorrelationBar(data, Attribute1, Attribute2);  // For bar chart
        drawCorrelationGauge(data, Attribute1, Attribute2);  // For gauge chart
        drawScatterplotLine(filteredData,"Regression Line of Scatterplot",Attribute1,Attribute2,"#scatterplotline");
    // Helper function to check if the value is valid
// Helper function to check if the value is valid
function isValid(value) {
    return !isNaN(value) && value !== -1;
}

    }


    dropdown1.on("change", updateCharts);
    dropdown2.on("change", updateCharts);
    
    // Event listener for X-axis button
d3.select("#map1button1").on("click", function () {
    const selectedX = d3.select("#dropdown1").property("value");
    d3.select("#dropdown3").property("value", selectedX).dispatch("change");
  });
  
  // Event listener for Y-axis button
  d3.select("#map2button1").on("click", function () {
    const selectedX = d3.select("#dropdown1").property("value");
    d3.select("#dropdown4").property("value", selectedX).dispatch("change");
  });

  d3.select("#map1button2").on("click", function () {
    const selectedX = d3.select("#dropdown2").property("value");
    d3.select("#dropdown3").property("value", selectedX).dispatch("change");
  });

  d3.select("#map2button2").on("click", function () {
    const selectedX = d3.select("#dropdown2").property("value");
    d3.select("#dropdown4").property("value", selectedX).dispatch("change");
  });

});