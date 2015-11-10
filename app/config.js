(function () {
    'use strict';
    var path = require('path');
    module.exports = {
        database : {
            host     : process.env.taApiDBHost,
            database : process.env.taApiDBName,
            user     : process.env.taApiDBUser,
            password : process.env.taApiDBPassword
        },

        server : {
            port: process.env.taApiPort,
            cors: {
                methods: 'GET,PUT,POST,DELETE,OPTIONS',
                origins: '*' //TODO: restrict domains
            },
            ssl: {
                keyFile: '/keys/tombolaApi.key',
                certFile: '/keys/tombolaApi.crt',
                passphrase: process.env.taApiSslPassPhrase
            }
        },
        //TODO: whitelist via DB?
        api : {
            whitelist: ['githubusers', 'githubrepositories'],
            idRegex: /^\d*$/
        },

        authentication: {
            secret: process.env.taApiTokenSecret,
            expiresInMinutes: process.env.taApiAuthExpiry
        },

        logging: {
            file:{
                level: 'info',
                filename: path.join(__dirname, 'logs/all-logs.log'),
                handleExceptions: true,
                json: true,
                maxsize: 5242880, //5MB
                maxFiles: 5,
                colorize: false
            },
            console:{
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true
            }
        }
    }
})();