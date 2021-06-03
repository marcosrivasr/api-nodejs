require('dotenv').config();
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET


exports.checkAuth = (req, res, next) => {
    console.log('check auth middleware');
    const header = req.header('Authorization');
    console.log(header);

    if(!header){
        throw new Error('Access Denied. No authorization header provided');
    }else{
        const [bearer, token] = header.split(' ');
        
        if(bearer == 'Bearer' && token){
            try{
                const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
                req.user = payload.user;
                next();
    
            }catch(ex){
                if(ex.name == 'TokenExpiredError'){
                    throw new Error('Token expired. Login again');
                }else if(ex.name == 'JsonWebTokenError'){
                    throw new Error('Token not valid');
                }else{
                    next(ex);
                }
            }

        }else{
            throw new Error('Token malformed');
        }
    }
}