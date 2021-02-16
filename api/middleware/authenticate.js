'use strict'

const JWT = require('jwt-simple');
const Moment = require('moment');
const Key = 'secure_key_MA';

exports.ensureAuth = function(req,res, next) {
    if (!req.headers.authorization){
        return res.status(401).send({Message: 'Request Whitout Authentication, cannot access!!!',Headers:  req.headers})
    }
    const Token = req.headers.authorization.replace(/['"]+/g, '');
    
    try {
        const Payload = JWT.decode(Token, Key);
        // console.log(Payload);
        if(Payload.Expiration < Moment().unix()) {
            return res.status(403).send({Message: 'Access Not Allowed, please re Login'});
        }
        
        req.usuario = Payload;
    } catch (error) {
        return res.status(404).send({Message: 'Incorrect Token', error});
    }

    next();
};
