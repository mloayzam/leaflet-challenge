// Initialize the Leaflet map
let map = L.map('map').setView([37.09, -95.71], 5);


// Add a tile layer to the map 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use the direct URL of the JSON file for earthquake data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

// Use D3.js to load and process the GeoJSON data
d3.json(url).then(function (data) {
    // Handle and visualize the earthquake data
    // Markers for each earthquake location
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // Earthquake magnitude for marker size and depth for color
            let markerSize = feature.properties.mag * 5;
            let markerColor = getColor(feature.geometry.coordinates[2] ); // The depth of the earth can be found as the third coordinate for each earthquake

            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            // Include popups that provide additional information about the earthquake.
            layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place +
                '<br>Depth: ' + feature.geometry.coordinates[2] + ' km');
        }
    }).addTo(map);

    // Adding legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 90]; // depth ranges

        div.innerHTML += '<h4>Depth</h4>';
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});

// Function to get color based on earthquake depth
function getColor(d) {
    return d > 90 ? '#800026' :
        d > 70 ? '#BD0026' :
        d > 50 ? '#E31A1C' :
        d > 30 ? '#FC4E2A' :
        d > 10 ? '#FD8D3C' :
        '#FEB24C';
}




