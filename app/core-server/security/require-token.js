(function () {
    'use strict';
    module.exports = function(errorResponse, noTokenResponse){
        console.log('***********');
        console.log(errorResponse);
        console.log(noTokenResponse);
        console.log('***********');
      return function(req, res, next){
          var jsonwebtoken = require('jsonwebtoken'),
              config = require('../../config'),
              token = req.headers['x-access-token'];

          if (token) {
              jsonwebtoken.verify(token, config.authentication.secret, function(err, decoded) {
                  if (err) {
                      return errorResponse(req, res,next)
                  } else {
                      // if everything is good, save to request for use in other routes
                      //TODO: Get user roles also...
                      req.decoded = decoded;
                      next();
                  }
              });

          }
          else {
              return noTokenResponse(req, res);
          }
      };
    };
})();