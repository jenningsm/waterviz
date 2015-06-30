
function Model(){
  this.data = {}
  this.listeners = {}
}

Model.prototype.update = function(key, value){
  var change = this.data[key] !== value
  this.data[key] = value
  if(change && this.listeners[key] !== undefined){
    this.listeners[key].forEach(function(listener){
      listener(value)
    })
  }
}

Model.prototype.listen = function(key, cb){
  if(this.listeners[key] === undefined)
    this.listeners[key] = []

  this.listeners[key].push(cb)
}

//returns a model for a specific data item in this model
Model.prototype.item = function(key){
  return {
    update : bind(this.update(this, key)),
    listen : bind(this.listen(this, key))
  }
}
