var bandIs = function (){
    var bandQuery = $("#bandName").val()
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
            var div = $("<div>");
            var city = $("<p>").text(venue.city);
            var name = $("<p>").text(venue.name).attr({
                "class": "venue", 
                // Venue location information  is set to the the data types below
                "data-venue": venue.name,
                "data-city": venue.city,
                "data-lat": lat,
                "data-long": long
            });
            div.append(city, name);
            $("body").append(div);
        }
    })
}
bandIs();

// This is testing to make sure that the data types were
$(document).on("click", ".venue", function(){
    var lati = $(this).attr("data-lat")
    var longi = $(this).attr("data-long")
    console.log(lati)
    console.log(longi)
})
