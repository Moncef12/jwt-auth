'use strict';

/**
 * Dependencies.
 */
var jwt = require('jwt-simple'),
    config = require('../../config/config'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function (req, res, next) {
    // Search token in : req.body && query && http headers;
    var token = (req.body && req.body.access_token) ||
        (req.query && req.query.access_token) ||
        req.headers['x-access-token'];

    if(token){
        try{
            // Decode token.
            var decoded = jwt.decode(token, config.secret);

            if(decoded.user){
                // Check Token expiration time...
                if(decoded.exp < moment().unix()){
                    next();
                    //res.status(401).send('Token expired.');
                }
                // Ok, login user.
                User.findById(decoded.user, function (err, userFound) {
                    req.user = userFound;
                    next();
                });
            }
        }catch(ex){
            return next();
        }
    }else{
        next();
    }
}
