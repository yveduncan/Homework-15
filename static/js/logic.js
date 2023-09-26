// initialize map
var map = L.map('map').setView([0, 0], 2); 

// add base layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// get earthquake data from JSON URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // define function to determine size of marker based on magnitude
    function getMarkerSize(magnitude) {
      return magnitude * 5; 
    }

    // define function to determine marker color based on depth
    function getMarkerColor(depth) {
      if (depth < 10) {
        return 'green'; // shallow earthquakes
      } else if (depth < 50) {
        return 'yellow'; // moderate-depth earthquakes
      } else {
        return 'red'; // deep earthquakes
      }
    }

    // define function to determine color of legend based on depth
    function getDepthColor(depth) {
      if (depth < 10) {
        return 'green'; // shallow earthquakes
      } else if (depth < 50) {
        return 'yellow'; // moderate-depth earthquakes
      } else {
        return 'red'; // deep earthquakes
      }
    }

    // create legend 
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'info legend');
      var gradesMagnitude = [0, 1, 2, 3, 4, 5];
      var gradesDepth = [0, 10, 50];

      // add legend title
      div.innerHTML = '<h4>Earthquake Legend</h4>';

      // magnitude legend
      div.innerHTML += '<p><strong>Magnitude</strong></p>';
      for (var i = 0; i < gradesMagnitude.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          getMarkerColor(gradesMagnitude[i] + 1) +
          '"></i> ' +
          gradesMagnitude[i] +
          (gradesMagnitude[i + 1] ? '&ndash;' + gradesMagnitude[i + 1] + '<br>' : '+');
      }

      // depth legend
      div.innerHTML += '<p><strong>Depth</strong></p>';
      for (var j = 0; j < gradesDepth.length; j++) {
        div.innerHTML +=
          '<i style="background:' +
          getDepthColor(gradesDepth[j] + 1) +
          '"></i> ' +
          gradesDepth[j] +
          (gradesDepth[j + 1] ? '&ndash;' + gradesDepth[j + 1] + ' km<br>' : '+ km');
      }

      return div;
    };

    legend.addTo(map);

    // loop through earthquake features, create markers
    data.features.forEach(feature => {
      var coordinates = feature.geometry.coordinates; 
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var place = feature.properties.place;

      // create marker for each earthquake
      var marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Popup info
      var popupContent = `
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Depth:</strong> ${depth} km<br>
        <strong>Location:</strong> ${place}
      `;
      marker.bindPopup(popupContent);
    });
  });
