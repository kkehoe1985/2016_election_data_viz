'use strict';

//jquery global variables
var $mbMap = $('#mbMap').attr('style', 'visibility: hidden;');
var $reset = $('button[id=reset]').hide();
var $d3Map = $('#d3Map');
var $bottom = $('#bottom-container');

// initialize mapbox map (outside logic to avoid duplicate initializations).
L.mapbox.accessToken = 'pk.eyJ1Ijoic3ByaW5nZmllbGQiLCJhIjoiMmZkYmQ2MDIwMzc0NzU2NGJlNjY3YWFhZTdkOTIzNDMifQ.p8t3Dhdb5i6yAef33jU3LQ';
var mbMap = L.mapbox.map('mbMap', 'mapbox.streets', {
  minZoom: 4,
  maxZoom: 10
});

// array for our state geojson featureLayer
var overlayLayers = [];

// d3 map parameters
var width = $d3Map.width();
var height = $d3Map.height();

var quantize = d3.scale.quantize()
    .domain([0, 100])
    .range(d3.range(8).map(function(i) { return 'q' + i + '-8'; }));


var projection = d3.geo.albersUsa()
    .scale(width / 0.285 / Math.PI)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('#d3Map').append('svg')
    .attr('width', width)
    .attr('height', height);

var g = svg.append('g')
    .attr('class', 'county-container');

// render maps
var countyBounds = [];

var newUs;
var newJson;
var originalUs;
var multiplier;


function renderMap(json) {
  d3.json (json, function (error, us) {
    if (error) {
      return console.error(error); 
      data = json
    }

    originalUs = us;
    newUs = us;

    countyBounds = topojson.feature(us, us.objects.counties).features;

    var counties = g.append('g')
          .attr('class', 'counties')
        .selectAll('path')
          .data(countyBounds)
        .enter().append('path')
          .attr('id', function(county) { return county.id; } )
          .attr('class', function (d) { return quantize(d.properties.D); })
          .attr('d', path)
          .on('mouseover', function (d) {
            d3.select(this)
            .style('stroke', '#fff')
            .style('stroke-width', '2.5px');
          })
          .on('mouseout', function (d) {
            d3.select(this)
            .style('stroke', 'none');
          })
          .on('click', clicked);

    var borders = g.append('path')
        .datum(topojson.mesh(us, us.objects.counties, function (a, b) { return a.id / 1000 ^ b.id /1000; }))
        .attr('class', 'state-borders')
        .attr('d', path);

    // D3 map resize function
    var onResize = function() {
        var width = $d3Map.width();
        var height = $d3Map.height();

        svg.attr('width', width)
          .attr('height', height);

        projection.scale(width / 0.285 / Math.PI)
          .translate([width / 2, height / 2]);

        path.projection(projection);
        counties.attr('d', path);
        borders.attr('d', path);
    };

    $(window).resize(debounce(onResize, 200, false));
    // var usLayer = L.geoJson(countyBounds, { style: style }).addTo(mbMap);
  });
}

renderMap('https://raw.githubusercontent.com/kkehoe1985/ga_data_science_final_project/master/combined_data_with_county_shapes.json');

var denested = $.getJSON('https://raw.githubusercontent.com/kkehoe1985/ga_data_science_final_project/master/de-nested_json_reduced.json')


//slider functions
var old_white_male_UiValue = 0;
var new_white_male_UiValue;

var old_jewish_UiValue = 0;
var new_jewish_UiValue;

var old_white_female_UiValue = 0;
var new_white_female_UiValue;

var old_percent_bachelors_UiValue = 0;
var new_percent_bachelors_UiValue;

var old_percent_hs_only_UiValue = 0;
var new_percent_hs_only_UiValue;

var old_density_housing_UiValue = 0;
var new_density_housing_UiValue;

var old_black_female_UiValue = 0;
var new_black_female_UiValue;

var old_black_male_UiValue = 0;
var new_black_male_UiValue;

var old_population_UiValue = 0;
var new_population_UiValue;

var old_density_pop_UiValue = 0;
var new_density_pop_UiValue;

$(function() {
  $("#white_male_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_white_male_UiValue = ui.value;

      $("#white_male_label").val((new_white_male_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
          object.properties.WHITE_MALE_rate = (object.properties.WHITE_MALE_rate / ((old_white_male_UiValue + 100) / 100)) * ((new_white_male_UiValue + 100) / 100)
      });

      old_white_male_UiValue = ui.value;
    }
  });

  $("#white_male_label").val($("#white_male_slider").slider("value"));
});

$(function() {
  $("#jewish_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_jewish_UiValue = ui.value;

      $("#jewish_label").val((new_jewish_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
          object.properties.Jewish = (object.properties.Jewish / ((old_jewish_UiValue + 100) / 100)) * ((new_jewish_UiValue + 100) / 100)
      });

      old_jewish_UiValue = ui.value;
    }
  });

  $("#jewish_label").val($("#jewish_slider").slider( "value") );
});


