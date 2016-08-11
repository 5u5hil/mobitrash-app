angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider

                    .state('markAttendance2', {
                        url: '/attendance',
                        templateUrl: 'templates/markAttendance2.html',
                        controller: 'AppCtrl',
                        abstract: true
                    })

                    .state('markAttendance2.markAttendance', {
                        url: '/attendance',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/markAttendance.html',
                                controller: 'markAttendanceCtrl'
                            }
                        }
                    })

                    .state('markAttendance2.scheduleForTheDay', {
                        url: '/schedule',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/scheduleForTheDay.html',
                                controller: 'scheduleForTheDayCtrl'
                            }
                        }
                    })
                    
                    .state('markAttendance2.settings', {
                        url: '/settings',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/settings.html',
                                controller: 'settingsCtrl'
                            }
                        }
                    })
                    
                    .state('markAttendance2.pickups', {
                        url: '/pickups/:id',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/pickups.html',
                                controller: 'pickupsCtrl'
                            }
                        }
                    })

                    .state('markAttendance2.cleaning', {
                        url: '/cleaning',
                        views: {
                            'tab3': {
                                templateUrl: 'templates/cleaning.html',
                                controller: 'cleaningCtrl'
                            }
                        }
                    })



                    .state('markAttendance2.receipts', {
                        url: '/receipts',
                        views: {
                            'tab4': {
                                templateUrl: 'templates/receipts.html',
                                controller: 'receiptsCtrl'
                            }
                        }
                    })

                    .state('markAttendance2.getClicked', {
                        url: '/click',
                        views: {
                            'tab1': {
                                templateUrl: 'templates/getClicked.html',
                                controller: 'getClickedCtrl'
                            }
                        }
                    })

                    .state('markAttendance2.pickupDetails', {
                        url: '/details/:scheduleid/:pickupid',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/pickupDetails.html',
                                controller: 'pickupDetailsCtrl'
                            }
                        }
                    })

                    .state('markAttendance2.route', {
                        url: '/route/:pickupid/:latitude/:longitude',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/route.html',
                                controller: 'routeCtrl'
                            }
                        }
                    })
                    
                    .state('markAttendance2.logout', {
                        url: '/logout',
                        views: {
                            'tab2': {
                                templateUrl: 'templates/logout.html',
                                controller: 'logoutCtrl'
                            }
                        }
                    });

            $urlRouterProvider.otherwise('/attendance/attendance')



        });