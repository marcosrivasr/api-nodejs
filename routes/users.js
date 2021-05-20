var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', async function(req, res, next) {
  console.log(req.body);
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
});

module.exports = router;
