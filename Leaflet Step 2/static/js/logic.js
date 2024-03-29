//Leaflet Assigment
//Script
//Create map
// Create the tile layer that will be the background of our map
//Delete API 
var API_KEY = "pk.eyJ1IjoiamVubmlzbWFyaWUiLCJhIjoiY2swbjZkazhoMDRrNjNtbXd0bG01NGtzdyJ9.2IcJoERThHOBgVtLRXmcIQ";
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});



// JSON Data from USGS


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var p_link = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

function markerSize(mag) {
  return mag * 1000;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "#F2FDA1";
  } else if (mag <= 2) {
      return "#5FCFD1";
  } else if (mag <= 3) {
      return "#843699";
  } else if (mag <= 4) {
      return "#CC6456";
  } else if (mag <= 5) {
      return "#FF2872";
  } else {
      return "#3ED145";
  };
}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define satelitemap and darkmap layers
  var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satelite Map": satelitemap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the satelitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [31.57853542647338,-99.580078125],
    zoom: 3,
    layers: [satelitemap, earthquakes]
  });

  // For plates
  d3.json(p_link, function(Data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(Data.features);
});
  function createFeatures(platesData) {

    var plates  = L.geoJSON(platesData, {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
   onEachFeature : function (feature, layer) {
  
      layer.bindPopup("<h3>" + feature.properties.name +
        "</h3><hr><p>" + "<p> PlateA:" + feature.properties.platea + "</p>" + "<p> PlateB: " +  feature.properties.plateb + "</p>")
      },     pointToLayer: function (feature, latlng) {
        return new L.line(latlng,
          {radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.properties.mag),
          fillOpacity: 1,
          stroke: false,
      })
    }
    });
// Sending our earthquakes layer to the createMap function
createMap(plates);
}

function createMap(plates) {

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Plates: plates
  };

  // Create our map, giving it the satelitemap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [31.57853542647338,-99.580078125],
    zoom: 3,
    layers: [satelitemap, plates]
  });




  // Create a layer control
  // Pass in our baseMaps and overlayMaps
 
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(magnitudes[i] + 1) + 
              '"></i> ' + magnitudes[i] + (magnitudes[i + 1] ?
                ' - ' + magnitudes[i + 1] + 
                '<br>' : ' + ');
      }
  
      return div;
  }
  legend.addTo(myMap);
}}