

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
  
    //made as an array so it can be passed by reference
    var distance = [50]
     
    function distanceSetter(dist){
      distance[0] = dist
    }
    function centerSetter(centerOffset){
      for(var i = 0; i < 2; i++){
        var pos = .5 + (i === 0 ? -1 : 1) * centerOffset / distance[0]
        circles[i].setAttribute('cx', pos)
        textBoxes[i].style.left = (100 * pos) + '%'
      }
    }
  
    var setters = {
      'distance' : distanceSetter,
      'left-radius' : radiusSetter(distance, dims, circles[0], textBoxes[0]),
      'right-radius' : radiusSetter(distance, dims, circles[1], textBoxes[1]),
      'centerOffset' : centerSetter
    }
  
    states = getScene(0, 0, aspectRatio, 0)
    states.distance = 100
    states.centerOffset = (1 / 6) * states.distance
  
    var oldScene = states
    var moveCircles = sequence(setters, states)
 
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

function translate(element, x, y){
  var transform = 'translate(' + x + ',' + y + ')'
  element.style.transform = transform
  element.style.webkitTransform = transform
}

function radiusSetter(distance, dims, circle, textBox){

  function changeDetector(initialValue, action, transform){
    if(transform === undefined)
      transform = function(x) { return x }
  
    var value = transform(initialValue)
    action(value)
  
    return function(newValue){
      if(transform(newValue) !== value){
        value = transform(newValue)
        action(value)
      }
    }
  }

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

  var textTracker = changeDetector(0,
    function(){
      textLength = textBox.children[0].clientWidth
    },
    function(gallons){
      if(gallons < 1)
        return 1

      return 1 + Math.floor(Math.log(gallons) / Math.LN10)
    }
  )

  var gallonDisplay = changeDetector(0, 
    function(gallons){
      textBox.children[0].innerHTML = gallons + ' gallons'
      textTracker(gallons)
    },
    function(radius){
      return roundValue(.5 * Math.PI * radius * radius)
    }
  )


  return function(radius){

    circle.setAttribute('r', radius / distance[0])

    gallonDisplay(radius)
    
    var circleDiameter = 2 * dims[0] * radius / distance[0]
    var aspectRatio = dims[0] / dims[1]

    if(circleDiameter < textLength){
      textBox.style.top = ((.505 + Math.max(1, aspectRatio) * radius / distance[0]) * 100) + '%'
      translate(textBox, 0, '50%')
      textBox.style.color = 'black'
    } else {
      translate(textBox, 0, 0)
      textBox.style.top = '50%'
      textBox.style.color = 'white'
    }
  }
}

function getSteps(oldScene, newScene){
  var steps = ['distance', 'centerOffset', ['left-radius', 'right-radius']]

  function timeFunction(constant){
    return function(oldv, newv){
      return Math.min(
        Math.sqrt(Math.abs(oldv-newv)) * constant,
        2
      )
    }
  }

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

