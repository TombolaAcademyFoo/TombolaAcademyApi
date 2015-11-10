(function () {
    'use strict';
    var mysql   = require('mysql'),
        config = require('../../config'),
        connectionPool =  mysql.createPool(config.database);
    module.exports = connectionPool;
})();