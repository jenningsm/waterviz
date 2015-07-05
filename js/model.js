

function Tracker(initialValue){

  this.value = initialValue
  this.subscribers = []

}

Tracker.prototype.get = function(){
  return this.value
}

Tracker.prototype.subscribe = function(callback){
  this.subscribers.push(callback)
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

  function update(tracker){
    return function(value){
      state[tracker] = value
      var newReduced = reduce(state)
      if(newReduced !== reducedValue){
        action(newReduced, state)
        reducedValue = newReduced
      }
    }
  }

  Object.keys(trackers).forEach(function(tracker){
    state[tracker] = trackers[tracker].get()
  })

  reducedValue = reduce(state)
  action(reducedValue, state)

  Object.keys(trackers).forEach(function(tracker){
    trackers[tracker].subscribe(update(tracker))
  })
}

function update(model, values){
  Object.keys(values).forEach(function(key){
    if(model[key] !== undefined)
      model[key].update(values[key])
  })
}

function subset(set){
  var ret = {}
  for(var i = 1; i < arguments.length; i++){
    ret[arguments[i]] = set[arguments[i]]
  }
  return ret
}
