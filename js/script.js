var bandIs = function (){
    var bandQuery = $("#bandName").val()
    //  the bandQuery variable will be updated to take in user input
    var queryURL = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=bandit"
    //  band is in town api
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(resultsEvent){
        // console.log(resultsEvent)
        for ( var i =0; i<resultsEvent.length; i++){
            console.log(resultsEvent[i])
            var venue = resultsEvent[i].venue;
            var div = $("<div>");
            var city = $("<p>").text(venue.city);
            var lat = venue.latitude;
            var long = venue.longitude;
            var name = $("<p>").text(venue.name).attr({
                // setting data types to the venue so that 
                "data-city": venue.city,
                "class": "venue",
                "data-lat": lat,
                "data-long": long
            });

            div.append(city, name);
            $("body").append(div);
        }
    })
}
bandIs();

// 
$(document).on("click", ".venue", function(){
    var lati = $(this).attr("data-lat")
    var longi = $(this).attr("data-long")
    console.log(lati)
    console.log(longi)
})
