
function sequence(setters, initialStates){
  
  var states = initialStates

  Object.keys(setters).forEach(function(key){
    setters[key](states[key])
  })

  var queuedMotions = []

  /*
    A series of states to go to, one after the other.
    
    Each state is an associative array that maps setter
    keys to states that setter should eventually go to
  */
  return function(newStates1 /*, newStates2, ... */){
    if(queuedMotions.length !== 0)
      states = queuedMotions[0].interrupt()

    queuedMotions = []

    function motion(from, to, time){
      return parallelMoves(
        setters,
        from,
        to,
        time,
        function(){
          states = to
          queuedMotions.shift()
          if(queuedMotions.length !== 0)
            queuedMotions[0].run()
        }
      )
    }

    for(var i = 0; i < arguments.length; i++){
      queuedMotions.push(
        motion(
          i === 0 ? states : copyObject(arguments[i-1]),
          copyObject(arguments[i]),
          arguments[i].time
        )
      )
    }

    queuedMotions[0].run()
    
  }
  
}

function parallelMoves(setters, start, stop, time, next){

  function specificPos(pos, setter){
    return start[setter] + pos * (stop[setter] - start[setter])
  }

  function setter(x){
    Object.keys(setters).forEach(function(key){
      setters[key](specificPos(x, key))
    })
  }

  var runner = new MoveGen(setter, time)
  .acceleration(1, 1)
  .callback(next)


  function run(){
    runner.run()
  }

  function interrupt(){
    var states = {}
    var pos = runner.interrupt()
    Object.keys(setters).forEach(function(key){
      states[key] = specificPos(pos, key)
    })
    return states
  }

  return {
    run : run,
    interrupt : interrupt
  }

}


function copyObject(o){
  var ret = {}
  Object.keys(o).forEach(function(key){
    ret[key] = o[key]
  })
  return ret
}

