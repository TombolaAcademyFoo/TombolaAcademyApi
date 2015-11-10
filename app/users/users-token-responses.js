(function () {
    'use strict';
    var errorReponse = function(req, res){
        return res.json({ success: false, message: 'Failed to authenticate token.' });
    };

    var noTokenResponse = function(req, res){
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    };
    module.exports = {
        errorResponse: errorReponse,
        noTokenResponse: noTokenResponse
    };
})();