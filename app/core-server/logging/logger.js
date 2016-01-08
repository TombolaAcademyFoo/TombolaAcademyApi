(function () {
    'use strict';
    var winston = require('winston');
    var config = require('../../config');
    winston.emitErrs = true;

    var logger = new winston.Logger({
        transports: [
            new winston.transports.File(config.logging.file),
            new winston.transports.Console(config.logging.console)
        ],
        exitOnError: false
    });

    module.exports = logger;
    module.exports.winston = winston;
    module.exports.stream = {
        write: function (message, encoding) {
            logger.info(message);
        }
    };
})();