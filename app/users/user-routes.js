(function () {
    'use strict';
    var requireToken = require('../core-server/security/require-token');
    var usersTokenResponses = require('./users-token-responses');

    module.exports.registerRoutes = function(app){
        var path = require('path'),
            directory = __dirname + '/site/',
            requireTokenForUrl = requireToken(usersTokenResponses.errorResponse, usersTokenResponses.noTokenResponse)


        app.get('/', function(req,res) {
            res.sendFile(path.join(directory + 'index.html'));
        });

        app.get('/add', function(req,res, next) {
            requireTokenForUrl(req, res, next);
            res.sendFile(path.join(directory + 'index.html'));

        });

        app.get('/')
    }
})();