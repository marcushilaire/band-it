
var bandIs = function (){
    var bandQuery = $("#bandName").val()
    // testing variable
    // var bandQuery = "Run River North"
    //  Takes in user input
    var queryURL = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=bandit"
    //  band is in town api
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(resultsEvent){
        // looping through the array of upcoming events
        for ( var i =0; i<resultsEvent.length; i++){
            console.log(resultsEvent[i])
            var venue = resultsEvent[i].venue;
            var lat = venue.latitude;
            var long = venue.longitude;
            var line = $("<hr>")
            var div = $("<div>").attr({
                "id": venue.name,
                "class": "event",           
            });
            var city = $("<p>").text(venue.city);
            var name = $("<p>").text(venue.name).attr({
                "class": "venue", 
                // Venue location information is set to the the data types below
                "data-venue": venue.name,
                "data-date": resultsEvent[i].datetime,
                "data-city": venue.city,
                "data-lat": lat,
                "data-long": long
            });
            // render the information to the html page, this will be adjusted 
            div.append(line, city, name);
            // this ajax call works but is currently being appended to a placeholder that does not exist
            $("#placeholderDiv").append(div);
        }
    })
}
var yelpfunction= function(){
  // function that occurs when the user pick a single venue
  $(".venue").on("click", function(){
    var lati = $(this).attr("data-lat")
    var longi = $(this).attr("data-long")
    var userSelects="bar, restaurant"; //have user select which catagory to select in html so they can choose what stores

    var newSearchRequest= {
      categories: userSelects,
      latitude: lati,
      longitude: longi
    }
    $.post("/yelp", newSearchRequest, function(data){
      // console loging all the data as array and json object
      console.log(data);
      // use this to get google map intergration and info we want to give out as output for all the store info
    });
  })
}
$("#submitBtn").on("click", function(event){
    if($("#bandName").val() !== "")
    bandIs()
})

// This is testing to make sure that the data types were set correctly
$(document).on("click", ".venue", function(){
    var lati = $(this).attr("data-lat")
    var longi = $(this).attr("data-long")
    console.log(lati)
    console.log(longi)
    console.log($(this).attr("data-venue"))
    console.log($(this).attr("data-date"))
    console.log($(this).attr("data-city"))
})
