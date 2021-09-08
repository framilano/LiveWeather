var express = require('express');
var router = express.Router();

/* GET apikey*/
router.get('/', function(req, res, next) {
  res.json({'api_key': process.env.API_KEY})
});

module.exports = router;
