var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id_user', function(req, res, next) {
  res.json({
router.get('/:iduser', async function(req, res, next) {
  let results;

  try{
    results = await User.findById(req.params.iduser, '_id username');
  }catch(ex){
    next()
  }

  res.json(results);
});

});

module.exports = router;
