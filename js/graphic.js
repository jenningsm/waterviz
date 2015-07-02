

var app = angular.module('graphic', [])

app.directive('graphic', ['$window', function($window){
  return {
    restrict : 'E',
    templateUrl : 'templates/graphic.html',
    link : function(scope, el){

      var maxSize = .75

      function getScene(leftValue, rightValue){
        function areaToRad(area){
          return Math.sqrt(2 * area)
        }
        var radii = [areaToRad(leftValue), areaToRad(rightValue)]
    
        var rat = Math.min(scope.aspectRatio, 1 / scope.aspectRatio)
    
        dist = 2 * Math.max(radii[0], radii[1]) / (maxSize * rat)
    
        var centerOffset = .5 * dist
    
        if(centerOffset !== 0){
          var mult = Math.max(1, 2 * (radii[0] + radii[1]) / centerOffset)
          centerOffset *= mult
          dist *= mult
        }
    
        var ret = {
          'left-radius' : radii[0],
          'right-radius' : radii[1],
          'distance' : dist,
          'centerOffset' : centerOffset
        }
    
        return ret
      }

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

      var distance = 50
   
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

      states = getScene(0, 0)
      states.distance = 100

      var oldScene = copyObject(states)

      var moveCircle = sequence(setters, states)

      scope.$watch('values', function(newv){
        if(newv.right !== undefined && newv.left !== undefined){
          var newScene = getScene(newv.left, newv.right)
  
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
          moveCircle.apply(this, sceneSteps)
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

