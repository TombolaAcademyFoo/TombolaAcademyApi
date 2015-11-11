(function () {
    'use strict';
    var mysql   = require('mysql'),
        config = require('../../config'),
        logger = require('../logging/logger');
        logger.debug('Creating DB connection Pool');
        var connectionPool =  mysql.createPool(config.database);
        logger.debug('Created DB connection Pool');
    module.exports = connectionPool;
})();