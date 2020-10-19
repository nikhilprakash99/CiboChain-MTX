'use strict';

var app = angular.module("application", ["ngRoute","ngMessages"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "home.html",
            controller: "homeCtrl"
        })
        .when("/login", {
            templateUrl: "login.html",
            controller: "loginCtrl"
        })
        .when("/addUser", {
            templateUrl: "addUser.html",
            controller: "addUserCtrl"
        })
        .when("/createcibochain", {
            templateUrl: "createcibochain.html",
            controller: "createcibochainCtrl"
        })
        .when("/listcibochain", {
            templateUrl: "listcibochain.html",
            controller: "listcibochainCtrl"
        })
        .when("/mixcibochain", {
            templateUrl: "mixcibochain.html",
            controller: "mixcibochainCtrl"
        })
        .when("/details", {
            templateUrl: "details.html",
            controller: "detailsCtrl"
        })
        .when("/cibochainNotification", {
            templateUrl: "cibochainNotification.html",
            controller: "cibochainNotificationCtrl"
        });
});

app.controller("homeCtrl", function ($scope, $interval, appFactory) {
    $scope.start = function () {
        
        $interval(callAtInterval, 60000);

        function callAtInterval() {
            console.log("Interval occurred");
            var array = [];
            appFactory.queryAllcibochain(function (data) {
                for (var i = 0; i < data.length; i++) {
                    parseInt(data[i].Key);
                    data[i].Record.Key = parseInt(data[i].Key);
                    array.push(data[i].Record);
                }
                array.sort(function (a, b) {
                    return parseFloat(a.Key) - parseFloat(b.Key);
                });
                var current = new Date();
                var y = current.getFullYear().toString();
                var m = (current.getMonth() + 1).toString();
                var d = current.getDate().toString();
                var h = current.getHours().toString();
                var mi = current.getMinutes().toString();
                var ampm1 = h >= 12 ? 'pm' : 'am';
                h = h % 12;
                h = h ? h : 12;
                m = m < 10 ? '0' + m : m;

                let finalCurrentDate = d + "." + m + "." + y + "." + " " + h + ":" + mi + " " + ampm1;
                let parts1 = finalCurrentDate.split(/[\s.:]/);
                let mydate1 = new Date(parts1[2], parts1[1] - 1, parts1[0], parts1[4], parts1[5]);

                console.log(finalCurrentDate);
                for(var i = 0; i < array.length; i++) {
                    console.log(i);
                    var parts3 = array[i].expiration_date.split(/[\s.:]/);
                    var mydate4 = new Date(parts3[2], parts3[1] - 1, parts3[0], parts3[4], parts3[5]);
                    console.log(mydate4);
                    if(mydate1 >= mydate4) {
                        appFactory.deletecibochain(array[i], function (data) {
                        console.log("cibochain obrisan");
                        });
                    }
                }  
            });
        }

    }
});

app.controller("loginCtrl", function ($scope, $location, appFactory) {
    $scope.loginUser = function () {
        appFactory.loginUser($scope.user, function (data) {
            console.log(data.message);
            if (data.message == "adminok") {
                $location.path("addUser");
            } else if (data.message == "userok") {
                $location.path("createcibochain");
            } else {
                $scope.poruka = data.message;
            }
        });
    }
});

app.controller("addUserCtrl", function ($scope, $location, appFactory) {
    $scope.addUser = function () {
        console.log($scope.user);
        appFactory.addUser($scope.user, function (data) {
            console.log(data);
            console.log(data.message);
            $scope.poruka = data.message;
        });
    }
    $scope.logOut = function () {
        console.log("kliknuto na Log Out");
        appFactory.logOut(function (data) {
            console.log(data);
            if (data.message == "ok") {
                $location.path("login");
            }
        });
    }
});

