
var app = angular.module('directives', [])

app.directive('waterViz', function(){
  return {
    restrict : 'E',
    templateUrl : 'templates/water-viz.html',
    controller : 'VizController'
  }
})

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

      var leftCircle = el[0].children[0].children[0]
      var rightCircle = el[0].children[0].children[1]

      scope.setLeft = function(r){
        leftCircle.setAttribute('r', r)
      }
      scope.setRight = function(r){
        rightCircle.setAttribute('r', r)
      }
      var moveCircle = sequence({
        'left' : function(x){
          scope.setLeft(x / 200)
        },
        'right' : function(x){
          scope.setRight(x / 200)
        }
      }, {'left' : .25, 'right' : .2 })
    
      scope.$watch('$parent.values', function(newv){
    
        moveCircle(newv)
    
      }, true)

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
