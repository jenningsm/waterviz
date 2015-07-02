
var el = require("./utils/el.js")

/*
  Used to create an svg element.

    width: the width of the element, as a string
    height: the height of the element, as a string
    color: the color of the lines within the element

*/
module.exports = function(width, height, color, num){

  var svg = el('svg').attribute({
    'viewBox' : '0 0 1 1',
    'xmlns' : 'http://www.w3.org/2000/svg',
    'version' : '1.1',
    'preserveAspectRatio' : 'xMidYMid slice'
  })
  .style({
    'height' : height,
    'width' : width,
    'fill' : color
  })

  for(var i = 0; i < num; i++){
    svg.content(
      el('circle', {
        'r' : 0,
        'cx' : .5,
        'cy' : .5
      })
    )
  }

  return svg
}

//truncated a number down to precision number of digits
//past the decimal point
function truncate(number, precision){
  number = number * Math.pow(10, precision)
  number = Math.round(number)
  return number / Math.pow(10, precision)
}
