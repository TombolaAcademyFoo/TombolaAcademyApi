//TODO: not a module!
var config = require('./config'),
    express = require('express'),
    http = require('http'),
    https = require('https'),
    forceSSL = require('express-force-ssl'),
    bodyParser = require('body-parser'),

    fs = require('fs'),

    allowCors = require('./core-server/security/allow-cors'),
    requireToken = require('./core-server/security/require-token'),
    authenticator = require('./core-server/security/authenticator'),
    apiRoutes = require('./api/api-routes'),
    userRoutes = require('./users/user-routes'),
    expressWinstonLogging = require('./core-server/logging/express-winston-logging'),
    apiTokenResponses = require('./api/api-token-responses'),
    logger = require('./core-server/logging/logger')
    app = express(),
    apiRouter = express.Router(),
    userRouter = express.Router();

app.use(bodyParser.urlencoded({ type: 'text/html', extended: false}));
app.use(bodyParser.json({ type: 'application/json' }));

var handleErrors = function(err,req, res, next){
    if(err.status) {
        logger.error(err);
        res.status(err.status)
            .send({message: err.message, error: err});
    }
    else{
        next();
    }
};

var secureServer = https.createServer(
    {
        key: fs.readFileSync(config.server.ssl.keyFile),
        cert: fs.readFileSync(config.server.ssl.certFile),
        passphrase: config.server.ssl.passphrase
    },
    app),

insecureServer = http.createServer(app);


expressWinstonLogging.add(app);

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//https://www.npmjs.com/package/express-force-ssl
//http://heyrod.com/snippet/s/node-https-ssl.html
app.use(forceSSL);

//TODO: Salty Hash of password.
//TODO: User managememt
//TODO: Roles and replay attack prevention?

app.all('/*', allowCors);

app.post('/authenticate', authenticator);

apiRoutes.registerRoutes(apiRouter);
userRoutes.registerRoutes(userRouter);
apiRouter.use(requireToken(apiTokenResponses.errorResponse, apiTokenResponses.noTokenResponse));
app.use('/users', userRouter);
app.use('/api', apiRouter);

app.use(handleErrors);

secureServer.listen(config.server.port, function () {
    logger.info('API Listening on port ' + config.server.port);
});

//TODO work out why logging iud suddenly failing
insecureServer.listen();

