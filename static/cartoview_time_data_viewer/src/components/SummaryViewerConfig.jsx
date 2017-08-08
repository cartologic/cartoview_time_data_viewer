import React, {Component} from 'react';
import t from 'tcomb-form';

const operations = [
  'Summation',
  'Average',
  'Count',
  'Minimum',
  'Maximum',
  'Median'
]

export default class SummaryViewerConfig extends Component {

  constructor(props) {
    super(props)
    this.state = {
      layers: [],
      attributes: [],
      config: {
        summaryViewer: {
          items: [
            {
              title: "",
              layer: "",
              attribute: "",
              operation: ""
            }
          ]
        },
        // loading: false
      },
      input: ""
    }
  }

  loadLayers() {
    fetch(`/apps/maplayers/api?id=${this.props.instance.id}`).then((response) => response.json()).then((data) => {
      this.setState({layers: data.objects})
    }).catch((error) => {
      console.error(error);
    });
  }

  loadAttributes(typename) {
    if (typename != "") {
      fetch(`/apps/rest/app_manager/geonodelayerattribute/?layer__typename=${typename}`).then((response) => response.json()).then((data) => {
        this.setState({attributes: data.objects})
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  save() {
    console.log(this.state);
  }

  componentWillMount() {
    this.loadLayers()
  }

  renderNextPrevious() {
    return (
      <div className="row">
        <div className="col-xs-5 col-md-4"></div>
        <div className="col-xs-7 col-md-8">
          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={this.save.bind(this)}>{"next >>"}</button>

          <button style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className="btn btn-primary btn-sm pull-right" onClick={() => this.props.onPrevious()}>{"<< Previous"}</button>
        </div>
      </div>
    )
  }

  renderHeader() {
    return (
      <div className="row" style={{
        marginTop: "3%"
      }}>
        <div className="col-xs-5 col-md-4">
          <h4>{'Summary Viewer Configuration '}</h4>
        </div>
        <div className="col-xs-7 col-md-8">
          <a style={{
            display: "inline-block",
            margin: "0px 3px 0px 3px"
          }} className={this.state.success === true
            ? "btn btn-primary btn-sm pull-right"
            : "btn btn-primary btn-sm pull-right disabled"} href={`/apps/cartoview_map_viewer_react/${this.props.id}/view/`}>
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
            : "btn btn-primary btn-sm pull-right"} onClick={this.save.bind(this)}>Save</button>

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
            }}>App instance successfully created!</p>
        </div>
      </div>
    )
  }

  renderItemRow() {
    return (
      <div className="row">
        <form>
          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Item Title</label>
              <input value={this.state.input} onChange={(e) => {
                this.setState({input: e.target.value})
              }} type="text" className="form-control" placeholder="Item title"/>
            </div>
          </div>
          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Layer</label>
              <select className="form-control" onChange={(e) => {
                this.loadAttributes(e.target.value)
              }} required>
                <option value={""}>Select Layer</option>
                {this.state.layers && this.state.layers.map((layer, i) => {
                  return <option key={`${i}`} value={layer.typename}>{layer.title}</option>
                })}
              </select>
            </div>
          </div>
          <div className="col-xs-12 col-md-3">
            <div className="form-group">
              <label>Attribute</label>
              <select className="form-control" onChange={(e) => {
                console.log(e.target.value);
              }} required>
                <option value={""}>Select Attribute</option>
                {this.state.attributes && this.state.attributes.map((attribute, i) => {
                  // filter only numeric attributes
                  if (attribute.attribute_type.toLowerCase() != "xsd:string" && attribute.attribute_type.indexOf('gml:') == -1) {
                    return <option key={`${i}`} value={attribute.attribute}>{attribute.attribute}</option>
                  }
                })}
              </select>
            </div>
          </div>
          <div className="col-xs-12 col-md-2">
            <div className="form-group">
              <label>Operation</label>
              <select className="form-control" onChange={(e) => {
                console.log(e.target.value)
              }} required>
                <option value={""}>Operation</option>
                {operations.map((operation, index) => {
                  return <option key={`${index}`} value={operation.toLowerCase()}>{operation}</option>
                })}
              </select>
            </div>
          </div>
          <div className="col-xs-12 col-md-1">
            <label></label>
            <button type="button" className={'btn btn-danger'} style={{
              width: '100%'
            }}>X</button>
          </div>
        </form>
      </div>
    )
  }

  render() {
    return (
      <div className="row">

        {this.renderNextPrevious()}

        {this.renderHeader()}

        <hr></hr>

        {this.renderItemRow()}

        <div className="row">
          <div className="col-xs-5 col-md-4">
            <button className={'btn btn-primary'}>Add Item</button>
          </div>
        </div>
      </div>
    )
  }
}
