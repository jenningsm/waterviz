
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

    function motion(from, to){
      return parallelMoves(
        setters,
        from,
        to,
        function(){
          states = to
          queuedMotions.shift()
          if(queuedMotions.length !== 0)
            queuedMotions[0].run()
        }
      )
    }

    for(var i = 0; i < arguments.length; i++){
      var target = arguments[i]
      queuedMotions.push(
        motion(
          i === 0 ? states : copyObject(arguments[i-1]),
          copyObject(arguments[i])
        )
      )
    }

    queuedMotions[0].run()
    
  }
  
}

function parallelMoves(setters, start, stop, next){
  var runners = {}
  var numRunners = 0
  var numReturned = 0

  function done(){
    numReturned++
    if(numReturned === numRunners)
      next()
  }

  Object.keys(setters).forEach(function(key){
    if(start[key] !== stop[key]){
      numRunners++

      runners[key] = new MoveGen(setters[key], 2)
      .ends(start[key], stop[key])
      .acceleration(1, 1)
      .callback(done)
    }
  }) 

  function run(){
    Object.keys(runners).forEach(function(key){
      runners[key].run()
    })
  }

  function interrupt(){
    var ret = {}
    Object.keys(runners).forEach(function(key){
      ret[key] = runners[key].interrupt()
    })
    Object.keys(setters).forEach(function(key){
      //if ret[key] is undefined, the start and stop are equal
      if(ret[key] === undefined)
        ret[key] = start[key]
    })
    return ret
  }

  return {
    run : run,
    interrupt : interrupt
  }

}


function copyObject(states){
  var ret = {}
  Object.keys(states).forEach(function(key){
    ret[key] = states[key]
  })
  return ret
}

