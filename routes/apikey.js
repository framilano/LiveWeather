var express = require('express');
var router = express.Router();

/* GET apikey*/
//Richiamo dal back-end la api key in modo tale da servirla al client
router.get('/', function(req, res, next) {
  res.json({'api_key': process.env.API_KEY})
});

module.exports = router;
