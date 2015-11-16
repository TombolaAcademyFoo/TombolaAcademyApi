(function () {
    'use strict';
    var senders = require('./senders'),
        sanitizer = require('./sanitizer'),
        connectionPool = require('../core-server/database/connection-pool'),
        logger = require('../core-server/logging/logger'),

        respond = function(req, res, callback) {
            res.setHeader('Content-Type', 'application/json');
            if(!sanitizer.isValidId(req.params.id)){
                logger.debug('id id valid');
                senders.errorResult(res, {'id': req.params.id, message:'Invalid ID' }, 400);
                return;
            }

            logger.debug('Checking whitelising');
            sanitizer.isTableWhitelisted(req.params.tablename)
                .then(function(isWhitelisted){
                    logger.debug('whitelising response from sql, is Whitelisted:' + isWhitelisted);
                    if(isWhitelisted){
                        connectionPool.getConnection(function(err, connection) {
                            if (err) {
                                senders.errorResult(res, err.code, 503);
                                return;
                            }
                            callback(connection);
                            connection.release();
                        })
                    }
                    else{
                        senders.errorResult(res, {'tablename': req.params.tablename, 'message':'table not allowed' }, 400);
                    }

                }, function(){
                    senders.errorResult(res, {'tablename': req.params.tablename, 'message':'technical error' }, 400);
                });
        },

        getResponder = function(connection, res, query, queryParams){
            queryParams = queryParams ? queryParams : [];
            connection.query(query,
                queryParams,
                function (err, rows, fields) {
                    if (err) {
                        senders.errorResult(res, err.code);
                    }
                    else {
                        senders.getResultIfOK(res, rows, fields);
                    }
            });
        },

        getSingleOnConnection = function (res, req, connection) {
            getResponder(connection, res,  'SELECT * FROM ' + req.params.tablename + ' WHERE ID = ?', [req.params.id]);
        };

    module.exports.getAll =  function(req, res) {
        logger.debug({action: 'getAll', tablename: req.params.tablename});
        respond(req,
            res,
            function (connection) {
                //TODO: pagination?
                //TODO: where clause?
                getResponder(connection, res,  'SELECT * FROM ' + req.params.tablename);
            });
    };

    module.exports.getSingle =  function(req, res) {
        logger.debug({action: 'getSingle', tablename: req.params.tablename, id: req.params.id});
        respond(req,
            res,
            function (connection) {
                getSingleOnConnection(res, req, connection);
            });
    };

    module.exports.add =  function(req, res) {
        logger.debug({action: 'add', tablename: req.params.tablename, body: req.body});
        respond(req,
            res,
            function(connection){
                connection.query('INSERT INTO ' + req.params.tablename + ' SET ?', req.body,
                    function (err, sqlResult) {
                        senders.bodyessResultIfOK(res, err, sqlResult.insertId);
                    });
        });
    };

    module.exports.update =  function(req, res) {
        logger.debug({action: 'update', tablename: req.params.tablename, id: req.params.id, body: req.body});
        respond(req,
            res,
            function(connection){
                connection.query('UPDATE ' + req.params.tablename + ' SET ? WHERE ID = ?' ,
                    [req.body, req.params.id],
                    function (err) {
                        if (err) {
                            senders.errorResult(res, err.code);
                        }
                        else {
                            getSingleOnConnection(res,req,connection);
                        }
                });
        });
    };

    module.exports.delete = function (req, res){
        logger.debug({action: 'delete', tablename: req.params.tablename, id: req.params.id});
        respond(req,
            res,
            function(connection){
                connection.query('DELETE FROM ' + req.params.tablename + ' WHERE ID = ?',
                    [req.params.id],
                    function (err) {
                        senders.bodyessResultIfOK(res, err, req.params.id);
                });
        });
    };

})();