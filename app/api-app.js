(function () {
    //https://www.npmjs.com/package/express-force-ssl
    //http://heyrod.com/snippet/s/node-https-ssl.html
    var express = require('express');
    var config = require('./config');

    var http = require('http');
    var https = require('https');

    var fs = require('fs');
    var requireToken = require('./core-server/security/require-token');
    var authenticator = require('./core-server/security/authenticator');
    var apiRoutes = require('./api/api-routes');
    //var userRoutes = require('./users/user-routes');
    var apiTokenResponses = require('./api/api-token-responses');
    var app = require('./api-app-factory')(express);
    var secureServer = https.createServer(
            {
                key: fs.readFileSync(config.server.ssl.keyFile),
                cert: fs.readFileSync(config.server.ssl.certFile),
                passphrase: config.server.ssl.passphrase
            },
            app);
    var insecureServer = http.createServer(app);
    var apiRouter = express.Router();
    //var userRouter = express.Router();

    //TODO: Salty Hash of password. https://github.com/ncb000gt/node.bcrypt.js
    //TODO: User managememt
    //TODO: Roles and replay attack prevention?


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