$(function() {
  $("#white_female_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_white_female_UiValue = ui.value;
      $("#white_female_label").val((new_white_female_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties.WHITE_FEMALE_rate = (object.properties.WHITE_FEMALE_rate / ((old_white_female_UiValue + 100) / 100)) * ((new_white_female_UiValue + 100) / 100)
      });

      old_white_female_UiValue = ui.value;
    }
  });

  $("#white_female_label").val($("#white_female_slider").slider("value"));
});

$(function() {
  $("#percent_bachelors_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_percent_bachelors_UiValue = ui.value;
      $("#percent_bachelors_label").val((new_percent_bachelors_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties["Percent of adults with a bachelor's degree or higher, 2010-2014"] = (object.properties["Percent of adults with a bachelor's degree or higher, 2010-2014"] / ((old_percent_bachelors_UiValue + 100) / 100)) * ((new_percent_bachelors_UiValue + 100) / 100)
      });

      old_percent_bachelors_UiValue = ui.value;
    }
  });

  $("#percent_bachelors_label").val($("#percent_bachelors_slider").slider("value"));
});

$(function() {
  $("#percent_hs_only_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_percent_hs_only_UiValue = ui.value;
      $("#percent_hs_only_label").val((new_percent_hs_only_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties["Percent of adults with a high school diploma only, 2010-2014"] = (object.properties["Percent of adults with a high school diploma only, 2010-2014"] / ((old_percent_hs_only_UiValue + 100) / 100)) * ((new_percent_hs_only_UiValue + 100) / 100)
      });

      old_percent_hs_only_UiValue = ui.value;
    }
  });

  $("#percent_hs_only_label").val($("#percent_hs_only_slider").slider("value"));
});

$(function() {
  $("#density_housing_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_density_housing_UiValue = ui.value;
      $("#density_housing_label").val((new_density_housing_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties["Density per square mile of land area - Housing units"] = (object.properties["Density per square mile of land area - Housing units"] / ((old_density_housing_UiValue + 100) / 100)) * ((new_density_housing_UiValue + 100) / 100)
      });

      old_density_housing_UiValue = ui.value;
    }
  });

  $("#density_housing_label").val($("#density_housing_slider").slider("value"));
});

$(function() {
  $("#black_female_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_black_female_UiValue = ui.value;
      $("#black_female_label").val((new_black_female_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties.black_FEMALE_rate = (object.properties.black_FEMALE_rate / ((old_black_female_UiValue + 100) / 100)) * ((new_black_female_UiValue + 100) / 100)
      });

      old_black_female_UiValue = ui.value;
    }
  });

  $("#black_female_label").val($("#black_female_slider").slider("value"));
});

$(function() {
  $("#black_male_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_black_male_UiValue = ui.value;
      $("#black_male_label").val((new_black_male_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties.black_MALErate = (object.properties.black_MALE_rate / ((old_black_male_UiValue + 100) / 100)) * ((new_black_male_UiValue + 100) / 100)
      });

      old_black_male_UiValue = ui.value;
    }
  });

  $("#black_male_label").val($("#black_male_slider").slider("value"));
});

$(function() {
  $("#population_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_population_UiValue = ui.value;
      $("#population_label").val((new_population_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties["Population"] = (object.properties["Population"] / ((old_population_UiValue + 100) / 100)) * ((new_population_UiValue + 100) / 100)
      });

      old_population_UiValue = ui.value;  
    }
  });

  $("#population_label").val($("#population_slider").slider("value"));
});

$(function() {
  $("#density_pop_slider").slider({
    orientation: "horizontal",
    range: "min",
    min: -100,
    max: 100,
    value: 1,
    slide: function(event, ui) {
      new_density_pop_UiValue = ui.value;
      $("#density_pop_label").val((new_density_pop_UiValue + 100) / 100);

      newUs.objects.counties.geometries.forEach(function(object) {
        object.properties["Density per square mile of land area - Population"] = (object.properties["Density per square mile of land area - Population"] / ((old_density_pop_UiValue + 100) / 100)) * ((new_density_pop_UiValue + 100) / 100)
      });

      old_density_pop_UiValue = ui.value;
    }
  });

  $("#density_pop_label").val($("#density_pop_slider").slider("value"));
});

