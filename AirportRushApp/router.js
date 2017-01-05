angular.module("airApp", ['ngRoute'])
  .config(Router)

Router.$inject = ['$routeProvider']

function Router($routeProvider){
  $routeProvider

  .when('/',{
    templateUrl: '/templates/home.html'
  })

  .when('/airports',{
    templateUrl: '/templates/airports.html'
  })

  .when('/waitTime',{
    templateUrl: '/templates/waitTime.html'
    //controller: 'OriginControl as oCtl'
  })

  .otherwise({ redirectTo:'/'})
}
