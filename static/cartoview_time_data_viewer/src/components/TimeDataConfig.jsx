import React, {Component} from 'react'

import Spinner from 'react-spinkit'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import dateformat from 'dateformat'

export default class TimeDataConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      layers: [],
      attributes: [],
      config: {
        timeDataViewer: {
          timeSliderTitle: this.props.config
            ? this.props.config.timeDataViewer.timeSliderTitle
            : "",
          layer: this.props.config
            ? this.props.config.timeDataViewer.layer
            : "",
          attribute: this.props.config
            ? this.props.config.timeDataViewer.attribute
            : "",
          fromDate: this.props.config
            ? dateformat(new Date(this.props.config.timeDataViewer.fromDate), 'yyyy-mm-dd')
            : "",
          toDate: this.props.config
            ? dateformat(new Date(this.props.config.timeDataViewer.toDate), 'yyyy-mm-dd')
            : "",
          stepDuration: this.props.config
            ? this.props.config.timeDataViewer.stepDuration
            : ""
        }
      },
      loading: false
    }
  }

  loadLayers() {
    fetch(this.props.urls.mapLayers + "?id=" + this.props.resource.id).then((response) => response.json()).then((data) => {
      this.setState({layers: data.objects})
    }).catch((error) => {
      console.error(error);
    });
  }

  loadAttributes(_typename) {
    let typename = typeof _typename == 'string'
      ? _typename
      : this.refs.layer.value != ''
        ? this.refs.layer.value
        : () => {
          this.setState({attributes: []})
          return null
        }
        this.setState({loading: true})
    if (typename != "") {
      fetch(this.props.urls.layerAttributes + "?layer__typename=" + typename).then((response) => response.json()).then((data) => {
        this.setState({attributes: data.objects, loading: false})
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  componentDidMount() {
    this.loadLayers()
    if (this.props.instance) {
      this.loadAttributes(this.props.config.timeDataViewer.layer);
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({success: nextProps.success})
  }
  handleSubmit() {
    this.refs.submitButton.click()
  }
  save(e) {
    e.preventDefault();
    let config = {
      timeDataViewer: {
        timeSliderTitle: this.state.config.timeDataViewer.timeSliderTitle,
        layer: this.state.config.timeDataViewer.layer,
        attribute: this.state.config.timeDataViewer.attribute,
        fromDate: new Date(this.state.config.timeDataViewer.fromDate),
        toDate: new Date(this.state.config.timeDataViewer.toDate),
        stepDuration: new Number(this.state.config.timeDataViewer.stepDuration)
      }
    }
    this.props.onComplete(config)
  }
  render() {
    return (
      <div className="row">
        <div className="row">
          <div className="col-xs-5 col-md-4"></div>
          <div className="col-xs-7 col-md-8">
            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className="btn btn-primary btn-sm pull-right disabled" onClick={this.save.bind(this)}>{"next >>"}</button>

            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className="btn btn-primary btn-sm pull-right" onClick={() => this.props.onPrevious()}>{"<< Previous"}</button>
          </div>
        </div>

        <div className="row" style={{
          marginTop: "3%"
        }}>
          <div className="col-xs-5 col-md-4">
            <h4>{'Time Data Configrations '}</h4>
          </div>
          <div className="col-xs-7 col-md-8">
            <a style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right"
              : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/cartoview_time_data_viewer/${this.props.id}/view/`}>
              View
            </a>

            <a style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right"
              : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/appinstance/${this.props.id}/`} target={"_blank"}>
              Details
            </a>

            <button style={{
              display: "inline-block",
              margin: "0px 3px 0px 3px"
            }} className={this.state.success === true
              ? "btn btn-primary btn-sm pull-right disabled"
              : "btn btn-primary btn-sm pull-right"} onClick={this.handleSubmit.bind(this)}>Save</button>

            <p style={this.state.success == true
              ? {
                display: "inline-block",
                margin: "0px 3px 0px 3px",
                float: "right"
              }
              : {
                display: "none",
                margin: "0px 3px 0px 3px",
                float: "right"
              }}>App instance successfully saved!</p>
          </div>
        </div>
        <hr></hr>

        <form ref="form" onSubmit={this.save.bind(this)}>
          <div className="row">
            <div className="col-xs-12 col-md-12">
              <div className="form-group">
                <label>Item Title</label>
                <input type="text" className="form-control" value={this.state.config.timeDataViewer.timeSliderTitle} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.timeSliderTitle = e.target.value;
                  this.setState({config: config});
                }} required/>
              </div>
            </div>

            <div className="col-xs-12 col-md-12">
              <div className="form-group">
                <label>Layer</label>
                <select className="form-control" ref="layer" value={this.state.config.timeDataViewer.layer} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.layer = e.target.value;
                  this.setState({
                    config: config
                  }, () => {
                    this.loadAttributes()
                  })
                }} required>
                  <option value={""}>Select Layer</option>
                  {this.state.layers && this.state.layers.map((layer, i) => {
                    return <option key={layer.id} value={layer.typename}>
                      {layer.title}
                    </option>
                  })}
                </select>
              </div>
            </div>

            <div className="col-xs-12 col-md-12">
              <div className="form-group">
                <label>Time Atrribute</label>

                <select className="form-control" value={this.state.config.timeDataViewer.attribute} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.attribute = e.target.value;
                  this.setState({config: config})
                }} ref="attribute" required>
                  <option value={""}>Select Attribute</option>

                  {this.state.layers && this.state.attributes && this.state.attributes.map((attribute) => {
                    if (attribute.attribute_type == "xsd:dateTime") {
                      return <option key={attribute.id} value={attribute.attribute}>
                        {attribute.attribute || attribute.attribute_label}
                      </option>
                    }
                  })}

                </select>
                {!this.state.loading && this.state.layers > 0 && this.state.attributes.length == 0 && <button type="button" className="btn btn-info" data-toggle="modal" data-target="#numericTypes">!</button>}
                {this.state.loading && <Spinner name="line-scale-pulse-out" color="steelblue"/>}
                <p style={{
                  width: "100%",
                  backgroundColor: "lightgoldenrodyellow",
                  textAlign: 'center',
                  marginTop: '1%'
                }}>
                  <strong>Warning:</strong>This app requires enabled time field in geoserver, please contact administrator to enable the time field in your layer
                </p>
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <div className="form-group">
                <label>From Date</label>
                <input type="date" className="form-control" value={this.state.config.timeDataViewer.fromDate} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.fromDate = e.target.value;
                  this.setState({config: config})
                }} required/>
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <div className="form-group">
                <label>To Date</label>
                <input type="date" className="form-control" value={this.state.config.timeDataViewer.toDate} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.toDate = e.target.value;
                  this.setState({config: config})
                }} required/>
              </div>
            </div>

            <div className="col-xs-12 col-md-6">
              <div className="form-group">
                <label>Step Duration (Days)</label>
                <input type="number" className="form-control" min="1" value={this.state.config.timeDataViewer.stepDuration} onChange={(e) => {
                  let config = this.state.config;
                  config.timeDataViewer.stepDuration = e.target.value;
                  this.setState({config: config});
                }} required/>
              </div>
            </div>

            <input ref="submitButton" type="submit" className="btn btn-primary" value="Submit" style={{
              display: "none"
            }}/>
          </div>
        </form>
      </div>
    )
  }
}
