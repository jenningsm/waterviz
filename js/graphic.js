

var app = angular.module('graphic', [])

app.directive('graphic', ['$window', function($window){
  return {
    restrict : 'E',
    templateUrl : 'templates/graphic.html',
    link : link($window)
  }
}])

//the apparent distances are as a proportion of the
//maximum of the the width and height of the svg element

//these functions covert apparent distances into
//proportions of a specific dimension of the svg element
function realWidth(svgWidth, aspectRatio){
  return Math.max(1, 1 / aspectRatio) * svgWidth
}
function realHeight(svgHeight, aspectRatio){
  return Math.max(1, aspectRatio) * svgHeight
}

function link($window){
  return function(scope, el){

    var model = {
      'values' : new Tracker(),
      'centerOffset' : new Tracker(),
      'apparentCenterOffset' : new Tracker(),
      'distance' : new Tracker(),
      'left-radius' : new Tracker(),
      'right-radius' : new Tracker(),
      'dims' : new Tracker()
    }

    function getDims(){
      var dims = [el[0].offsetWidth, el[0].offsetHeight]
      model['dims'].update(dims)
    }
  
    var win = angular.element($window);
    win.bind("resize", getDims)
    getDims()
  


    /* --------------------------------- */

 
    //the two circle elements
    var circles = []
    //the two textboxes displaying the number of gallons represented by each circle
    var textBoxes = []
    for(var i = 0; i < 2; i++){
      circles.push(el[0].children[0].children[i])
      textBoxes.push(el[0].children[1].children[i])
    }
 
    // APPARENT CENTER OFFSET
    updater(
      subset(model, 'centerOffset', 'distance'),
      function(states){
        return states.centerOffset / states.distance
      },
      function(apparentCenterOffset, states){
        for(var i = 0; i < 2; i++){
          var pos = (i === 0 ? -1 : 1) * apparentCenterOffset
          model.apparentCenterOffset.update(apparentCenterOffset)
          circles[i].setAttribute('cx', .5 + pos)
        }
      }
    )

    updater(
      subset(model, 'apparentCenterOffset', 'dims'),
      function(states){
        return realWidth(states.apparentCenterOffset, states.dims[0] / states.dims[1])
      },
      function(realOffset, states){
        for(var i = 0; i < 2; i++){
          var pos = (i === 0 ? -1 : 1) * realOffset
          textBoxes[i].style.left = (50 + 100 * pos) + '%'
        }
      }
    )

    circleUpdater(model['left-radius'], model['distance'], model['dims'], circles[0], textBoxes[0])
    circleUpdater(model['right-radius'], model['distance'], model['dims'], circles[1], textBoxes[1])

    var setter = function(positions){
      updateModel(model, positions)
    }
  
    var dims = model.dims.get()
    states = getScene(0, 0, dims[0] / dims[1], 0)
    states.distance = 100
    states.centerOffset = (1 / 6) * states.distance
  
    var moveCircles = sequence(setter, states)

    updater(
      subset(model, 'values'),
      function(states){
        return states.values
      },
      function(newv){
        var distance = model.distance.get()
        if(distance === undefined)
          distance = 0
        var dims = model.dims.get()
        var newScene = getScene(newv.left, newv.right, dims[0] / dims[1], distance)
        var sceneSteps = getSteps(
          getModel(model, 'centerOffset', 'left-radius', 'right-radius', 'distance'),
          newScene
        )
  
        moveCircles.apply(this, sceneSteps)  
      }
    )

    function valueChange(newv){
      if(newv !== undefined && newv.left !== undefined && newv.right !== undefined)
        model.values.update(newv)
    }

    scope.$watch('values', valueChange, true)
  }
}

function translate(element, x, y){
  var transform = 'translate(' + x + ',' + y + ')'
  element.style.transform = transform
  element.style.webkitTransform = transform
}

function circleUpdater(radiusTracker, distanceTracker, dimTracker, circle, textBox){

  var model = {
    'radius' : radiusTracker,
    'apparentRadius' : new Tracker(),
    'gallons' : new Tracker(),
    'textStatus' : new Tracker(),
    'distance' : distanceTracker,
    'dims' : dimTracker,
    'textLength' : new Tracker()
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

  function numDigits(x){
    if(x < 1)
      return 1

    var i = 1
    var a = 10
    while(a < x){
      i++
      a *= 10
    }
    return i
  }

  // TEXT LENGTH
  updater(
    subset(model, 'gallons'),
    function(states){
      var gallons = states.gallons
      return numDigits(gallons)
    },
    function(){
      model.textLength.update(textBox.children[0].clientWidth)
    }
  )

  // GALLONS
  updater(
    subset(model, 'radius'),
    function(states){
      var radius = states.radius
      return roundValue(.5 * Math.PI * radius * radius)
    },
    function(gallons){
      textBox.children[0].innerHTML = gallons + ' gallons'
      model.gallons.update(gallons)
    }
  )

  updater(
    subset(model, 'textStatus'),
    function(states){
      return states.textStatus
    },
    function(stat){
      if(stat === 'out'){
        translate(textBox, 0, '50%')
        textBox.style.color = 'black'
      } else {
        translate(textBox, 0, 0)
        textBox.style.top = '50%'
        textBox.style.color = 'white'
      }
    }
  )

  // TEXT STATUS
  updater(
    subset(model, 'apparentRadius', 'dims', 'textLength'),
    function(states){
      var dims = states.dims

      var circleDiameter = 2 * dims[0] * states.apparentRadius

      //if the text is too large to fit in the circle, it will need to go outside the circle
      //if it is outside the circle, we will need to change its position everytime the radius changes
      //if it is inside the circle, its positions will remain static, so we only need to make
      //a change when it goes from outside the circle to inside
      if(circleDiameter < states.textLength + 4){
        //return the apparent radius
        return realHeight(states.apparentRadius, dims[0] / dims[1])
      } else {
        return 'in'
      }
    },
    function(stat, states){
      //if the text is inside the circle, sets its top position to match the apparent radius
      if(typeof stat === 'number'){
        textBox.style.top = ((.5 + stat) * 100) + '%'
      }
      //update the in-or-out status of the text
      model.textStatus.update(typeof stat === 'number' ? 'out' : 'in')
    }
  )

  // APPARENT RADIUS
  updater(
    subset(model, 'radius', 'distance'),
    function(states){
      return states.radius / states.distance
    },
    function(apparentRadius){
      circle.setAttribute('r', apparentRadius)
      model.apparentRadius.update(apparentRadius)
    }
  )
}

