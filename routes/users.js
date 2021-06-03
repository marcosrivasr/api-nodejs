var express = require('express');
var router = express.Router();
const User = require('../model/usermodel');
const createError = require('http-errors');
const {jsonResponse} = require('../lib/jsonresponse');
const authMiddleware = require('../auth/auth.middleware'); 

/* GET users listing. */
router.get('/',authMiddleware.checkAuth, async function(req, res, next) {
  
  let results;

  try{
    results = await User.find({}, '_id username name');
  }catch(ex){
    next(createError(400, 'There was a problem with the request'))
  }

  res.json(jsonResponse(200, results));
});

router.post('/', authMiddleware.checkAuth, async function(req, res, next) {
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
      res.json(jsonResponse(200, {message: 'User added correctly'}));
    }
    
  }
});

router.get('/:iduser', authMiddleware.checkAuth, async function(req, res, next) {
  let results;

  try{
    results = await User.findById(req.params.iduser, '_id username name');
    
    if(!results) return next(new createError(400, `No user found`));
  }catch(ex){
    //next(new Error(`No user found with id ${req.params.iduser}`));
    next(createError(400, `No user found with id ${req.params.iduser}`))
  }

  res.json(jsonResponse(200, results));
});

router.patch('/:iduser', authMiddleware.checkAuth, async function(req, res, next) {
  const {name, password} = req.body;
  let query = {};

  if(!name && !password) return next(createError(400, 'No parameters provided'));

  try{
    if(name){
      query['name'] = name;
    }
    if(password){
      query['password'] = password;
    }
    const results = await User.findOneAndUpdate({_id: req.params.iduser}, query);
    
    if(!results) return next(new createError(400, `No user found`));

  }catch(ex){
    console.log(ex);
    next(createError(400, `Some of the fields couldn't be updated`))
  }

  res.json(jsonResponse(200, {
    message: `User ${req.params.iduser} updated successfully`
  }));
  
});


module.exports = router;
