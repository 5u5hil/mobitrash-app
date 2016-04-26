angular.module('app.directives', [])

        .directive('bbStopwatch', ['StopwatchFactory', function (StopwatchFactory) {
                return {
                    restrict: 'EA',
                    scope: true,
                    link: function (scope, elem, attrs) {

                        var stopwatchService = new StopwatchFactory(scope[attrs.options]);

                        scope.startTimer = stopwatchService.startTimer;
                        scope.stopTimer = stopwatchService.stopTimer;
                        scope.resetTimer = stopwatchService.resetTimer;

                    }
                };
            }])
        .directive("ngFileModel", [function () {
                return {
                    scope: {
                        ngFileModel: "="
                    },
                    link: function (scope, element, attributes) {
                        element.bind("change", function (changeEvent) {
                            var reader = new FileReader();
                            reader.onload = function (loadEvent) {
                                var res = loadEvent.target.result.split(',')
                                scope.$apply(function () {
                                    scope.ngFileModel = {
                                        lastModified: changeEvent.target.files[0].lastModified,
                                        lastModifiedDate: changeEvent.target.files[0].lastModifiedDate,
                                        name: changeEvent.target.files[0].name,
                                        size: changeEvent.target.files[0].size,
                                        type: changeEvent.target.files[0].type,
                                        data: res[1]
                                    };
                                });
                            }
                            reader.readAsDataURL(changeEvent.target.files[0]);
                        });
                    }
                }
            }])
        .directive('countdown', [
            'Util',
            '$interval',
            function (Util, $interval) {
                return {
                    restrict: 'A',
                    scope: {date: '@'},
                    link: function (scope, element) {
                        var start;
                        start = new Date(scope.date);
                        $interval(function () {
                            var diff;
                            diff = Math.floor((new Date().getTime() - start.getTime() ) / 1000);
                            return element.text(Util.dhms(diff));
                        }, 1000);
                    }
                };
            }
        ]);
