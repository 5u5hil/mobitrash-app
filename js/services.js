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
                            this.leftPad(hours, 2) + ':',
                            this.leftPad(minutes, 2) + ':',
                            this.leftPad(seconds, 2)
                        ].join(' ');
                    },
                    leftPad: function (number, targetLength) {
                        /// add 0 before number
                        var output = number + '';
                        while (output.length < targetLength) {
                            output = '0' + output;
                        }
                        return output;
                    },
                    getTimeFormat: function (millis) {
                        var hours = Math.floor(millis / 36e5),
                                mins = Math.floor((millis % 36e5) / 6e4),
                                secs = Math.floor((millis % 6e4) / 1000);
                        return hours + ':' + mins + ':' + secs;
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
                        nulled = '[]';
                        try {
                            return JSON.parse($window.localStorage[key] || '[]');
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
                    delete: function (key) {
                        $window.localStorage.removeItem(key);
                    },
                };
            }]);