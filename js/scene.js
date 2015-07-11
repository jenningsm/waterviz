/*

  There are four variables within our model for the scene: The radius
  of each of the two circles, the distance the circles are from the
  screen, and the distance, horizontally from the center each circle is.
  Each circle is always the same distance from the screen and from the
  horizontal center as the other is. These variables are unitless, as they
  only mean anything relative to each other.

  This model is then projected onto the screen. This projection has three
  variables: the apparent radius of each of the circles and the apparent center
  offset. These apparent variables have the svg viewbox units as units.

*/


/*
  leftValue: the value, in gallons, of the left circle
  rightValue: the value, in gallons, of the right circle
  aspectRatio: the width of the svg element divided by its height
  currentDist: the current distance of the circles from the screen in the model

  returns the model variables for the scene specified by the arguments
*/
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

/*
  Takes a new scene state and an old scene state and returns an array
  of scene states. This array is a series of steps from the old scene to
  the new scene. Each variable in each step is assigned the value of the
  corresponding variable in either the new scene or the old scene.
*/
function getSteps(oldScene, newScene){
  var steps = ['distance', 'centerOffset', ['left-radius', 'right-radius']]

  function timeFunction(constant){
    return function(oldv, newv){
      return Math.min(
        Math.pow(Math.abs(oldv-newv) * constant, .4),
        2
      )
    }
  }

  var globalConstant = .04
  var timeFunctions = [
    timeFunction(.02 * globalConstant),
    timeFunction(.09 * globalConstant),
    timeFunction(.35 * globalConstant)
  ]
  if(newScene.distance < oldScene.distance){
    steps.reverse()
    timeFunctions.reverse()
  }

  var sceneSteps = []
  var currentStep = shallowCopy(oldScene)
  for(var i = 0; i < steps.length; i++){
    if(!Array.isArray(steps[i]))
      steps[i] = [steps[i]]

    var time = 0

    for(var j = 0; j < steps[i].length; j++){
      currentStep[steps[i][j]] = newScene[steps[i][j]]
      time += timeFunctions[i](oldScene[steps[i][j]], newScene[steps[i][j]])
    }
    var newStep = shallowCopy(currentStep)
    newStep.time = time

    sceneSteps.push(newStep)
  }

  return sceneSteps
}

