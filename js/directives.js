angular.module('app.directives', [])

.directive('bbStopwatch', ['StopwatchFactory', function(StopwatchFactory){
    return {
        restrict: 'EA',
        scope: true,
        link: function(scope, elem, attrs){   
            
            var stopwatchService = new StopwatchFactory(scope[attrs.options]);
            
            scope.startTimer = stopwatchService.startTimer; 
            scope.stopTimer = stopwatchService.stopTimer;
            scope.resetTimer = stopwatchService.resetTimer;
            
        }
    };
}]);
