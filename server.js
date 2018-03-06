var yelp = require('yelp-fusion');
var express= require("express");
var bodyParser = require("body-parser")
var path = require("path");
var app = express();

// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
  });
app.get("/band/", function(req, res) {
    res.sendFile(path.join(__dirname, "./results.html"));
  });
  // If no matching route is found default to home
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
  });
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
      if (response.businesses[i].rating>3 && searchedArr.businesses.length<5) {
        // making json object of yelp result
        var searchedJson={
          name: response.businesses[i].name,
          img: response.businesses[i].image_url,
          yelp: response.businesses[i].url,
          rating: response.businesses[i].rating,
          coordinates: response.businesses[i].coordinates,
          price: response.businesses[i].price,
          address: response.businesses[i].location.display_address,
          phone: response.businesses[i].display_phone
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
