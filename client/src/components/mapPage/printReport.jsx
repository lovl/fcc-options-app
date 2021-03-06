var React = require('react');
var connect = require('react-redux').connect;

var TableElem = React.createClass({
  render: function () {
    var name = this.props.consumer.name;
    return (
      <tr>
        <td>{this.props.index}</td>
        <td>
          {this.props.consumer.name}
          {this.props.consumer.hasWheelchair ? <i className="fa fa-wheelchair mleft-8px"></i>: null }
          {this.props.consumer.hasMedications ? <i className="fa fa-medkit mleft-8px"></i>: null }
        </td>
      </tr>
    )
  }
})

var TableBody = React.createClass({
  render: function () {
    return (
      <tbody>
        {
          this.props.consumersIds.map(function(id, index){
            var consumer = this.props.consumers[id];
            return (
              <TableElem index={index+1} consumer={consumer} key={"tr-"+index}/>
            )
          }.bind(this))
        }
      </tbody>
    )
  }
})


var PrintReport = React.createClass({

  render: function () {
    var tables=[];
    var vehiclesCount = 0;
    this.props.vehiclesIds.forEach(function(id, index) {
      var vehicle = this.props.vehicles[id];
      var tableClass="table";
      if(vehicle.consumers.length) {
        if(vehiclesCount > 0 && vehiclesCount % 3 === 0) {
          tableClass += " clear";
        }
        vehiclesCount++;
        var vDesc = vehicle.name + ' - ' + vehicle.seats +'S';
        if(vehicle.flexSeats) {vDesc += (' ' + vehicle.flexSeats + 'F')}
        if(vehicle.wheelchairs) {vDesc += (' ' + vehicle.wheelchairs+ 'W')}
        var t = (
          <table className={tableClass} key={"report-"+index}>
            <thead>
              <tr>
                <th colSpan="2" className="bus-name">
                  {vDesc}
                </th>
              </tr>
              <tr>
                <th className="ind-col">#</th>
                <th>Name</th>
              </tr>
            </thead>
            <TableBody
              consumersIds={vehicle.consumers}
              consumers={this.props.consumers}
            />
          </table>
        )
        tables.push(t);
      }
    }.bind(this));
    return (
      <div id="print-report">
        <h3>Options, Inc. - Vehicles Report | { (new Date()).toDateString()}</h3>
        <div><strong>Legend</strong></div>
        <div>Vehicle Header: S - Seats, F - Flex Seats, W - Wheelchairs</div>
        <div>Consumer: <i className="fa fa-wheelchair"></i> - Wheelchair, <i className="fa fa-medkit"></i> - Medications </div>
        {
          tables.map(function(t, index) {
            return t
          })
        }
      </div>
    )
  }
})

var mapStateToProps = function(state){
  return {
    consumers: state.consumers.data,
    vehicles: state.vehicles.data,
    vehiclesIds: state.vehicles.ids
  }
}

var PrintReportCnt = connect(mapStateToProps)(PrintReport);
module.exports = PrintReportCnt;
