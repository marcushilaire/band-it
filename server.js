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
    term: req.body.term,
    location: req.body.location
  }

  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0];
    res.json(response);
    console.log(response);
  });
})



// deploy on a server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
