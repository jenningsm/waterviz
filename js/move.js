
//an object to create newtonian movements

function MoveGen(mover, totalTime){
  this.mover = mover
  this.start = 0
  this.stop = 1
  this.totalTime = totalTime
  this.currentTime = 0

  this.accel = 1
  this.decel = 1

  this.interrupted = false
}

MoveGen.prototype.ends = function(first, second){
  if(second === undefined){
    this.stop = first
  } else {
    this.start = first
    this.stop = second
  }
  return this
}

MoveGen.prototype.acceleration = function(accel, decel, maxSpeed){
  if(decel === undefined)
    decel = accel

  this.accel = accel
  this.decel = decel
  this.maxSpeed = maxSpeed

  return this
}

MoveGen.prototype.callback = function(cb){
  this.callback = cb
  return this
}

MoveGen.prototype.interrupt = function(){
  this.interrupted = true
  return this.position() 
}

MoveGen.prototype.position = function(){
  return this.start + (this.stop - this.start) * this.motion(this.currentTime)
}

//begin the movement
MoveGen.prototype.run = function(){
  this.currentTime = 0
  var speed = 1 / (60 * this.totalTime)

  this.motion = motionGen(this.accel, this.decel, this.maxSpeed)

  function transition(){
    if(!this.interrupted){
      this.currentTime += speed;
      if(this.currentTime < 1){
        this.mover(this.position())
        requestAnimationFrame(transition)
      } else {
        this.mover(this.stop)
        if(this.callback !== undefined){
          var hold = this.callback
          this.callback = undefined
          hold()
        }
      }
    }
  }
  transition = transition.bind(this)

  this.mover(this.start)
  requestAnimationFrame(transition);
  
}
