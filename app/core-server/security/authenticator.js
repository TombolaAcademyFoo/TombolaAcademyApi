(function () {
    'use strict';
    module.exports =  function(req,res) {
        //https://github.com/davidwood/node-password-hash
        //https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
        var jsonwebtoken = require('jsonwebtoken'),
            config = require('../../config'),
            connectionPool = require('../database/connection-pool'),
            logger = require('../logging/logger'),
            sendError = function(logMessage){
                logger.error({status: 503, error: logMessage});
                res.json({success: false, message: 'Authentication failed.'});
            },
            sendDbConnectionError = function(err){
                logger.error({status: 503, error: err});
                res.sendStatus(503);
            },
            getToken = function(username){
                return jsonwebtoken.sign({username: username}, config.authentication.secret,
                    {
                        expiresInMinutes: config.authentication.expiresInMinutes
                    });
            },
            validateResultAndGetUser = function(connection, err, rows){
                if (err) {
                    sendDbConnectionError(err);
                    connection.release();
                    return;
                }
                if (rows.length === 0) {
                    sendError('Username not found:' + req.body.username);
                    connection.release();
                    return;
                }
                if (rows.length > 1) {
                    sendError('Username not unique, found:' + req.body.username);
                    connection.release();
                    return;
                }
                connection.release();
                return rows[0];
            };
            logger.debug('Authenticating');
            connectionPool.getConnection(function (err, connection) {
                logger.debug('Connected');
                if (err) {
                    logger.error('Problen Connecting');
                    sendDbConnectionError(err);
                    return;
                }
                connection.query('SELECT * FROM users WHERE username=?', [req.body.username],
                    function (err, rows) {

                        var user = validateResultAndGetUser(connection, err,rows);
                        if(user){
                            if (user.password !== req.body.password) {
                                logger.error({status: 200, error: 'Incorrect password for user: ' + req.body.username});
                                res.json({success: false, message: 'Authentication failed.'});
                                return;
                            }

                            res.json({
                                success: true,
                                message: 'Enjoy your token!',
                                token: getToken(user.username)
                            });
                            logger.info(req.body.username + ' authenticated');
                        }
                    });

            });
    };
})();