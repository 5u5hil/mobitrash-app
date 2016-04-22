angular.module('app.controllers', [])

        .controller('markAttendanceCtrl', function ($scope) {

        })

        .controller('scheduleForTheDayCtrl', function ($scope) {

        })

        .controller('cleaningCtrl', function ($scope) {

        })

        .controller('receiptsCtrl', function ($scope) {

        })

        .controller('getClickedCtrl', function ($scope) {

            var objCanvas = document.getElementById("video");
            window.plugin.CanvasCamera.initialize(objCanvas);

        })

        .controller('pickupDetailsCtrl', function ($scope) {

        })

        .controller('routeCtrl', function ($scope) {
            $scope.$on('$ionicView.afterEnter', function () {
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 7

                });

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.setCenter(initialLocation);
                        directionsService.route({
                            origin: initialLocation,
                            destination: "Mulund,Mumbai",
                            travelMode: google.maps.TravelMode.DRIVING
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            } else {
                                window.alert('Directions request failed due to ' + status);
                            }
                        });

                    });
                }

                directionsDisplay.setMap(map);






            });
        })
 