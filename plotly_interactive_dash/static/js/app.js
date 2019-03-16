function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var meataDataURL = `/metadata/${sample}`; 

  // Use d3 to select the panel with id of `#sample-metadata`
  var sampleTable = d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  sampleTable.html("");   

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(meataDataURL).then(function(response) {
    var data = response;
    
    var dataEntries = Object.entries(data);

    var row = sampleTable.append("tr");

    dataEntries.forEach((pair) => {
      row.append("tr").text(pair);
    })
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleURL = `/samples/${sample}`; 

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(sampleURL).then(function(response) {

      var otuIDs = Object.values(response)[0];
      var sampleValues = Object.values(response)[2];
      var otuLabels = Object.values(response)[1];

      var trace1 = {
        x: otuIDs,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {size: sampleValues,
                 color: otuIDs}
      };

      var data = [trace1];

      var layout = {
        title: 'OTU Abundance',
        showlegend: false,
        height: 600,
        width: 1200
      };
      Plotly.newPlot('bubble', data, layout);
    })

    // @TODO: Build a Pie Chart
    d3.json(sampleURL).then(function(response) {
      console.log(response);
      var saved = response;

      var otuIDs = Object.values(response)[0].slice(0,10);
      console.log(otuIDs);
      var sampleValues = Object.values(response)[2].slice(0,10);
      var otuLabels = Object.values(response)[1].slice(0,10);
  
      var trace1 = [{
        values: sampleValues,
        labels: otuIDs,
        type: 'pie'
      }]

      var layout = {
        height: 500,
        width: 500,
        title: 'Top Ten Abundant OTUs'
      }

      Plotly.newPlot('pie', trace1, layout)

    })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
