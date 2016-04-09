'use strict'

var React = require('react');
var connect = require('react-redux').connect;
var cActions = require('../../actions/consumerActions');
var mActions = require('../../actions/mapActions');
var ICON_URL = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|";

// COLORS
var RED = "FE7569";     //options inc address
var YELLOW = "FFD42A";  //assigned to a vehicle
var GREEN = "5AA02C";   //assigned to current selected vehicle
var BLUE = "0088AA";
var GRAY = "A6A6A6";    //unassigned user
var WHITE = "FFFFFF"    // loading state

var VehiclePanel = require('./vehiclePanel.jsx')

var _addFlags = require('../../utils/addConsumerFlags');

var _generateInfoBoxContent = function (consumer, v_onBoard) {
  var content = "<div>" + consumer.name + "</div>" + "<div>" + consumer.address + "</div>";

  // add flags div
  var flags = _addFlags(consumer);
  if(flags.needs) {
    content += '<div>' + 'Needs : ' + flags.flagsString + '</div>';
  }

  if (v_onBoard) {
    // assigned to a bus
    content += 'Vehicle: ' + v_onBoard.name + '</div>';
  }

  return content;
};

/**
* TODO:
* 1. Handle driving directions
* 2. Include bus with foldable seats
* 3. If possible give a better structure to this file
*/

