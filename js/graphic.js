

var app = angular.module('graphic', [])

app.directive('graphic', ['$window', function($window){
  return {
    restrict : 'E',
    templateUrl : 'templates/graphic.html',
    link : link($window)
  }
}])

function link($window){
  return function(scope, el){

    var dims = []
    var aspectRatio  

    function getDims(){
      dims[0] = el[0].offsetWidth
      dims[1] = el[0].offsetHeight
      aspectRatio =  dims[0] / dims[1]
    }
  
    var win = angular.element($window);
    win.bind("resize", getDims)
    getDims()
  

    /* --------------------------------- */

 
    //the two circle elements
    var circles = []
    //the number gallons represented by each circle
    var circleValues = []
    //the two textboxes displaying the number of gallons represented by each circle
    var textBoxes = []
    for(var i = 0; i < 2; i++){
      circles.push(el[0].children[0].children[i])
      textBoxes.push(el[0].children[1].children[i])
      textBoxes[i].style.top = '50%'
      textBoxes[i].style.left = ((.5 + .25 * (i === 0 ? -1 : 1)) * 100) + '%'
      circleValues[i] = 0
    }
  
    var centerSetter = changeDetector( 
      function(apparentCenterOffset){
        for(var i = 0; i < 2; i++){
          var pos = (i === 0 ? -1 : 1) * apparentCenterOffset
          circles[i].setAttribute('cx', .5 + pos)
          textBoxes[i].style.left = (50 + 100 * pos * Math.max(1, dims[1] / dims[0])) + '%'
        }
      },
      function(centerOffset, distance){
        return centerOffset / distance
      }
    )
  
    var radiiSetters = [
      radiusSetter(dims, circles[0], textBoxes[0]),
      radiusSetter(dims, circles[1], textBoxes[1])
    ]

    var setter = function(positions){
      radiiSetters[0](positions['left-radius'], positions.distance)
      radiiSetters[1](positions['right-radius'], positions.distance)
      centerSetter(positions.centerOffset, positions.distance)
    }
  
    states = getScene(0, 0, aspectRatio, 0)
    states.distance = 100
    states.centerOffset = (1 / 6) * states.distance
  
    var oldScene = states
    var moveCircles = sequence(setter, states)
 
    function valueChange(newv){ 
      if(newv.right === undefined || newv.left === undefined)
        return

      var newScene = getScene(newv.left, newv.right, aspectRatio, oldScene.distance)
      var sceneSteps = getSteps(oldScene, newScene)
      oldScene = newScene

      moveCircles.apply(this, sceneSteps)
    }

    scope.$watch('values', valueChange, true)
  }
}

/*
  action and transform are both supposed to be functions

  Returns a function that's meant to take a series of
  inputs. That function will call action each time one
  of those inputs is different than the last one passed in.
  Additionally, if the transform argument is specified, then
  each input will be passed through transform before it is
  tested for equality and before it is passed to action (if at all).
*/
function changeDetector(action, transform){
  if(transform === undefined)
    transform = function(x) { return x }

  var value

  return function(){
    var args = Array.prototype.slice.call(arguments)

    var newTransformed = transform.apply(this, args)
    if(newTransformed !== value){
      value = newTransformed
      action.apply(this, [value].concat(args))
    }
  }
}

function translate(element, x, y){
  var transform = 'translate(' + x + ',' + y + ')'
  element.style.transform = transform
  element.style.webkitTransform = transform
}

function radiusSetter(dims, circle, textBox){


  function roundValue(value){
    var rounded = 0
    var precision = 10
    
    while(rounded === 0 && precision >= 1){
      var rounded = Math.round(value / precision) * precision
      precision /= 10
    }
    
    return rounded
  }

  var textLength

  var textTracker = changeDetector(
    function(){
      textLength = textBox.children[0].clientWidth
    },
    function(gallons){
      if(gallons < 1)
        return 1

      return 1 + Math.floor(Math.log(gallons) / Math.LN10)
    }
  )

  var gallonDisplay = changeDetector(
    function(gallons){
      textBox.children[0].innerHTML = gallons + ' gallons'
      textTracker(gallons)
    },
    function(radius){
      return roundValue(.5 * Math.PI * radius * radius)
    }
  )
  gallonDisplay(0)

  var textStatus = changeDetector(
    function(stat){
      if(stat === 'out'){
        translate(textBox, 0, '50%')
        textBox.style.color = 'black'
      } else {
        translate(textBox, 0, 0)
        textBox.style.top = '50%'
        textBox.style.color = 'white'
      }
    },
    function(stat){
      if(typeof stat === 'number'){
        return 'out'
      } else {
        return 'in'
      }
    }
  )

  var textPositionChange = changeDetector(
    function(stat){
      //if the text is inside the circle, sets its top position to match the apparent radius
      if(typeof stat === 'number'){
        var aspectRatio = dims[0] / dims[1]
        textBox.style.top = ((.5 + Math.max(1, aspectRatio) * stat) * 100) + '%'
      }
      //update the in-or-out status of the text
      textStatus(stat)
    },
    function(radius, distance){
      var circleDiameter = 2 * dims[0] * radius / distance

      //if the text is too large to fit in the circle, it will need to go outside the circle
      //if it is outside the circle, we will need to change its position everytime the radius changes
      //if it is inside the circle, its positions will remain static, so we only need to make
      //a change when it goes from outside the circle to inside
      if(circleDiameter < textLength + 4){
        //return the apparent radius
        return radius / distance
      } else {
        return 'in'
      }
    }
  )

  return function(radius, distance){
    circle.setAttribute('r', radius / distance)

    gallonDisplay(radius)
    textPositionChange(radius, distance)
  }
}

function getSteps(oldScene, newScene){
  var steps = ['distance', 'centerOffset', ['left-radius', 'right-radius']]

  function timeFunction(constant){
    return function(oldv, newv){
      return Math.min(
        Math.pow(Math.abs(oldv-newv), .4) * constant,
        2
      )
    }
  }

  var timeFunctions = [
    timeFunction(.13),
    timeFunction(.18),
    timeFunction(.35)
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

  return sceneSteps
}

function getScene(leftValue, rightValue, aspectRatio, currentDist){
  function areaToRad(area){
    return Math.sqrt(2 * area / Math.PI)
  }
  var radii = [areaToRad(leftValue), areaToRad(rightValue)]
  
  var rat = Math.min(aspectRatio, 1 / aspectRatio)
 
  
 //returns the distance required so that the larger of the two
 //circles has an apparent size of size
 function distanceForSize(size, radii){
    return 2 * Math.max(radii[0], radii[1]) / (size * rat)
 }
  
 var apparentCenterOffset = 1 / 6
 //returns the minimum distance required so the two circles don't overlap
 function overlapDist(radii){
   return 1.2 * .5 * (radii[0] + radii[1]) / apparentCenterOffset
 }

 var maxSize = .75
 var minSize = .55
  
 var dist
  
 var lowerDist = distanceForSize(maxSize, radii)
 var upperDist = distanceForSize(minSize, radii)
 var minDist = overlapDist(radii)
 
 if(currentDist < upperDist && currentDist > lowerDist && currentDist > minDist){
   dist = currentDist
 } else {
   dist = Math.max(minDist, lowerDist)
 }
  
 var centerOffset = dist * apparentCenterOffset
  
  var ret = {
    'left-radius' : radii[0],
    'right-radius' : radii[1],
    'distance' : dist,
    'centerOffset' : centerOffset
  }
  
  return ret
}

function copyObject(o){
  var ret = {}
  Object.keys(o).forEach(function(key){
    ret[key] = o[key]
  })
  return ret
}

