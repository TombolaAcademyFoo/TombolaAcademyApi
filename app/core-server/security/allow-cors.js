(function () {
    'use strict';
    var config = require('../../config');
    module.exports = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', config.server.cors.origins);
        res.header('Access-Control-Allow-Methods', config.server.cors.methods);
        res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
        if (req.method == 'OPTIONS') {
            res.status(200).end();
        } else {
            next();
        }
    };
})();