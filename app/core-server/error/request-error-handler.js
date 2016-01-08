(function () {
    'use strict';
    module.exports = function (err, req, res, next) {
        var logger = require('./core-server/logging/logger');
        if (err.status) {
            logger.error(err);
            res.status(err.status)
                .send({message: err.message, error: err});
        }
        else {
            next();
        }
    };
})();