app.controller("createcibochainCtrl", function ($scope, $location, appFactory) {
    $scope.recordcibochain = function () {
        var trenutniDatum = new Date();
        var year = trenutniDatum.getFullYear().toString();
        var month = (trenutniDatum.getMonth() + 1).toString();
        var day = trenutniDatum.getDate().toString();
        var hour = trenutniDatum.getHours().toString();
        var min = trenutniDatum.getMinutes().toString();
        var ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        hour = hour ? hour : 12;
        min = min < 10 ? '0' + min : min;


        $scope.cibochain.productionDate = day + "." + month + "." + year + "." + " " + hour + ":" + min + " " + ampm;
        console.log($scope.cibochain);
        if ($scope.cibochain.unit == "min") {
            var m = parseInt($scope.cibochain.number);
            var newMin = new Date();
            newMin.setMinutes(newMin.getMinutes() + m);

            min = newMin.getMinutes().toString();
            hour = newMin.getHours().toString();
            day = newMin.getDate().toString();

            ampm = hour >= 12 ? 'pm' : 'am';
            hour = hour % 12;
            hour = hour ? hour : 12;
            min = min < 10 ? '0' + min : min;
        }
        else if ($scope.cibochain.unit == "hour") {
            var h = parseInt($scope.cibochain.number);
            var newHour = new Date();
            newHour.setHours(newHour.getHours() + h);

            hour = newHour.getHours().toString();
            day = newHour.getDate().toString();
            ampm = hour >= 12 ? 'pm' : 'am';
            hour = hour % 12;
            hour = hour ? hour : 12;
            min = min < 10 ? '0' + min : min;
        }
        else if ($scope.cibochain.unit == "days") {
            var d = parseInt($scope.cibochain.number);
            var newDays = new Date();
            newDays.setDate(newDays.getDate() + d);
            day = newDays.getDate().toString();
            var mth1 = newDays.getMonth() + 1;
            month = mth1.toString();

            year = newDays.getFullYear().toString();
        }

        else {
            var mth = parseInt($scope.cibochain.number);
            var newMonth = new Date();
            newMonth.setMonth(newMonth.getMonth() + mth);
            var monthInt = newMonth.getMonth() + 1;
            month = monthInt.toString();
            year = newMonth.getFullYear().toString();
        }

        $scope.cibochain.expirationDate = day + "." + month + "." + year + "." + " " + hour + ":" + min + " " + ampm;
        appFactory.recordcibochain($scope.cibochain, function (data) {
            //$scope.create_cibochain = data;
            console.log("Podaci iz create cibochaina:" + data);
            $scope.poruka = data.message;
        });
    }

    $scope.logOut = function () {
        console.log("kliknuto na Log Out");
        appFactory.logOut(function (data) {
            console.log(data);
            if (data.message == "ok") {
                $location.path("login");
            }
        });
    }
});

app.controller("listcibochainCtrl", ["$scope", "$interval", "$location", "appFactory", "myService", function ($scope, $interval, $location, appFactory, myService) {
    console.log("Uslo u kontroler");
    var array = [];
    appFactory.queryAllcibochain(function (data) {
        for (var i = 0; i < data.length; i++) {
            parseInt(data[i].Key);
            data[i].Record.Key = parseInt(data[i].Key);
            array.push(data[i].Record);
        }
        array.sort(function (a, b) {
            return parseFloat(a.Key) - parseFloat(b.Key);
        });
        $scope.all_cibochain = array;
        console.log(array);
    });

    /*
    $scope.queryAllcibochain = function () {
        var array = [];
        appFactory.queryAllcibochain(function (data) {
            for (var i = 0; i < data.length; i++) {
                parseInt(data[i].Key);
                data[i].Record.Key = parseInt(data[i].Key);
                array.push(data[i].Record);
            }
            array.sort(function (a, b) {
                return parseFloat(a.Key) - parseFloat(b.Key);
            });
            $scope.all_cibochain = array;
            console.log(array);
        });
    }
    */

    $scope.getDetails = function (index) {
        var cibochainDetails = $scope.all_cibochain[index];
        myService.setJson(cibochainDetails);
    }
    $scope.deletecibochain = function (index) {
        var cibochain = $scope.all_cibochain[index];
        console.log(cibochain);
        appFactory.deletecibochain(cibochain, function (data) {
            console.log("cibochain obrisan");
        });
    }
    $scope.logOut = function () {
        console.log("kliknuto na Log Out");
        appFactory.logOut(function (data) {
            console.log(data);
            if (data.message == "ok") {
                $location.path("login");
            }
        });
    }
}]);


