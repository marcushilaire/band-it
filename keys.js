console.log('this is loaded');

exports.yelp={
  apiKey: process.env.YELP_APIKEY
}

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
