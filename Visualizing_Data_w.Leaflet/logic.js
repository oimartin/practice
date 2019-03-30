// URL for 4.5+ Earthquake data in the past 30 days
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"

// Perform a GET request to the query URL
d3.json(url, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

// Create function to show features on map of eartquake data
function createFeatures(earthquakeData) {

    // Define function that will create a popup
    // describing the details of the earthquake once 
    // for each feature
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><ul><li>"
        + new Date(feature.properties.time) + "</li><li>" + 
        feature.properties.mag + "</li></ul>");
    }

    // Create GeoJSON layer and use
    // onEachFeature function once for each piece of data 
    // in the features array
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Send earthquakes layer to be shown on map w. function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    // Define darkmap layer
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    } 

    // Create map with streetmap and earthquake layers
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a control layer to pass in baseMaps and overlayMaps
    // then add control layer to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}