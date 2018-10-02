// function that builds the metadata panel
function buildMetadata(sample) {
  // log the sample passed into the function into the console
  console.log(`buildMetadata(${sample})`);
  // create the url from the sample input
  var url = `/metadata/${sample}`;
  console.log(`url: ${url}`);
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {
    console.log(`response: ${response}`)
    var data = response;
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key,value]) => {
      panel.append("card-text").text(`${key}: ${value}`).append("br")
    });
  })
}

function buildCharts(sample) {

  console.log(sample);
  var url = `samples/${sample}`;
  var g_url = `wfreq/${sample}`; 

  // Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response) {
    //var response = response;

    // Build a Bubble Chart using the sample data
    var trace1 = [{
      x: response.otu_ids,
      y: response.sample_values,
      marker: {
        size: response.sample_values,
        color: response.otu_ids },
      mode: "markers",
      label: response.otu_labels,
      type: "scatter"
    }];

    var layout1 = {
      height: 650,
      width: 1250,
      title: 'Samples by OTU ID',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Samples'}
    };
    var plot1 = document.getElementById('bubble');
    Plotly.newPlot(plot1, trace1, layout1)

    // Build a Pie Chart
    var trace2 = [{
      values: response.sample_values.slice(0,10),
      labels: response.otu_ids.slice(0,10),
      hoverinfo: response.otu_labels.slice(0,10),
      type: "pie"
    }];
    console.log(trace2)

    var layout2 = {
      height: 500,
      width: 500,
      title: "First 10 OTUs Sample Proportion"
    };
    var plot2 = document.getElementById('pie');
    Plotly.newPlot(plot2, trace2, layout2)
  });

  // Build a gauge using a new d3 call
  d3.json(g_url).then(function(response) {
    //var g_response = response;

    // Enter a speed between 0 and 180
    var level = response.WFREQ*20;
    console.log(level)

    // Trig to calc meter point
    var degrees = 180 - level,radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data3 = [{ 
      type: 'scatter',
      x: [0], 
      y: [0],
      marker: {
        size: 28, 
        color:'850000'},
      showlegend: false,
      name: 'freq',
      text: response.WFREQ,
      hoverinfo: 'text+name'},

      { 
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(14, 127, 0, .5)', 
                      'rgba(110, 154, 28, .5)',
                      'rgba(170, 202, 56, .5)', 
                      'rgba(202, 209, 84, .5)',
                      'rgba(210, 206, 112, .5)', 
                      'rgba(232, 226, 140, .5)',
                      'rgba(232, 226, 168, .5)',
                      'rgba(232, 226, 196, .5)',
                      'rgba(255, 255, 215, .5)',
                      'rgba(255, 255, 255, 0)']},

      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      //labels: ['161-180' ,'141-160' ,'121-140' ,'101-120' ,'81-100' ,'61-80' ,'41-60' ,'21-40' ,'0-20'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout3 = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: 'Belly Button Washing Frequency',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    var plot3 = document.getElementById('gauge');
    Plotly.newPlot(plot3, data3, layout3);
  });
};

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
  // d3.select("pie").html("");
  // d3.select("gauge").html("");
  // d3.select("bubble").html("");
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

// resize charts when window size changes
function resize(){
  var rSample = d3.select("#selDataset").property("value");
  console.log("sample",rSample);
  buildCharts(rSample);
}
d3.select(window).on('resize', resize);