// transition from d3 view to mapbox view on click
function clicked(d) {
  $d3Map.fadeOut(600);
  $mbMap.fadeIn(1000);
  var centroid = path.centroid(d);
  var x = centroid[0];
  var y = centroid[1];
  var zoom = 1;
  $reset.show();
  $mbMap.attr('style', 'visibility: visible;');
  $bottom.addClass('detail');

  var stateBounds = getBounds(getState(d.properties.s));
  overlayLayers.push(stateBounds);
  
  // hardcode AK
  if (d.properties.s === 'AK') {
    mbMap.fitBounds([[54.113578, -165.835171], [70.568625, -142.547859]]);
  } else {
    mbMap.fitBounds(stateBounds.getBounds());
  }

  g.transition()
    .duration(750)
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + zoom + ')translate(' + -x + ',' + -y + ')')
    .style('stroke-width', 1.5 / zoom + 'px');
}

// event listener to transition back to D3 map.
$reset.on('click', function(e) {
  $mbMap.fadeOut(600);
  // $bottom.removeClass('detail');
  $d3Map.fadeIn(1000);
  $reset.hide();

// remove styling from state geojson featureLayer
  for (var i = 0, ii = overlayLayers.length; i < ii; ++i) {
    mbMap.removeLayer(overlayLayers[i]);
  }

  g.transition()
    .duration(750)
    .attr('transform', 'translate(0,0)scale(1)')
    .style('stroke-width', '1.5px');
});

// get bounds of clicked county geography
// create & style state featureLayer
function getBounds(geojson) {
  var style = {
    fillOpacity: 1,
    color: '#666',
    weight: 1.8,
    opacity: 1,
  };

  var featureLayer = L.geoJson(geojson, {
    style: style,
    onEachFeature: function(feature, layer) {
      layer.setStyle({
        fillColor: layer.feature.new_prediction !== undefined ? getColor(layer.feature.new_prediction) : getColor(layer.feature.properties.D),
      });
    }
  }).addTo(mbMap);
  
  return featureLayer;
}

// get all county bounds for a state, using properties.D
function getState(state) {
  var stateBounds = [];
  for (var i = 0, ii = countyBounds.length; i < ii; ++i) {
    if (countyBounds[i].properties.s === state) {
      stateBounds.push(countyBounds[i]);
    }
  }
  return { type: 'FeatureCollection', features: stateBounds };
}

// set color for mapbox quantile scale
function getColor(d) {
  if (d >= 0 && d < 48) {
    return 'rgb(255, 0, 0)';
  } else if (d >= 0 && d >= 48) {
    return 'rgb(0, 102, 255)';
  } else {
    return 'rgb(198,198,198)';
  }
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.D),
    weight: 0.7,
    opacity: 0.5,
    color: '#fff',
    fillOpacity: 0.5
  };
}

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 4,
    opacity: 1,
    color: '#fff'
  });
}

function resetHighlight(e) {
  usLayer.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
  });
}

// Debounce function to limit number of function calls
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

//send request to flask to create model on page load
$(document).ready(function(){
  $.blockUI({ message: $('#block-message') });

  $.ajax({
     url: "http://localhost:5000/create_model",
    //url: "https://gentle-garden-66729.herokuapp.com/create_model",
    context: document.body,
    success: function() {
      $("#update").prop("disabled", false);

      $.unblockUI({ 
        onUnblock: function(){
          $("#sliders-submit").show();
        } 
      });
    },
    error: function() {
      $('#block-message').html("There was an error loading the model. Please reload the page.")
    }
  });

  $("#update").click(function(){
    var sliderValues = {
      percent_hs_only: $('#percent_hs_only_label').val(),
      population: $("#population_label").val(),
      percent_white_male: $("#white_male_label").val(),
      percent_jewish: $("#jewish_label").val(),
      percent_white_female: $("#white_female_label").val(),
      percent_bachelors: $("#percent_bachelors_label").val(),
      density_housing: $("#density_housing_label").val(),
      percent_black_female: $("#black_female_label").val(),
      percent_black_male: $("#black_male_label").val(),
      density_pop: $("#density_pop_label").val()
    };

    $.ajax({
       url: "http://localhost:5000/update_predictions",
      //url: "https://gentle-garden-66729.herokuapp.com/update_predictions",
      type: "GET",
      contentType: "application/json",
      data: sliderValues,
      success: function(data) {
        var originalCounties = countyBounds;
        var newCounties = JSON.parse(data);

        _.each(originalCounties, function(originalCountyData) {
          var matchingNewCountyData = _.find(newCounties, function(newCountyData) {
            return newCountyData["id"] == originalCountyData["id"]
          });

          if (matchingNewCountyData) {
            originalCountyData.new_prediction = matchingNewCountyData.new_prediction;
          }
        });

        _.each(originalCounties, function(originalCounty) {
          var countyPath = $("#" + originalCounty.id);

          if (countyPath) {
            countyPath.removeAttr('class');
            countyPath.attr('class', quantize(originalCounty.new_prediction));
          }
        });
      }   
    });
  });
});
