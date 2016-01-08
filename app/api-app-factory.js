(function () {
    'use strict';

    module.exports = function (express) {
        var forceSSL = require('express-force-ssl');
        var bodyParser = require('body-parser');
        var expressWinstonLogging = require('./core-server/logging/express-winston-logging');
        var errorHandler = require('./core-server/error/request-error-handler');
        var allowCors = require('./core-server/security/allow-cors');
        var app = express();

        expressWinstonLogging.add(app);
        app.use(errorHandler);

        app.use(forceSSL);
        app.use(bodyParser.urlencoded({type: 'text/html', extended: false}));
        app.use(bodyParser.json({type: 'application/json'}));
        app.all('/*', allowCors);
        return app;
    };
})();