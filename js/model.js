

function Tracker(initialValue){

  this.value = initialValue
  this.subscribers = []

}

Tracker.prototype.get = function(){
  return this.value
}

Tracker.prototype.subscribe = function(callback){
  this.subscribers.push(callback)
  if(this.value !== undefined)
    callback(this.value)
}

Tracker.prototype.update = function(newValue){
  this.subscribers.forEach(function(subscriber){
    subscriber(newValue)
  })
  this.value = newValue
}

function updater(trackers, reduce, action){

  var state = {}
  var reducedValue
  var inputsDefined = false

  if(reduce === null){
    reduce = function(x){ return x }
  }

  function reevaluate(){
    var newReduced = shallowCopy(reduce(state))

    var different = false
    if(reducedValue === undefined){
      different = true
    } else if(Array.isArray(newReduced)){
      newReduced.forEach(function(newReducedValue, index){
        if(reducedValue[index] !== newReducedValue)
          different = true
      })
    } else if (typeof newReduced === 'object'){
      Object.keys(newReduced).forEach(function(key){
        if(reducedValue[key] !== newReduced[key])
          different = true
      })
    } else {
      different = newReduced !== reducedValue
    }
    if(different){
      action(newReduced, state)
      reducedValue = shallowCopy(newReduced)
    }
  }

  function update(tracker){
    return function(value){
      state[tracker] = value

      if(!inputsDefined){
        inputsDefined = true
        Object.keys(trackers).forEach(function(key){
          if(state[key] === undefined)
            inputsDefined = false
        })
      }

      if(inputsDefined)
        reevaluate()
    }
  }

  Object.keys(trackers).forEach(function(tracker){
    trackers[tracker].subscribe(update(tracker))
  })

}

function updateModel(model, values){
  Object.keys(values).forEach(function(key){
    if(model[key] !== undefined)
      model[key].update(values[key])
  })
}

function getModel(model){
  var ret = {}
  for(var i = 1; i < arguments.length; i++){
    ret[arguments[i]] = model[arguments[i]].get()
  }
  return ret
}

function subset(set){
  var ret = {}
  for(var i = 1; i < arguments.length; i++){
    ret[arguments[i]] = set[arguments[i]]
  }
  return ret
}