var ConsumerMap = React.createClass({
  map: null,
  consumersToVehiclesMap: null,
  markers: null,
  infoBoxes: null,
  componentDidMount: function() {
    var positionHome = this.props.homePosition
    this.map = new google.maps.Map(document.getElementById('test-map'), {
      center: positionHome,
      zoom: 12
    });
    var iconHome = ICON_URL + RED;
    var markerHome = new google.maps.Marker(
      {
        position: positionHome,
        map: this.map,
        title: "Options, Inc.",
        icon: iconHome
      });

    this.mapConsumersToVehicles();
    this.showConsumersMarker();
  },
  setMarkersColorOnActiveBusChange: function (
    nextActiveVehicleId, currActiveVehicleId) {

    var self = this;
    if (nextActiveVehicleId) {
      // next state has an active vehicle
      var prevActiveVehicle = null;
      var consumersOnPrevActive = [];
      if (currActiveVehicleId) {
        // there is a previously active vehicle. Reset its markers
        prevActiveVehicle = this.props.vehicles[currActiveVehicleId];
        consumersOnPrevActive = prevActiveVehicle.consumers;
      }
      consumersOnPrevActive.forEach(function(c_id){
        self.markers[c_id].setIcon(ICON_URL + YELLOW);
      })
      // set markers for next active vehicle
      var nextActiveVehicle = this.props.vehicles[nextActiveVehicleId];
      var consumersOnNextActive = nextActiveVehicle.consumers;
      consumersOnNextActive.forEach(function(c_id){
        self.markers[c_id].setIcon(ICON_URL + GREEN);
      })
    } else {
      // vehicle deactivated: all vehicle inactive
      var prevActiveVehicle = this.props.vehicles[currActiveVehicleId];
      var consumersOnPrevActive = prevActiveVehicle.consumers;
      consumersOnPrevActive.forEach(function(c_id){
        self.markers[c_id].setIcon(ICON_URL + YELLOW);
      })
    }
  },
  componentWillReceiveProps: function(nextProps) {

    // Make markers be 'event driven' is possible only here
    if (nextProps.activeVehicleId !== this.props.activeVehicleId) {
      // active vehicle status has changed
      this.setMarkersColorOnActiveBusChange(
        nextProps.activeVehicleId,
        this.props.activeVehicleId
      );
    }

    if (nextProps.markerLoading && !this.props.markerLoading) {
      // a marker/consumer is in put loading state
      console.log('marker loading');

      // set loading icon
      this.markers[nextProps.markerLoading].setIcon(ICON_URL + WHITE);
      this.markers[nextProps.markerLoading].setOpacity(0.5);
    }

    if (!nextProps.markerLoading && this.props.markerLoading) {
      // a marker/consumer is removed from loading state
      console.log('marker loading end');


      // update InfoBox
      var c_id = this.props.markerLoading;
      var content = _generateInfoBoxContent(
        this.props.consumers[c_id],
        this.props.vehicles[this.consumersToVehiclesMap[c_id]]);
      this.infoBoxes[c_id].setContent(content);

      if (this.consumersToVehiclesMap[this.props.markerLoading]) {
        // consumer is being removed from active bus

        // reset icon to GRAY - unassigned
        this.markers[this.props.markerLoading].setIcon(ICON_URL + GRAY);
        this.markers[this.props.markerLoading].setOpacity(1);

        // remove consumer/marker from the consumer -> vehicle map
        this.consumersToVehiclesMap[this.props.markerLoading] = undefined;
      } else {
        // consumer is being assigned to active bus

        // reset icon to GREEN - on active bus
        this.markers[this.props.markerLoading].setIcon(ICON_URL + GREEN);
        this.markers[this.props.markerLoading].setOpacity(1);

        // set consumer/marker in the consumer -> vehicle map to active vehicle
        this.consumersToVehiclesMap[this.props.markerLoading]
          = this.props.activeVehicleId;
      }
    }
  },
  mapConsumersToVehicles: function() {
    // NOTE this should be moved into a reducer,
    // Now this function is called on every rendering

    var self = this;
    self.consumersToVehiclesMap = {};
    this.props.vehiclesIds.forEach(function(v_id) {
      var vehicle = self.props.vehicles[v_id];
      vehicle.consumers.forEach(function(c_id){
        if(self.consumersToVehiclesMap[c_id]) {
          throw new Error ("Consumer assigned to more than one vehicle");
        } else {
          self.consumersToVehiclesMap[c_id] = v_id;
        }
      })
    })
  },
  showConsumersMarker: function() {

    var ids = this.props.consumersIds;
    var consumers = this.props.consumers;
    var vehicles = this.props.vehicles;
    var self = this;
    this.markers = {};
    this.infoBoxes = {};
    var markers = this.markers;

    ids.forEach(function(c_id, index) {
      var consumer = consumers[c_id];
      var position = consumer.position;
      var icon = ICON_URL + GRAY;

      var content = _generateInfoBoxContent(
        consumer, vehicles[self.consumersToVehiclesMap[c_id]]);

        if (self.consumersToVehiclesMap[c_id]) {
          // consumer is on board

          icon = self.props.activeVehicleId
            !== self.consumersToVehiclesMap[c_id]
            ? (ICON_URL + YELLOW)   // not on the active bus
            : (ICON_URL + GREEN);   // on the active bus
        }

      var marker = new google.maps.Marker(
        {position: position, map: self.map, title: consumer.name, icon: icon});



      var infowindow = new google.maps.InfoWindow({content: content});

      marker.addListener('mouseover', function() {
        infowindow.open(self.map, marker);
      });

      marker.addListener('mouseout', function() {
        infowindow.close();
      });

      marker.addListener('click', self.markerLeftClick.bind(null, c_id));

      markers[c_id] = marker;
      self.infoBoxes[c_id] = infowindow;
    })
  },
  markerLeftClick: function (c_id) {
    if(!this.props.markerLoading) {
      // not in loading state
      if (this.consumersToVehiclesMap[c_id]) {
        // marked consumer is on a vehicle
        if (this.consumersToVehiclesMap[c_id] == this.props.activeVehicleId) {
         // marked consumer is on the active vehicle
         console.log('on board active');

         this.props.removeConsumerFromActiveBus(c_id, this.props.activeVehicleId);
       } else {
         // marked consumer is not on the active vehicle
         console.log('on board not active');
       }
      } else {
        // marked consumer is not on a vehicle
        console.log('not on board');
        if (this.props.activeVehicleId) {
          // A vehicle is active (A Collapsible Box is open)

          // Add to active vehicle
          this.props.addConsumerToActiveBus(c_id, this.props.activeVehicleId);
        }
      }
    } else {
      console.log('markers frozen');
    }
  },

  render: function() {
    return (

          <div className="row">
            <div className="col-md-3 col-sm-4 col-xs-5">

            <VehiclePanel />
            </div>
            <div className="col-md-9 col-sm-8 col-xs-6">
              <div className="box box-widget map-height">
              <div id="test-map" className="map-height"></div>
              </div>
              <div id="directions-panel"></div>
            </div>
          </div>

    );
  }

});

var mapStateToProps = function(state){
  return{
    homePosition: state.settings.optionsIncCoords,
    consumersIds: state.consumers.ids,
    vehiclesIds: state.vehicles.ids,
    vehicles : state.vehicles.data,
    consumers: state.consumers.data,
    activeVehicleId : state.mapPage.activeVehicleId,
    markerLoading: state.mapPage.markerLoading
  }
}
var mapDispatchToProps = function(dispatch) {
  return {
    loadConsumers: function() {
      dispatch(cActions.loadConsumers());
    },
    addConsumerToActiveBus: function(c_id, active_v_id) {
      dispatch(mActions.addToActiveBus(c_id, active_v_id))
    },
    removeConsumerFromActiveBus: function(c_id, active_v_id) {
      dispatch(mActions.removeFromActiveBus(c_id, active_v_id))
    }
  }
}

var ConsumerMapContainer = connect(mapStateToProps, mapDispatchToProps)(ConsumerMap);
module.exports = ConsumerMapContainer;