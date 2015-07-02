
var app = angular.module('directives', [])

app.directive('waterViz', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/water-viz.html',
    controller : 'VizController'
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
app.directive('category', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/category.html',
    scope : {
      category : '='
    }
  }
})
