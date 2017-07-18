/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.viewer.editor').directive('timeDataViewerConfig',  function(urlsHelper) {

    return {
        transclude: true,
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_time_data_viewer/angular-templates/config-fields.html?" + new Date().getTime(),
        controller: function ($scope, dataService, $tastypieResource) {
            console.log("dataService",$tastypieResource)
            $scope.attributes = new $tastypieResource("geonodelayerattribute");
            $scope.instanceObj = dataService.instanceObj;
            $scope.instanceObj.config.timeDataViewer = $scope.instanceObj.config.timeDataViewer || {};
            var timeDataViewer = $scope.instanceObj.config.timeDataViewer;
            if(timeDataViewer.fromDate){
                timeDataViewer.fromDate = new Date(timeDataViewer.fromDate)
            }
            if(timeDataViewer.toDate){
                timeDataViewer.toDate = new Date(timeDataViewer.toDate)
            }
            $scope.mapLayers = [];
            var layersDict = {};
            var initialized = false;
            var populateLayers = function () {
                $scope.mapLayers = [];
                if(dataService.selected.map){
                angular.forEach(dataService.selected.map.map_layers, function (layer) {
                    if (!layer.fixed) {
                        layer.params = JSON.parse(layer.layer_params);
                        layersDict[layer.name] = layer;
                        var layerInfo = {
                            name: layer.name,
                            title: layer.params.title
                        };
                        $scope.mapLayers.push(layerInfo);
                    }
                });
            };}

            $scope.getLayerAttrs = function () {
                if (!timeDataViewer.layer) return null;
                var layer;
                angular.forEach($scope.mapLayers, function (l) {
                    if (l.name == timeDataViewer.layer) {
                        layer = l;
                        return false;
                    }
                });
                if (!layer) return null;
                if (!layer.attributes) {
                    layer.attributes = [];
                    $scope.attributes.objects.$find({layer__typename: layer.name}).then(function () {
                        angular.forEach($scope.attributes.page.objects, function (attr) {
                            if (attr.attribute_type == "xsd:dateTime") {
                                layer.attributes.push({
                                    name: attr.attribute,
                                    title: attr.attribute_label || (attr.attribute + " "), //add space to fix angular bug when name and title is the same it isn't select the attribute in the drop down
                                    type: attr.attribute_type
                                });
                            }
                        });
                    });
                }
                return layer.attributes;
            };
            dataService.onMapSelect(function () {
                populateLayers();
            });
            populateLayers();
            console.log("config",$scope.instanceObj.config.timeDataViewer)
        }

    }
});