app.controller("detailsCtrl", ["$scope", "appFactory", "myService", function ($scope, appFactory, myService) {
    $scope.myreturnedData = myService.getJson();
    appFactory.queryAllUsers(function (data) {
        var array = data;
        $scope.all_users = array;
    });
    $scope.changeOwner = function () {
        $scope.owner.id = $scope.myreturnedData.Key;
        $scope.owner.oldOwner = $scope.myreturnedData.owner;
        console.log("Ono sto majri treba!");
        $scope.owner.name = $scope.owner.name.replace(/\s+/g,"");
        console.log($scope.owner);
        appFactory.changeOwner($scope.owner, function (data) {
            $scope.poruka = data.message;
        });
    }
}]);

app.controller("mixcibochainCtrl", ["$scope", "$location", "appFactory", "myService", function ($scope, $location, appFactory, myService) {
    console.log("Nalazim se u mixcibochainCtrl");
    appFactory.queryAllcibochain(function (data) {
        var array = [];
        for (var i = 0; i < data.length; i++) {
            parseInt(data[i].Key);
            data[i].Record.Key = parseInt(data[i].Key);
            array.push(data[i].Record);
        }
        array.sort(function (a, b) {
            return parseFloat(a.Key) - parseFloat(b.Key);
        });
        $scope.all_cibochain = array;
    });

    /*
    $scope.queryAllcibochain = function () {
        appFactory.queryAllcibochain(function (data) {
            var array = [];
            for (var i = 0; i < data.length; i++) {
                parseInt(data[i].Key);
                data[i].Record.Key = parseInt(data[i].Key);
                array.push(data[i].Record);
            }
            array.sort(function (a, b) {
                return parseFloat(a.Key) - parseFloat(b.Key);
            });
            $scope.all_cibochain = array;
        });
    }
    */

    $scope.getcibochain1 = function (index) {
        var cibochain1 = $scope.all_cibochain[index];
        myService.setcibochain1(cibochain1);
    }

    $scope.getcibochain2 = function (index) {
        var cibochain2 = $scope.all_cibochain[index];
        myService.setcibochain2(cibochain2);
    }
    $scope.mixcibochain = function () {
        var prvi = myService.getcibochain1();
        var drugi = myService.getcibochain2();
        var kolicina1 = Number(prvi.quantity);
        var kolicina2 = Number(drugi.quantity);
        var percentage1 = parseInt($scope.cibochain.percentage1);
        var percentage2 = parseInt($scope.cibochain.percentage2);

        var quantity1 = kolicina1 * (percentage1 / 100);
        var quantity2 = kolicina2 * (percentage2 / 100);

        var sumaKolicina = quantity1 + quantity2;


        var parts1 = prvi.expiration_date.split(/[\s.:]/);
        var mydate1 = new Date(parts1[2], parts1[1] - 1, parts1[0], parts1[4], parts1[5]);
        console.log(parts1);

        var parts2 = drugi.expiration_date.split(/[\s.:]/);
        var mydate2 = new Date(parts2[2], parts2[1] - 1, parts2[0], parts2[4], parts2[5]);

        var finalProductionDate = "";
        var finalExpirationDate = "";
        var current = new Date();
        var y = current.getFullYear().toString();
        var m = (current.getMonth() + 1).toString();
        var d = current.getDate().toString();
        var h = current.getHours().toString();
        var mi = current.getMinutes().toString();
        var ampm1 = h >= 12 ? 'pm' : 'am';
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? '0' + m : m;

        finalProductionDate = d + "." + m + "." + y + "." + " " + h + ":" + mi + " " + ampm1;
        if (mydate1 < mydate2) {
            console.log("USlooooo");
            var year = parts1[2];
            var month = parts1[1];
            var day = parts1[0];
            var hour = parts1[4];
            var min = parts1[5];
            var ampm = parts1[6];

            finalExpirationDate = day + "." + month + "." + year + "." + " " + hour + ":" + min + " " + ampm;

        }

        else {
            var year = parts2[2];
            var month = parts2[1];
            var day = parts2[0];
            var hour = parts2[4];
            var min = parts2[5];
            var ampm = parts2[6];

            finalExpirationDate = day + "." + month + "." + year + "." + " " + hour + ":" + min + " " + ampm;
        }

        var newcibochain = {
            id: (prvi.Key).toString() + (drugi.Key).toString(),
            name: prvi.name + "&" + drugi.name,
            //owner: prvi.owner,
            animal: prvi.animal + drugi.animal,
            location: prvi.location + drugi.location,
            quantity: (sumaKolicina).toString(),
            productionDate: finalProductionDate,
            expirationDate: finalExpirationDate,
        }

        var owners = {
            firstOwner: prvi.owner,
            secondOwner: drugi.owner,
            firstName: prvi.name,
            secondName: drugi.name,
            firstID: (prvi.Key).toString(),
            secondID: (drugi.Key).toString()
        }

        appFactory.checkOwners(owners, function (data) {
            console.log("Uredu ckeck");
            if (data.message == "allow") {
                appFactory.recordcibochain(newcibochain, function (data) {
                    //$scope.create_cibochain = data;
                    console.log("U redu");
                });
                if (percentage1 == 100) {
                    appFactory.deletecibochain(prvi, function (data) {
                        console.log("cibochain obrisan");
                    });
                } else {
                    prvi.quantity = prvi.quantity - quantity1;
                    console.log(prvi.quantity);
                    console.log("Pozzzvalllo se prvvvviii");
                    var cibochainData = {
                        cibochainID: (prvi.Key).toString(),
                        cibochainQuantity: prvi.quantity
                    };
                    appFactory.changeQuantity(cibochainData, function (data){
                            console.log("U redu");
                    });
                }
                if (percentage2 == 100){
                    appFactory.deletecibochain(drugi, function (data) {
                        console.log("cibochain obrisan");
                    });
                } else {
                    console.log("Pozzzvalllo seee");
                    drugi.quantity = drugi.quantity - quantity2;
                    var cibochainData = {
                        cibochainID: (drugi.Key).toString(),
                        cibochainQuantity: drugi.quantity

                    };
                    appFactory.changeQuantity(cibochainData, function (data){
                            console.log("U redu");
                    });
                }
                $scope.poruka = "cibochain Mixed Successfully!";
            } else {
                $scope.poruka = data.message;
            }
        });
    }

    $scope.logOut = function () {
        console.log("kliknuto na Log Out");
        appFactory.logOut(function (data) {
            console.log(data);
            if (data.message == "ok") {
                $location.path("login");
            }
        });
    }
}]);

