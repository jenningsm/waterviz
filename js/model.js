

function Tracker(initialValue){

  this.value = initialValue
  this.subscribers = []

}

Tracker.prototype.get = function(){
  return this.value
}

Tracker.protoype.subscribe = function(callback){
  this.subscribers.push(callback)
}

Tracker.prototype.update = function(newValue){
  this.subscribers.forEach(function(subscriber){
    subscriber(newValue)
  })
  this.value = newValue
}

function updater(trackers, reduce, action){

  var state
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
    state[key] = trackers[tracker].get()
    trackers[tracker].subscribe(update(tracker))
  })
}
