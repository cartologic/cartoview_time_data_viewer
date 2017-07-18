/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.timeDataViewerApp').directive('timeDataViewer',  function(urlsHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_time_data_viewer/angular-templates/time-data-viewer.html",
        controller: function ($scope, timeDataViewerService) {
            $scope.service = timeDataViewerService;
            $scope.collaped = false;
        }
  
});
