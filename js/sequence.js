
function sequence(setter, initialStates){
  
  var states = initialStates

  setter(states)

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
        setter,
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

function parallelMoves(setter, starts, stops, time, next){

  function specificPos(pos, key){
    return starts[key] + pos * (stops[key] - starts[key])
  }

  function aggregateSetter(x){
    var positions = {}
    Object.keys(starts).forEach(function(key){
      positions[key] = specificPos(x, key)
    })
    setter(positions)
  }

  var runner = new MoveGen(aggregateSetter, time)
  .acceleration(1, 1)
  .callback(next)


  function run(){
    runner.run()
  }

  function interrupt(){
    var states = {}
    var pos = runner.interrupt()
    Object.keys(starts).forEach(function(key){
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

