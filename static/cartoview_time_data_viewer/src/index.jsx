import React from 'react';
import {render, findDOMNode} from 'react-dom';
import {addLocaleData, IntlProvider} from 'react-intl';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enLocaleData from 'react-intl/locale-data/en';
import enMessages from '@boundlessgeo/sdk/locale/en';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService';
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import ol from 'openlayers';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import BaseMapModal from '@boundlessgeo/sdk/components/BaseMapModal';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import Legend from '@boundlessgeo/sdk/components/Legend';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import WpsClient from './wps-client.jsx';
import $ from "jquery";
import CustomTheme from './theme';
import './app.css';
import FloatingPanel from './floatingPanel';
injectTapEventPlugin();
addLocaleData(enLocaleData);
export default class CartoviewSummary extends React.Component {
  constructor(props) {
    super(props)
    appConfig.summaryViewer.items.map((item, i) => {
      item.id = i;
    })
    this.map = new ol.Map({
      layers: [new ol.layer.Tile({title: 'OpenStreetMap', source: new ol.source.OSM()})],
      view: new ol.View({
        center: [
          0, 0
        ],
        zoom: 3,
        minZoom: 3,
        maxZoom: 19
      })
    });

    this.wpsClient = new WpsClient({geoserverUrl: geoserver_url});
    this.state = {
      data: [],
      loading: true,
      config: {
        mapId: map_id
      }
    }
    this.map.on('moveend', () => {
      var extent = this.map.getView().calculateExtent(this.map.getSize());
      let filters = {
        minx: extent[0],
        miny: extent[1],
        maxx: extent[2],
        maxy: extent[3]
      }
      this.updateResults(filters);
    });

  }

  update(config) {
    if (config && config.mapId) {
      var url = mapUrl;
      fetch(url, {
        method: "GET",
        credentials: 'include'
      }).then((response) => {
        if (response.status == 200) {
          return response.json();
        }
      }).then((config) => {
        if (config) {
          MapConfigService.load(MapConfigTransformService.transform(config), this.map);
        }
      });

    }
  }
  componentWillMount() {
    this.update(this.state.config);
  }
  getChildContext() {
    return {muiTheme: getMuiTheme(CustomTheme)};
  }
  updateResults(extent) {
    let data = [],
      loading = true;
    this.setState({data, loading});
    appConfig.summaryViewer.items.forEach((item, i) => {
      if (extent != undefined) {
        this.wpsClient.aggregateWithFilters({aggregationAttribute: item.attribute, aggregationFunction: item.operation, filters: extent, typeName: item.layer}).then((res) => {
          data.push({value: res.AggregationResults[0][0],id:item.id, title: item.title});
          if (data.length == appConfig.summaryViewer.items.length) {
            loading = false;
          }
          this.setState({data, loading})
          $(".se-pre-con").fadeOut("slow");

        });
      } else {
        this.wpsClient.aggregate({aggregationAttribute: item.attribute, aggregationFunction: item.operation, typeName: item.layer}).then((res) => {
          data.push({value: res.AggregationResults[0][0], title: item.title});
          if (data.length == appConfig.summaryViewer.items.length) {
            loading = false;
          }
          this.setState({data, loading})
          $(".se-pre-con").fadeOut("slow");

        });
      }

    });

  }
  componentDidMount() {
    this.map.setTarget(findDOMNode(this.refs.map));
    this.updateResults(undefined);

  }
  _toggleBaseMapModal() {
    this.refs.basemapmodal.getWrappedInstance().open();
  }
  render() {
    const basemap_button = appConfig.showBasemapSwitcher
      ? <FloatingActionButton className="basemap_button" onTouchTap={this._toggleBaseMapModal.bind(this)} mini={true}>
          <i className="fa fa-map" aria-hidden="true"></i>
        </FloatingActionButton>
      : "";
    const base_map_modal = appConfig.showBasemapSwitcher
      ? <BaseMapModal ref='basemapmodal' map={this.map}/>
      : "";
    let layerlist = appConfig.showLayerSwitcher
      ? <LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={this.map}/>
      : '';
    let legend_elements = appConfig.showLegend
      ? <IconMenu menuStyle={{
          width: 'auto'
        }} iconButtonElement={< FloatingActionButton mini = {
          true
        } > <i className="fa fa-square-o"></i> < /FloatingActionButton>} anchorOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }} targetOrigin={{
          horizontal: 'left',
          vertical: 'top'
        }}>
          <Legend map={this.map}/>
        </IconMenu>
      : '';
    let zoom = appConfig.showZoombar
      ? <Zoom map={this.map}/>
      : '';

    return (
      <div className="full-height-width">
        {basemap_button}
        <div ref="map" className="map"></div>
        <FloatingPanel data={this.state.data} loading={this.state.loading}></FloatingPanel>
        {layerlist}
        {base_map_modal}
        {zoom}
        <div className="legends">{legend_elements}</div>
      </div>

    )
  }
}
CartoviewSummary.childContextTypes = {
  muiTheme: React.PropTypes.object
};
render(
  <IntlProvider locale='en' messages={enMessages}>
  <CartoviewSummary></CartoviewSummary>
</IntlProvider>, document.getElementById('root'))
