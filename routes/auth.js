var express = require('express');
const User = require('../model/usermodel');
const Token = require('../model/tokenmodel');
const jwt = require('jsonwebtoken');
const {jsonResponse} = require('../lib/jsonresponse');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
var router = express.Router();

router.post('/signup', async function(req, res, next) {
  
    const {username, password} = req.body;

    try{

        const user = new User();
        const userExists = await user.usernameExists(username);

        if(userExists){
            return next(new Error('user already exists'));
        }else{
            const user = new User({username, password});

            let accessToken = await user.createAccessToken();
            let refreshToken = await user.createRefreshToken();

            user.save();

            res.json(jsonResponse(200, {
                message: 'User created successfully',
                accessToken,
                refreshToken
            }));
        }

    }catch(err){
        console.log(err);
    }
});

router.post('/login', async function(req, res, next) {
    const {username, password} = req.body;

    try{
        let user = new User();
        const userExists = await user.usernameExists(username);
        console.log({userExists});
        if(userExists){
            user = await User.findOne({username: username}); 
            console.log(user);
            const passwordCorrect = await user.isCorrectPassword(password, user.password);

            if(passwordCorrect){
                let accessToken = await user.createAccessToken();
                let refreshToken = await user.createRefreshToken();

                return res.json({
                    accessToken, refreshToken
                });
            }else{
                return next(new Error('username and/or password incorrect'));
            }
               
        }else{
            return next(new Error('user does not exist'));
        }

    }catch(err){
        console.log(err);
    }
});

router.post('/refresh-token', async (req, res) => {
    const {refreshToken} = req.body;

    if(!refreshToken){
        return next(new Error('No token provided'));
    }

    try{

        const tokenDocument = await Token.findOne({token: refreshToken});

        if(!token){
            return next(new Error('No token found'));
        }

        const payload = jwt.verify(tokenDocument.token, REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({user: payload}, ACCESS_TOKEN_SECRET, {expiresIn: '10m'});

        res.json({
            accessToken
        });
    }catch(err){

    }
});

router.delete('/logout', async (req, res) => {
    const {refreshToken} = req.body;

    try{
        await Token.findOneAndRemove({token: refreshToken});
        res.json({
            success: 'Token removed'
        });
    }catch(ex){
        return next(new Error('Error loging out the user'));
    }
});
  

module.exports = router;