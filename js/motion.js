
/*
  returns a function that maps the range [0,1] to the domain [0,1]. The mapping
  simulates newtonian motion, with the input being time and the output being the 
  position of the object moving at that time.

  accel is the acceleration, decel is the deceleration, and maxSpeed is the max speed
  of the motion

  they are defined in abstract units are are only important relative to each other
  for example motion(2, 2, 3) will return the same function as motion(4, 4, 6);
*/

function motionGen(accel, decel, maxSpeed){

  var startSpeed, stopSpeed, maxSpeed;

  if(maxSpeed === undefined)
    maxSpeed = 0;

  if(accel === 0)
    startSpeed = maxSpeed;
  else
    startSpeed = 0;

  if(decel === 0)
    stopSpeed = maxSpeed;
  else 
    stopSpeed = 0;


  //the point in time at which the item will begin to decelerate
  var decelAt = (decel + stopSpeed - startSpeed) / (decel + accel);
  if(maxSpeed !== 0){
    if(decel === 0){
      decelAt = 1;
    } else {
      decelAt = Math.max(decelAt, 1 - (maxSpeed - stopSpeed) / decel);
    }
  }

  //the point in time at which the item will stop accelerating
  var stopAccelAt;
  if(accel === 0){
    stopAccelAt = 0;
  } else if(maxSpeed === 0) {
    stopAccelAt = decelAt
  } else {
    stopAccelAt = Math.min(decelAt, (maxSpeed - startSpeed) / accel);
  }

  //the total distance that will be travelled, used to scale down to 1
  var totalDist = 0;
  totalDist += .5 * accel * Math.pow(stopAccelAt, 2);
  totalDist += maxSpeed * (decelAt - stopAccelAt);
  totalDist += ((1 - decelAt) * decel + stopSpeed)* (1 - decelAt) - .5 * decel * Math.pow(1 - decelAt, 2);

  return function(x){

    if(x >= 1){
      return 1;
    }

    //amount of time spent accelerating, floating, and decelerating, respectively
    var accelFor = Math.min(x, stopAccelAt);
    var floatFor = Math.max(0, Math.min(x - stopAccelAt, decelAt - stopAccelAt));
    var decelFor = Math.max(0, x - decelAt);

    //amount of distance traveled while accelerating, floating, and decelerating, respectively
    var accelDist = .5 * accel * accelFor * accelFor + accelFor * startSpeed;
    var floatDist = floatFor * maxSpeed;
    var decelDist = ((1 - decelAt) * decel + stopSpeed) * decelFor - .5 * decel * Math.pow(decelFor, 2); 

    return (accelDist + floatDist + decelDist) / totalDist;
  } 
}


