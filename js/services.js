angular.module('app.services', [])

.factory('BlankFactory', [function(){

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

.service('BlankService', [function(){

}]);

