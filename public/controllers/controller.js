//(function(angular) {

/////////////////////////////////
var myApp = angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination','ngFileUpload','ngCookies'])


//myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {


        $locationProvider.html5Mode(true);

        $routeProvider
        //   .when("/", {
        //       templateUrl : "public/index.htm"
        //   })

            .when('/', {
                templateUrl: '/page/directory.html'

            })
            .when('/view/:id', {
                templateUrl: '/page/view.html',
                controller: 'viewController'
            })
            .when('/admin', {
                templateUrl: '/page/admin.html',
                controller: 'adminController'
            })
            .otherwise({redirectTo: '/'})

        /*$locationProvider.html5Mode({
         enabled: true,
         requireBase: false
         });*/

    }])

    .controller('directoryController', ['$scope', '$http', function ($scope, $http) {

        $scope.currentPage = 1;
        $scope.pageSize = 10;


        $http.get('/podcasts').success(function (data) {
            $scope.podcasts = data;
        })


    }])

    .controller('viewController', ['$scope', '$routeParams', function ($scope, $routeParams) {


        $scope.podcast = $scope.podcasts[$routeParams.id]

    }])



    ///////////////////////
    .controller("searchTrack", function ($scope, $http) {


        $scope.contactlist = [
            "Alfreds Futterkiste",
            "Berglunds snabbköp",
            "Centro comercial Moctezuma",
            "Ernst Handel"
        ]


    });


//////////////////////


myApp.controller('adminController', ['$scope', '$http','Upload','$window','$cookieStore', function ($scope, $http,Upload,$window,$cookieStore) {

    $scope.currentPage = 1;
    $scope.pageSize = 5;

    console.log("Hello World from controller");

//////////////////////////////////////////////


    $http({method: 'GET', url: '/podcasts'}).then(function successCallback(response) {

        console.log("l got the date i requested");
        $scope.podcasts = response;

    }, function errorCallback(response) {
        console.log("error");
    });

//------------------------------------------------
    var refresh = function () {
        $http.get('/podcasts').then(function (response) {
            console.log("test1111111test111111");
            $scope.podcasts = response.data;
            $scope.podcast = "".data;
        });
    };

    refresh();


    $scope.addPodcast = function () {
        var favoriteCookie=$cookieStore.get('file_name');
        //console.log(favoriteCookie);
        //alert(favoriteCookie);
        $scope.podcast.audio="/uploads/"+favoriteCookie;
        console.log($scope.podcast);
        $http.post('/podcasts', $scope.podcast).then(function (response) {
            console.log(response);
            refresh();
        });
    };


    $scope.remove = function (id) {
        console.log(id);
        $http.delete('/podcasts/' + id).then(function (response) {
            refresh();
        });
    };

    $scope.edit = function (id) {
        console.log(id);
        $http.get('/podcasts/' + id).then(function (response) {
            $scope.podcast = response.data;
        });
    };

    $scope.update = function () {
        console.log($scope.podcast._id);
        $http.put('/podcasts/' + $scope.podcast._id, $scope.podcast).then(function (response) {
            console.log($scope.podcast);
            //$scope.contact = response.data;
            refresh();
        })
    };

    $scope.deselect = function () {
        $scope.podcast = "";
    }






    var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
    vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                $cookieStore.put('file_name',resp.config.data.file.name);
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) {
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };

}])

//----------------------------------------

//    .controller('Upload_file',['Upload','$window',function(Upload,$window){
/*   var vm = this;
       vm.submit = function(){ //function to call on form submit
            if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                vm.upload(vm.file); //call upload function
            }
        }
        vm.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        }; */
//    }]);
