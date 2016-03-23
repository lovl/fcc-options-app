'use strict';

var Route = require('../models/routes.js');

function RouteHandler() {

  this.addRoute = function(req, res, next) {
    //Validate input
    req.assert('name', 'Name must not be empty').notEmpty();
    req.assert('locationServed', 'Location served must not be empty').notEmpty();

    //display validation errors and exit
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json(errors[0]);
    }

    //create a new route from the request body
    var route = new Route(req.body);

    //look in the database to see if a user already exists
    Route.findOne({
      name: route.name
    }, function(err, existingRoute) {

      if(err){
        return res.status(400).json({
           msg: 'There was an error finding route'
          }); 
      }
      //if route exists, then exit
      if (existingRoute) {
        return res.status(400).json({
          msg: 'A route with that name already exists'
        });
      }
      //route doesn't exist, so put a new route in the database
      route.save(function(err) {
        if (err) {
          return res.status(400).json({
            msg: 'There was an error saving route'
          });
        }
        //return name if no error
        return res.json(route.name);
      });
    });
  }

  this.getAllRoutes = function(req, res, next) {

    //create a new route from the request body
    var route = new Route(req.body);

    Users
      .findOne({
        'twitter.id': req.user.twitter.id
      }, {
        '_id': false
      })
      .exec(function(err, result) {
        if (err) {
          throw err;
        }

        res.json(result.nbrClicks);
      });

    //look in the database to see if a user already exists
    Route.find({}).exec(function(err, result) {
      if (err) {
        return res.status(400).json({
          msg: 'There was an loading routes'
        });
      }

      res.json(result);
    });
  }
}

module.exports = RouteHandler;
