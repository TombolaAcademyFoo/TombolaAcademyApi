(function () {
    'use strict';
    var Promise = require('es6-promise').Promise,
        config = require('../config'),
        connectionPool = require('../core-server/database/connection-pool'),
        logger = require('../core-server/logging/logger'),
        queryDatabaseWhitelist = function(tablename, connection, resolve, reject){
            connection.query('select * from apiwhitelist where tablename = ?',
                [tablename],
                function (err, rows) {
                    var isWhitelisted = false;
                    if (err) {
                        connection.release();
                        logger.error(err);
                        reject('Could Not execute query')
                    }
                    else {
                        isWhitelisted = rows.length > 0;
                        logger.debug('Result found, whitelisted=' + isWhitelisted);
                        connection.release();
                        resolve(isWhitelisted);
                    }
                });
        },
        checkDatabaseWhitelist =function(tablename, resolve, reject){
            connectionPool.getConnection(function(err, connection) {
                if (err) {
                    logger.error(err);
                    reject('Could Not connect')
                }
                queryDatabaseWhitelist(tablename, connection, resolve, reject);
            });
        };

    module.exports.isTableWhitelisted = function (tablename) {
        return new Promise(function(resolve, reject) {
            checkDatabaseWhitelist(tablename, resolve, reject)
        });
    };

    module.exports.isValidId = function (id) {
        if (id) {
            return /^\d*$/.test(id);
        }
        return true;
    };
})();