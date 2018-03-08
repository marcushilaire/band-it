
// global map variables
var markers = [];
var lati;
var longi;
var newVenue = "";
// var map;

var bandIs = function (){

  var name = window.location.href;
  var thing= name.split("/")
  var lastUrl= thing[thing.length-1];

    var bandQuery = lastUrl;

    var queryURL = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=bandit";
    var queryURL2 = "https://rest.bandsintown.com/artists/" + bandQuery + "?app_id=bandit";

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(resultsEvent){
      var image= resultsEvent.image_url;
      var name= resultsEvent.name;
      var newImage=$("<img>").attr({"src": image, "class": "img img-responsive img-fluid"});

      var newName=$("<h1>").text(name);
      $("#artistImage").append(newImage);
      $("#artistName").append(newName);
    });
    //  band is in town api
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(resultsEvent){

        // populate map with preset coordinates to the Anthem in DC
        initMapFirst();
        // looping through the array of upcoming events
      if (resultsEvent.length==0) {
          alert("There is no concert or event set up for band :"+bandQuery);
        }
        for ( var i =0; i<resultsEvent.length; i++){
            console.log(resultsEvent[i])

            var date = resultsEvent[i].datetime;
        // looping through the array of upcoming events


            console.log(resultsEvent[i])

            var venue = resultsEvent[i].venue;
            var lat = venue.latitude;
            var long = venue.longitude;
            var line = $("<hr>")
            var div = $("<div>").attr({
                "id": venue.name,
                "class": "event",
            });
            var showtime = $("<p>").text("Date: " + date);
            var city = $("<p class='city'>").text("City: " +venue.city);
            var name = $("<button class='venueButtons'>").text(venue.name).attr({
                "class": "venue",
                // Venue location information is set to the the data types below
                "data-venue": venue.name,
                "data-date": resultsEvent[i].datetime,
                "data-city": venue.city,
                "data-lat": lat,
                "data-long": long
            });
            if (i==0) {
              initMap(venue.name, venue.latitude, venue.longitude);
            };
            // render the information to the html page, this will be adjusted
            div.append(city, name, showtime, line);
            // this ajax call works but is currently being appended to a placeholder that does not exist
            $("#artistLocation").append(div);

        }
        yelpfunction();
    })
}
//var yelpfunction= function(){
  // function that occurs when the user pick a single venue

var yelpfunction=function(){
  $(".venue").on("click", function(){

    var newVenue = $(this).attr("data-venue")
    var lati = $(this).attr("data-lat")
    var longi = $(this).attr("data-long")
    var userSelects="bar, restaurant"; //have user select which catagory to select in html so they can choose what stores

    console.log(newVenue);

    console.log(lati);
    console.log(longi);
    // clear yelp results on every click of venue
    $("#yelpResults").empty()
    initMap(newVenue, lati, longi)
    // addMarker(newVenue)

    var newSearchRequest= {
      categories: userSelects,
      latitude: lati,
      longitude: longi
    }
    $.post("/yelp", newSearchRequest, function(data){
      // console loging all the data as array and json object
      console.log(data);
      var location = [];
      // loop to go log all data in the array
      for (var i = 0; i < data.length; i++) {

        var yelpResultsCard = $("<p>")
        var yelpImage = $("<img>")
        yelpImage.attr("src", data[i].img)
        yelpImage.attr("class", "card-img-top")
        var yelpName = data[i].name
        var add1 = data[i].address[0]
        var add2 = data[i].address[1]
        var add3 = data[i].address[2]
        var yelpPhone = data[i].phone
        var yelpPrice = data[i].price
        var yelpRating = data[i].rating
        $("#yelpResults").append('<a href='+data[i].yelp+' target="_blank"><div class="card text-center yelpCard">' +
          '<img class="card-image-top yelpImage" src="'+data[i].img+'">' +
          '<div class="card-body yelpInfo">' +
            '<h4 id="yelpName" class="card-title">' + yelpName + '</h4>' +
            '<p id="add1" class="card-text">' + add1 + '</p>' +
            '<p id="add2" class="card-text">' + add2 + '</p>' +
            // '<p id="add3" class="card-text">' + add3 + '</p>' +
            '<p id="yelpPhone" class="card-text">Phone: ' + yelpPhone + '</p>' +
            '<p id="yelpRating" class="card-text">Rating: ' + yelpRating + '</p>' +
            '<p id="yelpPrice" class="card-text">' + yelpPrice + '</p>' +
          '</div>' +
        '</div>' +
      '</div></a>')
        location.push(data[i].coordinates);

      }
      console.log(location);
      initMap(newVenue, lati, longi, location);
      // use this to get google map intergration and info we want to give out as output for all the store info
    });
  });
}


$("#submitBtn").on("click", function(event){
    event.preventDefault();
    if($("#bandName").val().trim() !== ""){
      var bandname = $("#bandName").val().trim();

      window.location.href = `/bands/${bandname}`;
    }
})

$("h1").on("click", function(event){
  event.preventDefault();
    window.location.href = `/`;
})
$(".logoImg").on("click", function(event){
  event.preventDefault();
    window.location.href = `/`;
})

bandIs();

// load map with preset venue first
function initMapFirst() {

  var theAnthem = {lat: 38.88848049, lng: -77.0302294} // replace capitalGrill with venue lati and longi
  var map = new google.maps.Map(document.getElementById('artistMap'), {
    zoom: 14, // zoom in to neighborboods near the venue
    center: theAnthem
  });
  var marker = new google.maps.Marker({
    position: theAnthem,
    map: map
    // icon: image,

  })
} // endo initMapFirst function
//* Google Maps JS *//
// get goole map function with marker set desired location
function initMap(newVenue, lati, longi, location) {
  console.log(location);


  // var lati = 38.88848049
  // var longi = -77.0302294
  newVenue = {lat: parseFloat(lati), lng: parseFloat(longi)} // replace capitalGrill with venue lati and longi
  var map = new google.maps.Map(document.getElementById('artistMap'), {
    zoom: 14, // zoom in to neighborboods near the venue
    center: newVenue
  });
  if (!location) {
    var marker = new google.maps.Marker({
      position: newVenue,
      map: map
    });
  } else{
    for (var i = 0; i < location.length; i++) {
      location[i]
      var marker = new google.maps.Marker({
        position: newVenue,
        map: map
      });

      for (i = 0; i < location.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(parseFloat(location[i].latitude), parseFloat(location[i].longitude)),
          map: map
        });
    }
  }
}
    // icon: image,

// content of clicking on the map marker.  Populate from yelp data later.
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString,
    maxWidth: 400

  })
// listen for the music marker click
  marker.addListener('click', function() {
    infowindow.open(map, marker)
  })
}
initMap()

// Adds a marker to the map and push to the array.
      function addMarker(newVenue) {
        var map = new google.maps.Map(document.getElementById('artistMap'), {
          zoom: 10, // zoom in to neighborboods near the venue
          center: newVenue
        });
        var marker = new google.maps.Marker({
          position: newVenue,
          map: map
        });
        markers.push(marker);
      }

// Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }

      // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

      // Deletes all markers in the array by removing references to them.
      function deleteMarkers() {
        clearMarkers();
        markers = [];
      }

      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

 // add markers to maps
 function addMarkers() {

 }
//yelpfunction();
