// from data.js
var ufoSightings = data;

// Get refrence to the 'filter button'
var filterTable = d3.select("#filter-btn");

// Select table to put 'filteredData' into 
var dataTable = d3.select("#ufo-table");
var tbody = dataTable.select("tbody");

// Select div where table area exists
var tableArea = d3.select("#table-area");

// Function to use input date to search through data
function searchDate(event) {
    var inputDate = d3.event.target.value;
}

// Function to capitalize first letter of a string
function cptlzFrstLttr(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Search UFO Sightings by Date
function UFOSightingSearchDate(event) {
   
    // Stop page from refreshing when clicking 'filter button'
    d3.event.preventDefault();

    // Clear Current data in 'UFO table'
    tbody.text(" ");
    tableArea.select("h1").text(" ");

    // Select html of input date text
    var inputElement = d3.select("#datetime");

    // Select only value of input date text
    var inputValue = inputElement.property("value");

    // Filter UFO sightings data based on input date
    var filteredData = ufoSightings.filter(sighting => sighting.datetime === inputValue);
    
    // Check console for number of UFO sightings matching input date
    console.log(filteredData.length);

    // Create an execption if input date does not match
    // any date of a UFO sighting
    if (filteredData.length === 0) {
        tableArea.append("h1").text(`Sorry, there are no UFO sightings on ${inputValue}.`);
    }

    // For each UFO sighting with matching date,
    // append that to the 'UFO table'
    filteredData.forEach((sighting) => {

            // Create 'new row' variable
            var row = tbody.append("tr");

            // Select only values from UFO sighting 
            var sightingText = Object.values(sighting);

            // Create separate variables for each point of information
                var filteredDate = sightingText[0];

                // Capitalize first letter of city string
                var filteredCity = cptlzFrstLttr(sightingText[1]);

                // Capitalize state string
                var filteredState = sightingText[2].toUpperCase();

                // Capitalize State string
                var filteredCountry = sightingText[3].toUpperCase();

                // Capitalize first letter of shape
                var filteredShape = cptlzFrstLttr(sightingText[4]);
                var filteredDuration = sightingText[5];
                var filteredComments = sightingText[6];

            // For each new row, append the following columns to the table
            row.append("td").text(filteredDate);
            row.append("td").text(filteredCity);
            row.append("td").text(filteredState);
            row.append("td").text(filteredCountry);
            row.append("td").text(filteredShape);
            row.append("td").text(filteredDuration);
            row.append("td").text(filteredComments);
    })
}

// Add event listener for 'filter table' button
filterTable.on("click", UFOSightingSearchDate);

