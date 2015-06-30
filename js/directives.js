
var app = angular.module('directives', [])

app.directive('waterViz', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/water-viz.html'
  }
})

app.directive('categories', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/categories.html',
    scope : {
      domain : '@'
    },
    controller : 'CatsController'
  }
})

function outer(templateUrl){
  return {
    restrict : 'E',
    scope : {
      mytitle : '@',
      subtitle : '@',
      img : '@',
    },
    transclude : true,
    replace : true,
    templateUrl : templateUrl,
  }
}

app.directive('linksTemplate', function () {
    return {
      restrict : 'E',
      scope : {
        links : '=',
      },
      templateUrl : 'templates/links.html',
      controller : 'LinkController'
    };
});
