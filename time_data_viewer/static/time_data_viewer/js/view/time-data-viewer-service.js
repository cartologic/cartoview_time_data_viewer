/**
 * Created by kamal on 7/3/16.
 */
angular.module('cartoview.timeDataViewerApp').service('timeDataViewerService', function(mapService, urlsHelper, $http, appConfig, $rootScope, $timeout) {

  var service = this;

  service.timeDataViewer = appConfig.timeDataViewer;

  service.getWMSLayer = function (name) {
    var wmsLayer = null;
    angular.forEach(mapService.map.overlays, function (layer) {
      if (layer.getLayers) {
        wmsLayer = getWMSLayer(name, layer.getLayers());
      }
      else {
        var layerSource = layer.get('source');
        if (layerSource && layerSource.getParams) {
          var params = layerSource.getParams();
          if (params && params.LAYERS == name) {
            wmsLayer = layer;
          }
        }
      }
      if (wmsLayer) {
        return false
      }
    });

    return wmsLayer;
  };

  // Play temporal data
  service.playTemporal = function(layer, fromDate, toDate, stepDuration){

    var fromDateStep = fromDate.clone();
    var toDateStep = fromDate.clone().addDays(stepDuration);

    temporalLoop();

    function temporalLoop () {
      // Example time interval wms accepts
      // var time = '2016-07-02T22:00:00.000Z/2016-08-02T22:00:00.000Z'

      $timeout(function() {

        // set timeFrame for user
        fdate = fromDateStep.toISOString().substring(0, 10);
        tdate = toDateStep.toISOString().substring(0, 10);
        service.timeDataViewer.timeFrame = fdate + ' / ' + tdate;

        // set timeFrame for service
        var time = fromDateStep.toJSON() + '/' + toDateStep.toJSON();

        // update layer's source
        layer.getSource().updateParams({"time": time});

        // check if we exit the timeframe, if not increase step and iterate again
        if (toDateStep.isBefore(toDate)) {
          fromDateStep = fromDateStep.addDays(stepDuration);
          toDateStep = toDateStep.addDays(stepDuration);
          temporalLoop();
        }

      }, 2000);
    }

  }

  // set local variables
  var wmsLayer = service.getWMSLayer(service.timeDataViewer.layer);
  var fromDate = new Date(service.timeDataViewer.fromDate);
  var toDate = new Date(service.timeDataViewer.toDate);
  var stepDuration = service.timeDataViewer.stepDuration;
  // console.log('-->', fromDate, toDate, stepDuration);

  // call temporal function
  service.playTemporal(wmsLayer, fromDate, toDate, stepDuration);

});
