angular.module('app.controllers', [])

        .controller('AppCtrl', function ($scope, $localstorage, $ionicPopup, $ionicLoading) {
            $scope.base = 'http://mobitrash.cruxservers.in/operator/';

            $scope.isLogin = function () {
                /// Check user login status
                if ($localstorage.uid()) {
                    return true;
                } else {
                    return false;
                }
            }
            $scope.isTempLogin = function () {
                /// Check user login status
                if ($localstorage.getObject('tempuser').id) {
                    return true;
                } else {
                    return false;
                }
            }

            $scope.alert = function (title, message, type) {
                /// Show alert dialog
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: message
                });
            };

            $scope.showLoading = function (text) {
                if (text) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon="android"></ion-spinner>' + text
                    });
                } else {
                    $ionicLoading.show({template: '<ion-spinner icon="android"></ion-spinner>'});
                }
            };
            $scope.hideLoading = function () {
                $ionicLoading.hide();
            };

            $scope.ajaxErrorMessage = function () {
                $scope.alert('Connection Error', 'Unable to Connect');
            }

            $scope.logout = function () {
                $localstorage.delete('user');
                $localstorage.delete('tempuser');
                $localstorage.delete('timerStartTime');
            }

        })
        .controller('markAttendanceCtrl', function ($scope, $state, $localstorage, $http, $cordovaCamera) {
            $scope.imageData = "";
            $scope.user = {};
            if ($localstorage.uid()) {
                $scope.user = $localstorage.getObject('user');
                $scope.showLoading();
                $http({
                    url: $scope.base + 'get-attendance',
                    method: 'POST',
                    data: {id: $localstorage.uid()}
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.attendance == false) {
                        $scope.logout();
                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.logout();
                });
            } else {
                $scope.user = $localstorage.getObject('tempuser');
            }
            $scope.login = function (formdata) {
                $scope.showLoading();
                $http({
                    url: $scope.base + 'login',
                    method: 'POST',
                    data: {id: formdata.user.id}
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.flash == 'success') {
                        if (response.data.Attendance > 0) {
                            $localstorage.setObject('user', response.data.User);
                        } else {
                            $localstorage.setObject('tempuser', response.data.User);
                        }
                        location.reload();
                    } else {
                        $scope.alert('Login Error', 'Invalid ID');

                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            }
            $scope.getCamera = function () {
                document.addEventListener("deviceready", function () {
                    var options = {
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        allowEdit: false,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 400,
                        targetHeight: 400,
                        saveToPhotoAlbum: false,
                        correctOrientation: true
                    };

                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        var image = document.getElementById('myImage');
                        image.src = "data:image/jpeg;base64," + imageData;
                        $scope.imageData = imageData;
                    }, function (err) {
                    });
                }, false);
            }

            $scope.markAttendance = function () {
                $scope.showLoading();
                $http({
                    url: $scope.base + 'attendance',
                    method: 'POST',
                    data: {id: $localstorage.getObject('tempuser').id, image_data: $scope.imageData}
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.flash == 'success') {
                        $localstorage.delete('tempuser');
                        $localstorage.setObject('user', response.data.User);
                        $scope.alert('Success', 'Attendance Marked Successfully!');
                    } else {
                        $scope.alert('Login Error', 'Invalid ID');

                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            }
        })

        .controller('scheduleForTheDayCtrl', function ($scope, $state, $localstorage, $http, $ionicHistory) {
            $ionicHistory.clearHistory();

            $scope.schedules = {};
            $scope.pickupmessage = "";
            $scope.kilometer = {};
            $scope.getstartkilometer;
            $scope.getendtkilometer;
            $scope.showendkm = false;
            $scope.startTimer = function (pickupid) {
                var today = new Date();
                var startTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                $localstorage.set('timerStartTime', startTime);
                $state.go('markAttendance2.pickupDetails', {pickupid: pickupid})
            }
            if ($localstorage.uid()) {
                $scope.showLoading();
                $http({
                    url: $scope.base + 'schedules',
                    method: 'POST',
                    data: {id: $localstorage.uid()}
                }).then(function successCallback(response) {
                    $scope.hideLoading();                    
                    if (response.data.flash == 'success') {
                        $scope.schedules = response.data.Schedules;
                        $scope.getstartkilometer = response.data.Schedules.start_kilometer;
                        $scope.getendtkilometer = response.data.Schedules.end_kilometer;
                        if(response.data.Schedules.pickups.length == 0){
                            $scope.pickupmessage = "No more pickups for today";
                        $scope.showendkm = true;
                        }
                    }else{
                        $scope.pickupmessage = "No more pickups for today";
                        $scope.showendkm = true;
                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            } else {
                $scope.pickupmessage = "Please mark your attendance first for today!";
            }
            $scope.submitStartKilometer = function (formdata) {
                formdata.kilometer.schedule_id = $scope.schedules.id;
                $http({
                    url: $scope.base + 'update-km',
                    method: 'POST',
                    data: formdata.kilometer
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.flash == 'success') {
                        $scope.getstartkilometer = response.data.start;
                        $scope.getendtkilometer = response.data.end;
                    } else {
                        $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            }            
        })

        .controller('cleaningCtrl', function ($scope, $state, $localstorage, $http) {
            $scope.cleaningDisabled = false;
            $scope.cleaning = {};
            $scope.cleaning.record = false;
            $scope.vans = {};
            $scope.showLoading();
            $scope.loginmessage;
            if (!$localstorage.uid()) {
                $scope.loginmessage = "Please mark your attendance first for today!";
            }
            $http({
                url: $scope.base + 'cleaning-data',
                method: 'POST',
                data: {id: $localstorage.uid()}
            }).then(function successCallback(response) {
                $scope.hideLoading();
                if (response.data.flash == 'success') {
                    $scope.vans = response.data.Vans;
                    if (response.data.Records > 0) {
                        $scope.cleaning.record = true;
                        $scope.cleaningDisabled = true;
                    }
                } else {
                    $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                }
            }, function errorCallback(response) {
                $scope.hideLoading();
                $scope.ajaxErrorMessage();
            });

            $scope.saveCleaning = function (cleaning) {
                if (cleaning.record && cleaning.van_id) {
                    $scope.showLoading();
                    $scope.cleaningDisabled = true;

                    var Record = {};
                    Record.added_by = $localstorage.uid();
                    Record.recordtype_id = 3;
                    Record.asset_id = cleaning.van_id;
                    $http({
                        url: $scope.base + 'save-receipt-details',
                        method: 'POST',
                        data: Record
                    }).then(function successCallback(response) {
                        $scope.hideLoading();
                        if (response.data.flash == 'success') {
                            $scope.alert('Success!', 'Data saved successfully!');
                        } else {
                            $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                        }
                    }, function errorCallback(response) {
                        $scope.hideLoading();
                        $scope.ajaxErrorMessage();
                    });
                } else {
                    $scope.alert('Van required', 'Please select Van and check cleaning!');
                }
            };
        })

        .controller('receiptsCtrl', function ($scope, $state, $localstorage, $http) {
            $scope.receiptdata = {};
            $scope.showLoading();
            $scope.ReceiptForm = {};
            $scope.ReceiptForm.Record = {};
            $scope.ReceiptForm.Record.recordtype_id = 1;
            if (!$localstorage.uid()) {
                $scope.loginmessage = "Please mark your attendance first for today!";
            }
            $http({
                url: $scope.base + 'receipt-data',
                method: 'POST',
                data: {}
            }).then(function successCallback(response) {
                $scope.hideLoading();
                if (response.data.flash == 'success') {
                    $scope.receiptdata = response.data;
                } else {
                    $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                }
            }, function errorCallback(response) {
                $scope.hideLoading();
                $scope.ajaxErrorMessage();
            });

            $scope.saveReceipt = function (formdata) {
                $scope.showLoading();
                formdata.Record.added_by = $localstorage.uid();
                $http({
                    url: $scope.base + 'save-receipt-details',
                    method: 'POST',
                    data: formdata.Record
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.flash == 'success') {
                        $scope.alert('Success!', 'Data saved successfully!');
                    } else {
                        $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            };

        })

        .controller('getClickedCtrl', function ($scope) {

            var objCanvas = document.getElementById("video");
            window.plugin.CanvasCamera.initialize(objCanvas);

        })

        .controller('pickupDetailsCtrl', function ($scope, $state, $http, $stateParams, $localstorage, Util) {
            $scope.wastetypes = {};
            $scope.pickup = {};
            $scope.additives = {};
            $scope.timerStartTime = $localstorage.get('timerStartTime');
            var startTime = new Date($localstorage.get('timerStartTime'));
            $scope.timerstartFormated = startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds();
            $scope.showLoading();
            $http({
                url: $scope.base + 'pickup-details',
                method: 'POST',
                data: {id: $stateParams.pickupid}
            }).then(function successCallback(response) {
                $scope.hideLoading();
                if (response.data.flash == 'success') {
                    $scope.wastetypes = response.data.Wastetype;
                    $scope.additives = response.data.Additive;
                    $scope.pickup = response.data.Pickup;
                } else {
                    $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                }
            }, function errorCallback(response) {
                $scope.hideLoading();
                $scope.ajaxErrorMessage();
            });

            $scope.savePickup = function (formdata) {
                $scope.showLoading();
                var startTime = new Date($localstorage.get('timerStartTime')).getTime();
                var timeNow = new Date().getTime();
                var timeTaken = Util.getTimeFormat(Math.floor(timeNow - startTime));
                formdata.Pickup.time_taken = timeTaken;
                formdata.Pickup.operator_id = $localstorage.uid();
                $http({
                    url: $scope.base + 'save-service-details',
                    method: 'POST',
                    data: {service: formdata.Pickup, pickup: $scope.pickup}
                }).then(function successCallback(response) {
                    $scope.hideLoading();
                    if (response.data.flash == 'success') {
                        $localstorage.delete('timerStartTime');
                        $localstorage.delete('startKilometer');
                        $scope.alert('Success!', 'Data saved successfully!');
                        $state.go('markAttendance2.scheduleForTheDay');
                    } else {
                        $scope.alert('Error Occured!', 'Error Occured! Please try again!');
                    }
                }, function errorCallback(response) {
                    $scope.hideLoading();
                    $scope.ajaxErrorMessage();
                });
            };
        })

        .controller('routeCtrl', function ($scope, $http, $state, $stateParams, $localstorage) {

            var marker;
            var startCoord = [];

            $scope.$on('$ionicView.afterEnter', function () {
                var icon = {
                    path: "M252.399,396.383c-3.815,0-6.907,3.092-6.907,6.907c0,3.814,3.092,6.906,6.907,6.906    c3.814,0,6.907-3.092,6.907-6.906C259.306,399.475,256.214,396.383,252.399,396.383z M252.399,415.982    c-1.617,0-2.927,1.312-2.927,2.928c0,1.617,1.311,2.928,2.927,2.928c1.617,0,2.928-1.311,2.928-2.928    C255.327,417.294,254.016,415.982,252.399,415.982z M273.214,413.132l16.767,16.768c3.909-5.51,6.635-11.917,7.812-18.852h-23.716    C273.822,411.759,273.535,412.455,273.214,413.132z M260.158,424.97v23.713c6.935-1.177,13.339-3.906,18.85-7.813l-16.768-16.768    C261.563,424.423,260.869,424.715,260.158,424.97z M273.212,393.448c0.321,0.677,0.611,1.371,0.866,2.083h23.714    c-1.177-6.935-3.905-13.341-7.813-18.851L273.212,393.448z M242.559,382.478c0.677-0.321,1.371-0.613,2.082-0.868v-23.713    c-6.934,1.177-13.339,3.905-18.85,7.813L242.559,382.478z M225.791,440.87c5.51,3.908,11.916,6.636,18.851,7.813V424.97    c-0.712-0.255-1.406-0.546-2.084-0.867L225.791,440.87z M265.093,403.288c0,1.617,1.311,2.928,2.928,2.928    s2.928-1.311,2.928-2.928c0-1.616-1.311-2.927-2.928-2.927S265.093,401.672,265.093,403.288z M239.705,403.288    c0-1.616-1.311-2.927-2.928-2.927s-2.928,1.311-2.928,2.927c0,1.617,1.311,2.928,2.928,2.928S239.705,404.905,239.705,403.288z     M279.008,365.709c-5.51-3.908-11.916-6.636-18.85-7.813v23.713c0.711,0.255,1.406,0.546,2.083,0.866L279.008,365.709z     M252.399,390.595c1.617,0,2.928-1.312,2.928-2.928c0-1.617-1.311-2.928-2.928-2.928c-1.617,0-2.927,1.311-2.927,2.928    C249.472,389.283,250.782,390.595,252.399,390.595z M252.399,327.891c-41.642,0-75.399,33.758-75.399,75.399    c0,41.641,33.757,75.398,75.399,75.398c41.641,0,75.398-33.758,75.398-75.398C327.798,361.648,294.041,327.891,252.399,327.891z     M252.399,457.146c-29.744,0-53.856-24.112-53.856-53.855c0-29.744,24.112-53.856,53.856-53.856    c29.744,0,53.855,24.112,53.855,53.856C306.255,433.033,282.143,457.146,252.399,457.146z M230.72,411.048h-23.714    c1.177,6.935,3.904,13.341,7.813,18.851l16.768-16.768C231.265,412.453,230.975,411.759,230.72,411.048z M231.584,393.446    l-16.767-16.767c-3.909,5.51-6.635,11.917-7.812,18.852h23.715C230.977,394.819,231.264,394.123,231.584,393.446z     M796.342,396.383c-3.814,0-6.907,3.092-6.907,6.907c0,3.814,3.093,6.906,6.907,6.906s6.907-3.092,6.907-6.906    C803.249,399.475,800.156,396.383,796.342,396.383z M804.1,424.97v23.713c6.935-1.177,13.341-3.904,18.851-7.813l-16.767-16.768    C805.506,424.424,804.812,424.715,804.1,424.97z M822.949,365.71c-5.51-3.908-11.915-6.637-18.85-7.813v23.713    c0.712,0.255,1.405,0.547,2.082,0.868L822.949,365.71z M817.155,413.131l16.767,16.768c3.909-5.51,6.637-11.916,7.813-18.851    h-23.714C817.767,411.759,817.476,412.453,817.155,413.131z M940.652,356.772c-2.676-7.189-12.334-4.557-15.23-9.139    c16.59-23.825-2.443-68.09-0.763-66.019c-6.258-9.752-20.398-14.986-31.526-19.883c-15.559-6.847-32.441-14.373-49.348-20.104    c-9.293-3.15-17.867-4.189-27.416-7.312c-10.953-3.581-20.769-8.661-21.522-8.661c0.271,0.248,0.535,0.491,0.81,0.741    c-0.73-0.519-0.969-0.742-0.81-0.741c-86.831-83.911-121.447-94.265-155.154-102.219c-0.828-0.195-41.427-2.437-41.427-2.437    s-360.137,0.115-463.016,0.115c-6.033,1.382-12.471,5.415-17.059,8.414c-8.871,5.8-10.008,16.563-14.012,27.415    c-8.28,22.44-29.782,81.431-29.852,194.345c-0.002,2.757-8.201,0.38-9.748,3.046c-23.61,40.707,16.817,59.703,36.554,59.705    c11.27,0,70.67,9.139,70.67,9.139h3.491c-1.481-6.054-2.272-12.377-2.272-18.887c0-43.741,35.459-79.2,79.2-79.2    c43.741,0,79.2,35.459,79.2,79.2c0,6.51-0.791,12.833-2.271,18.887h390.963c-1.592-6.234-2.439-12.766-2.439-19.496    c0-43.404,35.187-78.591,78.591-78.591c43.405,0,78.591,35.187,78.591,78.591c0,6.73-0.848,13.262-2.438,19.496h23.152    c0,0,10.372-5.148,12.794-8.529c2.309-3.224,1.834-6.563,5.483-8.529c16.377-8.83,28.008-8.8,28.024-34.727    C941.874,366.614,942.661,359.745,940.652,356.772z M704.551,210.925c-2.555,3.881-7.804,2.414-7.921,29.852    c-39.596-0.405-117.581-1.218-117.581-1.218s-0.232-92.826-0.589-94.435c-0.007,0.002-0.014,0.003-0.021,0.004    c0.007-0.036,0.014-0.034,0.021-0.004c17.021-2.842,48.971-4.055,71.26,1.222c57.918,16.805,79.257,52.489,91.784,67.757    C735.514,214.011,708.901,209.9,704.551,210.925z M786.5,382.476c0.678-0.32,1.372-0.611,2.083-0.866v-23.713    c-6.935,1.177-13.34,3.904-18.85,7.813L786.5,382.476z M817.156,393.446c0.321,0.677,0.608,1.373,0.863,2.085h23.716    c-1.177-6.935-3.903-13.342-7.813-18.852L817.156,393.446z M796.342,327.891c-41.642,0-75.398,33.758-75.398,75.399    c0,41.641,33.757,75.398,75.398,75.398s75.398-33.758,75.398-75.398C871.74,361.648,837.983,327.891,796.342,327.891z     M796.342,457.146c-29.744,0-53.856-24.112-53.856-53.855c0-29.744,24.112-53.856,53.856-53.856s53.856,24.112,53.856,53.856    C850.198,433.033,826.086,457.146,796.342,457.146z M796.342,415.982c-1.617,0-2.928,1.312-2.928,2.928    c0,1.617,1.311,2.928,2.928,2.928s2.928-1.311,2.928-2.928C799.27,417.294,797.959,415.982,796.342,415.982z M783.647,403.288    c0-1.616-1.311-2.927-2.928-2.927c-1.616,0-2.928,1.311-2.928,2.927c0,1.617,1.312,2.928,2.928,2.928    C782.337,406.216,783.647,404.905,783.647,403.288z M775.528,393.448l-16.767-16.768c-3.908,5.51-6.637,11.916-7.813,18.851    h23.714C774.917,394.819,775.208,394.125,775.528,393.448z M809.036,403.288c0,1.617,1.311,2.928,2.928,2.928    c1.616,0,2.928-1.311,2.928-2.928c0-1.616-1.312-2.927-2.928-2.927C810.347,400.361,809.036,401.672,809.036,403.288z     M796.342,390.595c1.617,0,2.928-1.312,2.928-2.928c0-1.617-1.311-2.928-2.928-2.928s-2.928,1.311-2.928,2.928    C793.414,389.283,794.725,390.595,796.342,390.595z M769.733,440.869c5.511,3.907,11.915,6.637,18.85,7.813V424.97    c-0.711-0.255-1.404-0.547-2.082-0.868L769.733,440.869z M774.664,411.048h-23.716c1.177,6.935,3.903,13.342,7.812,18.852    l16.768-16.768C775.206,412.455,774.919,411.759,774.664,411.048z",
                    fillColor: '#000',
                    fillOpacity: 1,
                    strokeWeight: 0,
                    scale: 0.03
                }
                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 12

                });

                if (navigator.geolocation) {

                    var numDeltas = 100;
                    var delay = 10; //milliseconds
                    var i = 0;
                    var deltaLat;
                    var deltaLng;
                    function transition(result) {

                        i = 0;
                        deltaLat = (result[0] - startCoord[0]) / numDeltas;
//                        console.log(position);
                        deltaLng = (result[1] - startCoord[1]) / numDeltas;
                        moveMarker();
                    }

                    function moveMarker() {

                        startCoord[0] += deltaLat;
                        startCoord[1] += deltaLng;
                        var latlng = new google.maps.LatLng(startCoord[0], startCoord[1]);
                        marker.setPosition(latlng);
                        if (i != numDeltas) {
                            i++;
                            setTimeout(moveMarker, delay);
                        }
                    }
                    navigator.geolocation.getCurrentPosition(function (position) {

                        var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        startCoord = [position.coords.latitude, position.coords.longitude];
                        var destination = new google.maps.LatLng($stateParams.latitude, $stateParams.longitude);
                        map.setCenter(initialLocation);
                        directionsService.route({
                            origin: initialLocation,
                            destination: destination,
                            travelMode: google.maps.TravelMode.DRIVING
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionsDisplay.setDirections(response);
                            } else {
                                window.alert('Directions request failed due to ' + status);
                            }
                        });
                        var rendererOptions = {
                            map: map,
                            suppressMarkers: true
                        }
                        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
//                        var startMarker = new google.maps.Marker({
//                            position: initialLocation,
//                            map: map,
//                            icon: icon
//                        });
//                        var endMarker = new google.maps.Marker({
//                            position: initialLocation,
//                            map: map,
//                            icon: icon
//                        });
                        marker = new google.maps.Marker({
                            position: initialLocation,
                            map: map,
                            icon: icon
                        });


                    });

                    setInterval(function () {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var result = [position.coords.latitude, position.coords.longitude];
                            if (!map.getBounds().contains(marker.getPosition())) {
                                map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                            }
                            transition(result);
                        });

                    }, 3000);
                }

                directionsDisplay.setMap(map);
            });
        })
 