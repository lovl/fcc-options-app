'use strict';

var utils = require('../../utils');
var expect = require('expect.js');
var Vehicle = require('../../../app/models/vehicle');
var Consumer = require('../../../app/models/consumer');


describe('Vehicle: models', function() {


  describe('#save()', function() {
    it('should save a new Vehicle', function(done) {
      // Create a User object to pass to User.create()
      var v = new Vehicle({
        name: "test",
        seats: 1
      });
      v.save(function(err, createdVehicle) {
        // verify that the returned user is what we expect
        expect(v.name).to.be.equal(createdVehicle.name);
        expect(v.seats).to.be.equal(createdVehicle.seats);
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
    it('should have an error when putting empty name', function(done) {
      var v = new Vehicle({
        seats: 1
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.name.path).to.be.equal('name');
        expect(err.errors.name.kind).to.be.equal('required');

        done();
      });
    });

    it('should have an error when putting empty seats', function(done) {
      var v = new Vehicle({
        name: 'name'
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.seats.path).to.be.equal('seats');
        expect(err.errors.seats.kind).to.be.equal('required');

        done();
      });
    });
    it('should have an error when putting negative seats', function(done) {
      var v = new Vehicle({
        name: 'name',
        seats: -1
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.seats.path).to.be.equal('seats');
        expect(err.errors.seats.kind).to.be.equal('min');

        done();
      });
    });
    it('should have an error when putting negative foldable seats', function(done) {
      var v = new Vehicle({
        name: 'name',
        seats: 1,
        flexSeats: -1
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.flexSeats.path).to.be.equal('flexSeats');
        expect(err.errors.flexSeats.kind).to.be.equal('min');

        done();
      });
    });
    it('should have an error when putting negative wheelchairs', function(done) {
      var v = new Vehicle({
        name: 'name',
        seats: 1,
        wheelchairs: -1
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.wheelchairs.path).to.be.equal('wheelchairs');
        expect(err.errors.wheelchairs.kind).to.be.equal('min');

        done();
      });
    });

    it('should have an error when putting nonexisting consumers', function(done) {
      var consumer = new Consumer();
      var consumers = [];
      consumers.push(consumer._id);
      var v = new Vehicle({
        name: 'name',
        seats: 1,
        consumers:consumers
      });
      v.save(function(err, createdVehicle) {
        expect(err.errors.consumers.path).to.be.equal('consumers');
        expect(err.errors.consumers.message).to.be.equal('consumers references a non existing ID');
        expect(err.errors.consumers.kind).to.be.equal('user defined');

        done();
      });
    });

    it('should have no errors when putting existing consumers', function(done) {
      var consumer = new Consumer({
        name:'name',
        sex:'male',
        address:'12412421421'
      });
      consumer.save(function(err, savedConsumer){
        var consumers = [];
        consumers.push(consumer._id);
        var v = new Vehicle({
          name: 'name',
          seats: 1,
          consumers:consumers
        });
        v.save(function(err, createdVehicle) {
          expect(err).to.be(null);
          expect(createdVehicle.consumers[0]).to.be.equal(consumer._id);
          done();
        });
      });
    });


  });


});
