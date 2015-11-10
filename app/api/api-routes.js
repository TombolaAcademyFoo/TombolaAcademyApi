(function () {
    'use strict';
    module.exports.registerRoutes = function(app){
        var responders = require('./responders');

        app.get('/:tablename', function(req,res) {
            responders.getAll(req, res);
        });

        app.get('/:tablename/:id', function(req,res){
            responders.getSingle(req, res);
        });

        app.post('/:tablename', function(req,res){
            responders.add(req, res);
        });

        app.put('/:tablename/:id', function(req,res){
            responders.update(req, res);
        });

        app.delete('/:tablename/:id', function(req,res){
            responders.delete(req, res);
        });
    }
})();