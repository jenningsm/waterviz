
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



      function getSetter(circle, attribute){
        return function(x){
          circle.setAttribute(attribute, x)
        }
      }

      var sides = ['left', 'right']
      var circles = []
      for(var i = 0; i < sides.length; i++){
        circles.push(el[0].children[0].children[i])
      }

      var distance = 5
   
      function distanceSetter(dist){
        distance = dist
      }
      function radiusSetter(radii){
        for(var i = 0; i < 2; i++){
          circles[i].setAttribute('r', radii[i] / distance)
        }
      }
      function centerSetter(centerOffset){
        for(var i = 0; i < 2; i++){
          circles[i].setAttribute('cx', (.5 + .5 * (i === 0 ? -1 : 1) * centerOffset) / distance)
        }
      }

      var setters = {
        'distance' : distanceSetter,
        'radii' : radiusSetter,
        'centerOffset' : centerSetter
      }

      var states = {
        'distance' : distance,
        'radii' : [0, 0],
        'centerOffset' : .25
      }

      var moveCircle = sequence(setters, states)
    
      scope.$watch('$parent.values', function(newv){
    
        var newScene = scope.scene(newv.left, newv.right)

        var steps = ['distance', 'centerOffset', 'radii']
        if(newScene.distance < states.distance)
          steps.reverse

        var sceneSteps = []
        for(var i = 0; i < steps.length; i++){
          var step = {}
          for(var j = 0; j < steps.length; j++){
            step[steps[j]] = steps.slice(0, i+1).indexOf(steps[j]) !== -1 ? newScene[steps[j]] : states[steps[j]]
          }
          sceneSteps.push(step)
        }

        moveCircle.apply(this, sceneSteps)
    
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
