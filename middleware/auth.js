const jwt = require('jsonwebtoken');
const config = require('../config/default.json');


module.exports = function (req, res , next) {
    // get Token from Header
    const token = req.header('x-auth-token')

    //Check if not token
    if (!token){
        return res.status(401).json({msg: 'No token, authorization denied'})
    }
    try{
        const decoded = jwt.verify(token, config.jwtSecret);

        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: 'Token is not Valid'})

    }
}