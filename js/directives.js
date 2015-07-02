
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
      function radiusSetter(index){
        return function(radius){
          circles[index].setAttribute('r', radius / distance)
        }
      }
      function centerSetter(centerOffset){
        for(var i = 0; i < 2; i++){
          circles[i].setAttribute('cx', .5 + ((1 / 3) * (i === 0 ? -1 : 1) * centerOffset) / distance)
        }
      }

      var setters = {
        'distance' : distanceSetter,
        'left-radius' : radiusSetter(0),
        'right-radius' : radiusSetter(1),
        'centerOffset' : centerSetter
      }

      var states = {
        'distance' : distance,
        'left-radius' : 0,
        'right-radius' : 0,
        'centerOffset' : 1
      }

      var oldScene = copyObject(states)

      var moveCircle = sequence(setters, states)

      scope.$watch('$parent.values', function(newv){
        if(newv.right !== undefined && newv.left !== undefined){
          var newScene = scope.scene(newv.left, newv.right)
  
          function timeFunction(constant){
            return function(oldv, newv){
              return Math.min(
                Math.sqrt(
                  Math.abs(oldv-newv)
                ) * constant,
                2
              )
            }
          }

          var steps = ['distance', 'centerOffset', ['left-radius', 'right-radius']]
          var timeFunctions = [
            timeFunction(1/15),
            timeFunction(1/6),
            timeFunction(.3)
          ]
          if(newScene.distance < oldScene.distance){
            steps.reverse()
            timeFunctions.reverse()
          }
  
          var sceneSteps = []
          var currentStep = copyObject(oldScene)
          for(var i = 0; i < steps.length; i++){
            if(!Array.isArray(steps[i]))
              steps[i] = [steps[i]]

            var time = 0

            for(var j = 0; j < steps[i].length; j++){
              currentStep[steps[i][j]] = newScene[steps[i][j]]
              time += timeFunctions[i](oldScene[steps[i][j]], newScene[steps[i][j]])
            }
            var newStep = copyObject(currentStep)
            newStep.time = time

            sceneSteps.push(newStep)
          }

          oldScene = copyObject(newScene)
          console.log(sceneSteps)
          moveCircle.apply(this, sceneSteps)
          //moveCircle(newScene)
        } 
      }, true)

    }
  }
}])

function copyObject(o){
  var ret = {}
  Object.keys(o).forEach(function(key){
    ret[key] = o[key]
  })
  return ret
}

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
