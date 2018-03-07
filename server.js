var yelp = require('yelp-fusion');
var express= require("express");
var bodyParser = require("body-parser")
var path = require("path");
var fs =require("fs");
var app = express();


// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
  });
app.get("/:bandName", function(req, res) {
    res.sendFile(path.join(__dirname, "./results.html"));
  });

  // If no matching route is found default to home
// app.get("*", function(req, res) {
//     res.sendFile(path.join(__dirname, "./index.html"));
//   });


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
  var searchedArr=[];
  client.search(searchRequest).then(response => {
    var r= response.jsonBody.businesses;
    console.log(r.length);
    for (var i = 0; i < r.length; i++) {
      // searching restaurant and bar that has rating greater than 3 and stop when we have 5 stores
      if (r[i].rating>3 && searchedArr.length<8) {
        // making json object of yelp result
        var searchedJson={
          name: r[i].name,
          img: r[i].image_url,
          yelp: r[i].url,
          rating: r[i].rating,
          coordinates: r[i].coordinates,
          price: r[i].price,
          address: r[i].location.display_address,
          phone: r[i].display_phone
        }

        searchedArr.push(searchedJson);
      }
    }
    ressend();
    // sending back to front end as "data"
  });
  var ressend=function(){
    res.send(searchedArr);
  }


})






// deploy on a server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
