var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id_user', function(req, res, next) {
  res.json({
    name: 'Marcos Rivas'
  });
});

module.exports = router;
