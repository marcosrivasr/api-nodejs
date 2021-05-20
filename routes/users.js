var express = require('express');
var router = express.Router();
const User = require('../model/usermodel');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  let results;

  try{
    results = await User.find({}, '_id username password');
  }catch(ex){
    next()
  }

  res.json(results);
});

router.get('/:id_user', function(req, res, next) {
  res.json({
    name: 'Marcos Rivas'
  });
});

module.exports = router;
