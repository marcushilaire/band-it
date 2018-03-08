var yelp = require('yelp-fusion');
var express= require("express");
var bodyParser = require("body-parser")
var path = require("path");
var fs =require("fs");
var request = require("request");
var querystring= require("querystring");
var app = express();

// required spotify information
var client_id = '91fc8fe62de6433e84c880e514183820'; // Your client id
var client_secret = '4e101632b354456989bab719b97a673e'; // Your secret
var redirect_uri = 'http://localhost:8080/callback'; // Your redirect uri
var tokens=[]


// Sets an initial port. We"ll use this later in our listener
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
    console.log(__dirname)
  });
app.get("/bands/:bandName", function(req, res) {
    res.sendFile(path.join(__dirname, "./results.html"));
    console.log(__dirname)
  });

  // If no matching route is found default to home
// app.get("*", function(req, res) {
//     res.sendFile(path.join(__dirname, "./index.html"));
//   });

// yelp search using node
var apiKey = '-LJE5gdMKh7r6T5o7m7eg3q02j_lbmsiS0GEW57DcF0ucR9PdtP_CGJ1Ceq-JipoX9XyG9oThAb8snqi3bYmS0YLOVxUtHZAdlssf3tHikHmK1jTgJaw8nNjiw6TWnYx';
var client = yelp.client(apiKey);
//
// new yelp().client(keys.yelp)
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
      if (r[i].rating>3 && searchedArr.length<21) {
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

// spotify server things
// allows the user to login to spotify
app.get('/login', function(req, res) {

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      redirect_uri: redirect_uri,
    }));
    console.log("logged in")
});
// the place where tokens are stored
app.get("/api", function (req, res){
  res.json(tokens);
});
// generates and saves access and refresh tokens
app.get('/callback', function(req, res) {
  
  var code = req.query.code || null;

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
          tokens=[];
          tokens.push({
              access_token : access_token,
            refresh_token : refresh_token
          })

          //   res.json(body);
          //   //console.log(refresh_token);
     res.redirect("/")

      }
    });
});
// uses the refresh token to generate new access tokens
app.get('/refresh_token', function(req, res) {

  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
      // if all goes well your new access token will console log in node
      console.log("new access: " + access_token)
    }
  });
});




// deploy on a server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
