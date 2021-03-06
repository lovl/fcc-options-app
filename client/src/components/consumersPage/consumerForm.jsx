'use strict'

var React = require('react');
var Message = require('../message.jsx');

/**
* Form to handle Consumer Create/Update
* Author: Em-Ant
*
* When tried to implement this form as a Redux Container,
* i discovered that ICheck checkboxes doesn't respond to onChange handler.
* This form is a Passive 'Dumb' component, responding only to props
* received from parent component.
* I had to use jquery to update the select2 and ICheck form elements,
* because they are handled by jQuery plugins.
* I don't know if it's the best way to do it, or if it's a good 'React' solution
*/


var ConsumerForm = React.createClass({
  setDefaults: function (props) {

    // handle component from Plugins
    $(".select2").val(props.defaults.sex).trigger("change");

    $('input.icheck').iCheck('uncheck');

    if(props.defaults.hasWheelchair) $('#c_wheel').iCheck('check');
    if(props.defaults.hasSeizures) $('#c_seiz').iCheck('check');
    if(props.defaults.hasMedications) $('#c_med').iCheck('check');
    if(props.defaults.needsWave) $('#c_wave').iCheck('check');
    if(props.defaults.needsTwoSeats) $('#c_twoseat').iCheck('check');
    if(props.defaults.behavioralIssues) $('#c_behavior').iCheck('check');

    // Handle inputs
    $('#c_name').val(props.defaults.name);
    $('#c_address').val(props.defaults.address);
    $('#c_phone').val(props.defaults.phone);
    $('#c_notes').val(props.defaults.notes);
  },
  handleSubmit: function(e) {

    // This function needs validation
    e.preventDefault();
    var newConsumer = {};
    newConsumer._id = this.props.defaults._id;

    newConsumer.name = this.refs.name.value || '';
    newConsumer.address = this.refs.address.value;
    newConsumer.phone = this.refs.phone.value;
    newConsumer.sex = this.refs.sex.value || '';
    newConsumer.notes = this.refs.notes.value;

    newConsumer.needsWave = this.refs.wave.checked;
    newConsumer.hasSeizures = this.refs.seiz.checked;
    newConsumer.hasWheelchair = this.refs.wheel.checked;
    newConsumer.needsTwoSeats = this.refs.twoSeats.checked;
    newConsumer.hasMedications = this.refs.med.checked;
    newConsumer.behavioralIssues = this.refs.behavior.checked;

    this.props.buttonHandles(newConsumer)
  },
  componentDidMount: function () {
    $('input.icheck').iCheck({
      checkboxClass: 'icheckbox_square-blue',
      radioClass: 'iradio_square-blue',
      increaseArea: '20%' // optional
    });

    $(".select2").select2()
    // prevents setting old default values while submitting an edit/add request
    if(!this.props.loading){
      this.setDefaults(this.props);
    }
  },

  componentWillReceiveProps : function(nextProps) {
    // prevents setting old default values while submitting an edit/add request
    if(!nextProps.loading){
      this.setDefaults(nextProps);
    }
  },
  render: function() {
    var boxClass = this.props.verb === "Edit" ? "box box-warning" : "box box-info";
    return (
          <div className="row">
            <div className="col-lg-6">
              <div className={boxClass}>
                <div className="box-header with-border">
                  <h3 className="box-title">{this.props.verb} a Consumer</h3>
                  <div className="box-tools pull-right">
                    <button type="button" className="btn btn-box-tool" onClick={this.props.onClose} >
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                </div>
                {this.props.msg
                  ? <Message message={{msg: this.props.msg, type: 'error'}}/>
                  : null}
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                  <div className="box-body">
                    <div className="form-group">
                      <label htmlFor="c_name" className="col-sm-2 control-label">Name</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control"
                          id="c_name" placeholder="Name" ref="name" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_sex" className="col-sm-2 control-label">Sex</label>
                      <div className="col-sm-10">
                        <select className="form-control select2"
                          style={{'width': '100%'}}  id="c_sex" ref="sex">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_address" className="col-sm-2 control-label">Address</label>
                      <div className="col-sm-10">
                        <input type="text" id="c_phone" className="form-control"
                          id="c_address" placeholder="Address" ref="address"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_phone" className="col-sm-2 control-label">Phone</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" id="c_phone"
                          placeholder="Phone" ref="phone"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_notes" className="col-sm-2 control-label">Notes</label>
                      <div className="col-sm-10">
                        <textarea className="form-control" id="c_notes"
                          placeholder="Notes" ref="notes"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_wheel" className="col-sm-2 control-label">
                        Wheelchair</label>
                      <div className="col-sm-4">
                        <input type="checkbox" id="c_wheel" className="minimal icheck"
                          ref="wheel" />
                      </div>
                      <label htmlFor="c_twoseat" className="col-sm-3 control-label">Two Seats</label>
                      <div className="col-sm-3">
                        <input type="checkbox" id="c_twoseat" className="minimal icheck" ref="twoSeats"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_wave" className="col-sm-2 control-label">Needs Wave</label>
                      <div className="col-sm-4">
                        <input type="checkbox" id="c_wave" className="minimal icheck" ref="wave"/>
                      </div>
                      <label htmlFor="c_behavior" className="col-sm-3 control-label">Behavioral Issues</label>
                      <div className="col-sm-3">
                        <input type="checkbox" id="c_behavior" className="minimal icheck" ref="behavior"/>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="c_seiz" className="col-sm-2 control-label">Seizures</label>
                      <div className="col-sm-4">
                        <input type="checkbox" id="c_seiz" className="minimal icheck" ref="seiz"/>
                      </div>
                      <label htmlFor="c_med" className="col-sm-3 control-label">Medications</label>
                      <div className="col-sm-3">
                        <input type="checkbox" id="c_med" className="minimal icheck" ref="med"/>
                      </div>
                    </div>

                  </div>
                  <div className="box-footer">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>

                </form>
                {this.props.loading ?
                <div className="overlay">
                  <i className="fa fa-refresh fa-spin"></i>
                </div>
                : null }
                </div>
              </div>
            </div>
    )
  }
});
module.exports = ConsumerForm;
