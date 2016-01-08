(function () {
    'use strict';
    var logger = require('../core-server/logging/logger');

    var errorResult = function (res, error, statusCode) {
        statusCode = statusCode ? statusCode : 500;
        logger.error({status: statusCode, error: error});
        res.statusCode = statusCode;
        res.send({
            result: 'error',
            err: error
        });
    };

    var bodyessResultIfOK = function (res, err, id) {
        if (err) {
            errorResult(res, err.code);
        }
        else {
            res.statusCode = 201;
            res.send({result: 'success', err: '', id: id});
        }
    };

    var getResultIfOK = function (res, rows, fields) {
        if (rows.length === 0) {
            logger.error({status: 404});
            res.sendStatus(404);
        }
        else {
            res.send(
                {
                    result: 'success',
                    err: '',
                    fields: fields,
                    json: rows,
                    length: rows.length
                }
            );
        }
    };

    module.exports.errorResult = errorResult;
    module.exports.bodyessResultIfOK = bodyessResultIfOK;
    module.exports.getResultIfOK = getResultIfOK;
})();