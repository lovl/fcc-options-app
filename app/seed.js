/**
 * Populate DB with sample data on server start
 * to disable, edit .env, and remove `SEED_DB`
 */

'use strict';

var Consumer = require('./models/consumer.js');
var User = require('./models/users.js');
var Route = require('./models/routes.js');

/**
* USERS
*/

User.find({}).remove(function() {
  User.create({
    email: 'test@test.com',
    password: '12345',
    role: 'user'
  }, {
    email: 'admin@test.com',
    password: 'admin',
    role: 'admin'
  }, {
    email: 'a@a.com',
    password: 'asdf',
    role: 'admin'
  }, function() {
    console.log('finished populating users');
  });
});

/**
* CONSUMERS
*
* model:
    name: {type: String, required: true},
    sex: {type: String, required: true, enum:['male', 'female']},
    address: {type: String, required: true},
    phone: String,

    // Details flags
    needsWave: Boolean,
    cannotSitNearOppositeSex: Boolean,
    needsTwoSeats: Boolean,
    hasSeizures: Boolean,
    hasWeelchair: Boolean,
    hasMedications: Boolean
*/
var consumer1 = new Consumer({
  name: 'John D.',
  sex: 'male',
  address: '123, Main Road, NYC',
  phone: '333-444555',
  // Details flags
  needsWave: true,
  hasWheelchair: true,
});
Consumer.find({}).remove(function() {
  consumer1.save();
  Consumer.create(
    {
    name: 'Ashley B.',
    sex: 'female',
    address: '231, Secondary Street, NYC',
    phone: '222-444555',
    hasSeizures: true,
    hasMedications: true
  }, {
    name: 'Henry F.',
    sex: 'male',
    address: '456, Wide Avenue, NYC',
    phone: '222-111989',
    needsTwoSeats: true,
    cannotSitNearOppositeSex: true,
    hasMedications: true
  }, function() {
    console.log('finished populating consumers');
  });
});


/**
* ROUTES
*
* model:
    name: {type: String, required: true},
    locationServed: {type: String}
*/


var route1 = new Route({
  name: 'Route C',
  locationServed: 'Uptown',
  vehicle: 'Van 4',
})
route1.consumers.push(consumer1);
Route.find({}).remove(function() {
  route1.save();
  Route.create({
    name: 'Route A',
    locationServed: 'Bronx',
    vehicle: 'Bus 1',

  }, {
    name: 'Route B',
    locationServed: 'Manhattan',
    vehicle: 'Van 2'
  }, {
    name: 'Route D',
    locationServed: 'Queens',
    vehicle: 'Bus 3'
  }, function() {
    console.log('finished populating routes');
  });
});