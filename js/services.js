angular.module('app.services', [])

        .factory('Util', [function () {
                return {
                    dhms: function (t) {
                        var hours, minutes, seconds;
                        hours = Math.floor(t / 3600) % 24;
                        t -= hours * 3600;
                        minutes = Math.floor(t / 60) % 60;
                        t -= minutes * 60;
                        seconds = t % 60;
                        return [
                            hours + ':',
                            minutes + ':',
                            seconds
                        ].join(' ');
                    }
                };
            }])
        .factory('$localstorage', ['$window', function ($window) {
                return {
                    set: function (key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function (key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    setObject: function (key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function (key, nulled) {
                        nulled = nulled || '{}';
                        try {
                            return JSON.parse($window.localStorage[key] || nulled);
                        } catch (e) {
                        }
                    },
                    uid: function () {
                        try {
                            var user = this.getObject('user');
                            return user.id;
                        } catch (e) {
                        }
                    },
                    user: function (key) {
                        if (this.uid()) {
                            key = key || null;
                            var user = this.getObject('user');
                            if (key) {
                                return user[key];
                            }
                            return user;
                        }
                        return false;
                    },
                    deleteObject: function (key) {
                        $window.localStorage.removeItem(key);
                    },
                };
            }])
        .filter('stopwatchTime', function () {
            return function (input) {
                if (input) {

                    var elapsed = input.getTime();
                    var hours = parseInt(elapsed / 3600000, 10);
                    elapsed %= 3600000;
                    var mins = parseInt(elapsed / 60000, 10);
                    elapsed %= 60000;
                    var secs = parseInt(elapsed / 1000, 10);
                    var ms = elapsed % 1000;

                    return hours + ':' + mins + ':' + secs;
                }
            };
        })
        .factory('StopwatchFactory', ['$interval', function ($interval) {

                return function (options) {

                    var startTime = 0,
                            currentTime = null,
                            offset = 0,
                            interval = null,
                            self = this;

                    if (!options.interval) {
                        options.interval = 100;
                    }

                    options.elapsedTime = new Date(0);
                    options.elapsedTimeMS = 0;

                    self.running = false;

                    function pushToLog(lap) {
                        if (options.log !== undefined) {
                            options.log += lap;
                        }
                    }

                    self.updateTime = function () {
                        currentTime = new Date().getTime();
                        var timeElapsed = offset + (currentTime - startTime);
                        options.elapsedTime.setTime(timeElapsed);
                        options.elapsedTimeMS = currentTime - startTime;
                    };

                    self.startTimer = function () {
                        if (self.running === false) {
                            startTime = new Date().getTime();
                            interval = $interval(self.updateTime, options.interval);
                            self.running = true;
                        }
                    };

                    self.stopTimer = function () {
                        if (self.running === false) {
                            return;
                        }
                        self.updateTime();
                        offset = offset + currentTime - startTime;
                        pushToLog(currentTime - startTime);
                        $interval.cancel(interval);
                        self.running = false;
                    };

                    self.resetTimer = function () {
                        startTime = new Date().getTime();
                        options.elapsedTime.setTime(0);
                        timeElapsed = offset = 0;
                    };

                    self.cancelTimer = function () {
                        $interval.cancel(interval);
                    };

                    return self;

                };


            }]);