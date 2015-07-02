
var app = angular.module('directives', [])

app.directive('waterViz', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/water-viz.html',
    controller : 'VizController'
  }
})

/*
app.directive('waterCircle', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/water-circle.html',
    scope : {
      center : '=',
      mradius : '='
    },
    replace : true
  }
})*/

app.directive('graphic', ['$window', function($window){
  return {
    restrict : 'E',
    templateUrl : 'templates/graphic.html',
    controller : 'GraphicController',
    scope : {
      leftv : '=',
      rightv : '='
    },
    link : function(scope, el){
      function getAspectRatio(){
        scope.aspectRatio =  el[0].offsetWidth / el[0].offsetHeight
      }

      var win = angular.element($window);
      win.bind("resize", getAspectRatio)
      getAspectRatio()
    }
  }
}])

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
app.directive('category', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/category.html',
    scope : {
      category : '='
    }
  }
})
