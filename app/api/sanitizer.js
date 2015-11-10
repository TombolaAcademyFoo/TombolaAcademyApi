(function () {
    'use strict';
    var config = require('../config');
    module.exports.isTableWhitelisted = function (tableName) {
        return config.api.whitelist.indexOf(tableName) > -1;
    };
    module.exports.isValidId = function (id) {
        if (id) {
            return config.api.idRegex.test(id);
        }
        return true;
    }
})();