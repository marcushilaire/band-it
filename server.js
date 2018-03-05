var yelp = require('yelp-fusion');
var express= require("express");
var bodyParser = require("body-parser")
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// yelp search using node
var apiKey = '-LJE5gdMKh7r6T5o7m7eg3q02j_lbmsiS0GEW57DcF0ucR9PdtP_CGJ1Ceq-JipoX9XyG9oThAb8snqi3bYmS0YLOVxUtHZAdlssf3tHikHmK1jTgJaw8nNjiw6TWnYx';
var client = yelp.client(apiKey);

// link this to search html
app.post("/yelp", function(req, res){
  // getting param from html
  var searchRequest= {
    categories: req.body.categories,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  }

  client.search(searchRequest).then(response => {
    var searchedArr=[];
    for (var i = 0; i < response.length; i++) {
      // searching restaurant and bar that has rating greater than 3 and stop when we have 5 stores
      if (response.rating>3 && searchedArr.length<5) {
        // making json object of yelp result
        var searchedJson={
          name: response.name,
          img: response.image_url,
          yelp: response.url,
          rating: response.rating,
          coordinates: response.coordinates,
          price: response.price,
          address: response.location.display_address,
          phone: response.display_phone
        }
        searchedArr.push(searchedJson);
      }
    }
    // sending back to front end as "data"
    res.json(searchedArr);
    console.log(searchedArr);
  });
})



// deploy on a server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
