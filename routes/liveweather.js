var express = require('express');
var router = express.Router();

/* GET liveweather homepage. */
router.get('/', function(req, res, next) {
  res.render('liveweather', { title: 'LiveWeather'});

});

module.exports = router;