app.controller("cibochainNotificationCtrl", ["$scope", "appFactory", "$location", function ($scope, appFactory, $location) {
    console.log("Nalazim se u cibochainNotificationCtrl");
    appFactory.queryAllNotifications(function (data) {
        var niz = [];
        console.log(data.requests.length);
        for (var i = 0; i < data.requests.length; i++) {
            if (data.requests[i] !== "") {
                niz.push(data.requests[i]);
            }
        }
        $scope.all_requests = niz;

        var nizOdgovora = [];
        for (var i = 0; i < data.responses.length; i++) {
            if (data.responses[i] !== "") {
                nizOdgovora.push(data.responses[i]);
            }
        }
        $scope.all_responses = nizOdgovora;
        console.log(data);
    });
    /*
    $scope.queryAllNotifications = function () {
        //var array = ["jkfashfjhsahf","ifasfgayuhi","asuyjtfhdtftyy8u9"];
        appFactory.queryAllNotifications(function (data) {
            var niz = [];
            console.log(data.requests.length);
            for (var i = 0; i < data.requests.length; i++) {
                if (data.requests[i] !== "") {
                    niz.push(data.requests[i]);
                }
            }
            $scope.all_requests = niz;

            var nizOdgovora = [];
            for (var i = 0; i < data.responses.length; i++) {
                if (data.responses[i] !== "") {
                    nizOdgovora.push(data.responses[i]);
                }
            }
            $scope.all_responses = nizOdgovora;
            console.log(data);
        });
    }
    */
    $scope.logOut = function () {
        console.log("kliknuto na Log Out");
        appFactory.logOut(function (data) {
            console.log(data);
            if (data.message == "ok") {
                $location.path("login");
            }
        });
    }
    $scope.approveRequest = function(index) {
        console.log("kliknuto na approve cibochain");
        console.log(index);
        appFactory.approveRequest(index, function(data) {
            console.log("U redu");
            appFactory.queryAllNotifications(function (data) {
                var niz = [];
                console.log(data.requests.length);
                for (var i = 0; i < data.requests.length; i++) {
                    if (data.requests[i] !== "") {
                        niz.push(data.requests[i]);
                    }
                }
                $scope.all_requests = niz;

                var nizOdgovora = [];
                for (var i = 0; i < data.responses.length; i++) {
                    if (data.responses[i] !== "") {
                        nizOdgovora.push(data.responses[i]);
                    }
                }
                $scope.all_responses = nizOdgovora;
                console.log(data);
            });
        });
    }
    $scope.rejectRequest = function(index) {
        console.log("kliknuto na reject cibochain");
        console.log(index);
        appFactory.rejectRequest(index, function(data) {
            console.log("U redu");
            appFactory.queryAllNotifications(function (data) {
                var niz = [];
                console.log(data.requests.length);
                for (var i = 0; i < data.requests.length; i++) {
                    if (data.requests[i] !== "") {
                        niz.push(data.requests[i]);
                    }
                }
                $scope.all_requests = niz;

                var nizOdgovora = [];
                for (var i = 0; i < data.responses.length; i++) {
                    if (data.responses[i] !== "") {
                        nizOdgovora.push(data.responses[i]);
                    }
                }
                $scope.all_responses = nizOdgovora;
                console.log(data);
            });
        });
    }
}]);


