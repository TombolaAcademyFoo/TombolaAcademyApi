(function () {
    //TODO: x-token not being checked - doesn't even seem to be necessary.
    //https://www.npmjs.com/package/express-force-ssl
    //http://heyrod.com/snippet/s/node-https-ssl.html
    var config = require('./config');
    var express = require('express');
    var http = require('http');
    var https = require('https');
    var forceSSL = require('express-force-ssl');
    var bodyParser = require('body-parser');
    var fs = require('fs');

    var allowCors = require('./core-server/security/allow-cors');
    var requireToken = require('./core-server/security/require-token');
    var authenticator = require('./core-server/security/authenticator');
    var apiRoutes = require('./api/api-routes');
    //var userRoutes = require('./users/user-routes');
    var expressWinstonLogging = require('./core-server/logging/express-winston-logging');

    var apiTokenResponses = require('./api/api-token-responses');

    var errorHandler = require ('./core-server/error/request-error-handler');

    app = express(),
        apiRouter = express.Router(),
        userRouter = express.Router();

    app.use(errorHandler);

    app.use(forceSSL);
    app.use(bodyParser.urlencoded({type: 'text/html', extended: false}));
    app.use(bodyParser.json({type: 'application/json'}));

    var secureServer = https.createServer(
            {
                key: fs.readFileSync(config.server.ssl.keyFile),
                cert: fs.readFileSync(config.server.ssl.certFile),
                passphrase: config.server.ssl.passphrase
            },
            app),

        insecureServer = http.createServer(app);


    expressWinstonLogging.add(app);

    //app.use(bodyParser.urlencoded({extended: false}));
    //app.use(bodyParser.json());


//TODO: Salty Hash of password. https://github.com/ncb000gt/node.bcrypt.js
//TODO: User managememt
//TODO: Roles and replay attack prevention?

    app.all('/*', allowCors);
    apiRouter.use(requireToken(apiTokenResponses.errorResponse, apiTokenResponses.noTokenResponse));
    app.post('/authenticate', authenticator);

    apiRoutes.registerRoutes(apiRouter);
    app.use('/api', apiRouter);

    //userRoutes.registerRoutes(userRouter);
    //app.use('/users', userRouter);




    secureServer.listen(config.server.port, function () {
        var logger = require('./core-server/logging/logger');
        logger.info('API Listening on port ' + config.server.port);
    });

    //TODO work out why logging iud suddenly failing
    insecureServer.listen();
})();

