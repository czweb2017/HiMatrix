        var app = angular.module('routingDemoApp', ['ngRoute'])

        /**路由设置**/
        app.config(['$routeProvider', $routeProvider =>{
            $routeProvider
            .when('/', {template: 'Main Page'})
            .when('/computer', { templateUrl: 'computer.html', controller: 'myBind'})
            .when('/counter', { templateUrl: 'counter.html'})
            .when('/blabla', { template: 'bla page'})
            .when('/wire', { templateUrl: 'wire.html', controller: 'wire'})
            .when('/wireSwitch', { templateUrl: 'wireSwitch.html',controller: 'wireSwitch'})
            .when('/electric', { templateUrl: 'electric.html', controller: 'electric'})
            .when('/electricSwitch', { templateUrl: 'electricSwitch.html',controller: 'electricSwitch'})
            .otherwise({ redirecTo: '/'})
        }])