// Angular Factory
app.factory('appFactory', function ($http) {
    var factory = {};

    factory.loginUser = function (data, callback) {
        var user = data.username + "-" + data.password;
        $http.get('/login/' + user).success(function (output) {
            callback(output);
        });
    }

    factory.addUser = function (data, callback) {
        console.log(data);
        var user = data.email + "-" + data.username + "-" + data.password + "-" + data.organization;
        console.log(user);
        $http.get('/addUser/' + user).success(function (output) {
            callback(output);
        });
    }

    factory.logOut = function (callback) {
        $http.get('/logout').success(function (output) {
            callback(output);
        });
    }

    factory.queryAllcibochain = function (callback) {
        $http.get('/get_all_cibochain/').success(function (output) {
            callback(output)
        });
    }

    factory.checkOwners = function (data, callback) {
        var kData = data.firstOwner + "-" + data.secondOwner + "-" + data.firstName + "-" + data.secondName + "-" + data.firstID + "-" + data.secondID;
        $http.get('/check_owners/' + kData).success(function (output) {
            callback(output);
        });
    }
    
  

    factory.recordcibochain = function (data, callback) {

        var cibochain = data.id + "-" + data.name + "-" + data.animal + "-" + data.location + "-" + data.quantity + "-" + data.productionDate + "-" + data.expirationDate;
        $http.get('/add_cibochain/' + cibochain).success(function (output) {
            callback(output)
        });
    }

    factory.changeOwner = function (data, callback) {
        console.log("uslo");
        var owner = data.id + "-" + data.name + "-" + data.oldOwner;
        $http.get('/change_owner/' + owner).success(function (output) {
            callback(output)
        });
    }

    factory.changeQuantity = function (data, callback) {
        var quantity = data.cibochainID + "-" + data.cibochainQuantity;
        $http.get('/change_quantity/' + quantity).success(function (output) {
            callback(output)
        });
    }


    factory.deletecibochain = function (data, callback) {
        console.log("uslo u deletecibochain");
        console.log(data);
        var kjmk = data.Key + "-" + data.name + "-" + data.owner + "-" + data.animal + "-" + data.location + "-" + data.quantity + "-" + data.production_date + "-" + data.expiration_date;
        $http.get('/delete_cibochain/' + kjmk).success(function (output) {
            callback(output);
        });
    }

    factory.queryAllUsers = function (callback) {
        $http.get('/get_all_users').success(function (output) {
            callback(output);
        });
    }

    factory.queryAllNotifications = function (callback) {
        $http.get('/get_all_notifications/').success(function (output) {
            console.log(output);
            callback(output);
        });
    }

    factory.approveRequest = function(data, callback) {
        $http.get('/send_approve/'+ data).success(function (output) {
            callback(output);
        });    
    }

    factory.rejectRequest = function(data, callback) {
        $http.get('/send_reject/' + data).success(function (output) {
            callback(output);
        });
    }

    return factory;
});

app.factory('myService', function () {
    var myjsonObj = null;//the object to hold our data
    var cibochain1Obj = null;
    var cibochain2Obj = null;
    return {
        getJson: function () {
            return myjsonObj;
        },
        getcibochain1: function () {
            return cibochain1Obj;
        },
        getcibochain2: function () {
            return cibochain2Obj;
        },
        setJson: function (value) {
            myjsonObj = value;
        },
        setcibochain1: function (value) {
            cibochain1Obj = value;
        },
        setcibochain2: function (value) {
            cibochain2Obj = value;
        }
    }
});