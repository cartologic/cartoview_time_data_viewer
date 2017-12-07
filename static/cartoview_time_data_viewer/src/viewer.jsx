import React from 'react';
import ReactDOM from 'react-dom';
import CartoviewViewerDebug from './webapp_builder_debug';
import {IntlProvider} from 'react-intl';
class Viewer {
  constructor(domId, config, username, keywords, access) {
    this.domId = domId;
    this.mapConfig = config;
    this.keywords = keywords;
    this.access = access;
  }

  set config(value) {
    this.mapConfig = config;
  }

  view() {
    ReactDOM.render(
      <IntlProvider locale='en'>
      <CartoviewViewerDebug config={this.mapConfig} keywords={this.keywords} access={this.access}/>
    </IntlProvider>, document.getElementById(this.domId));
  }
}
module.exports = Viewer;
let viewer = new Viewer('main');
viewer.view();
