(function () {
    'use strict';
    var senders = require('./senders');
    var sanitizer = require('./sanitizer');
    var connectionPool = require('../core-server/database/connection-pool');
    var logger = require('../core-server/logging/logger');
    var respond = function(req, res, callback) {
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
        };

    var getResponder = function(connection, res, query, queryParams) {
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
    };

    var getSingleOnConnection = function (res, req, connection) {
        var whereClause = buildWhereClause({ id: req.params.id});
        var query = 'SELECT * FROM ' + req.params.tablename + whereClause.clause;
        getResponder(connection, res, query, whereClause.values);
    };

    var buildWhereClause = function(criteria) {
        var result = {
            clause: '',
            values: [],
            hasCriteria:function(){return this.values.length > 0;}
        };

        for(var key in criteria){
            if(result.hasCriteria()){
                result.clause += ' AND';
            }
            else{
                result.clause += ' WHERE'
            }
            result.clause += ' ' + key + ' = ?'
            result.values.push(criteria[key]);
        }
        return result;
    };

    module.exports.getAll =  function(req, res) {
        logger.debug({action: 'getAll', tablename: req.params.tablename});
        var whereClause = buildWhereClause(req.query);
        var query = 'SELECT * FROM ' + req.params.tablename;
        if(whereClause.hasCriteria()) {
            query += whereClause.clause;
        };
        respond(req,
            res,
            function (connection) {
                //TODO: pagination?
                getResponder(connection, res,  query, whereClause.values);
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