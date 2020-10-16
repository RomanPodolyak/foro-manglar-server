var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Api root');
});

router.get('/hello', function(req, res, next) {
  res.contentType('json');
  let body = {status: 'OK', message: 'Hello World'};
  res.send(body);
});

module.exports = router;
