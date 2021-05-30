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

router.post('/', async function(req, res, next) {
  const {username, password} = req.body;

  if(!username || !password){
    next();
  }else{
    const user = new User({username, password});

    const exists = await user.usernameExists(username);

    if(exists){
      res.json({
        message: 'user exists'
      });
    }else{
      await user.save();

      console.log('User added');
      res.json({
        message: 'User added'
      });
    }
    
  }
});

router.get('/:iduser', async function(req, res, next) {
  let results;

  try{
    results = await User.findById(req.params.iduser, '_id username');
  }catch(ex){
    next()
  }

  res.json(results);
});

router.patch('/:iduser', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
