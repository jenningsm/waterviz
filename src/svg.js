
var el = require("./utils/el.js")

/*
  Used to create an svg element.

    width: the width of the element, as a string
    height: the height of the element, as a string
    color: the color of the lines within the element

*/
module.exports = function(width, height, color){

  var svg = el('svg').attribute({
    'viewBox' : '0 0 1 1',
    'xmlns' : 'http://www.w3.org/2000/svg',
    'version' : '1.1'
  })
  .style({
    'height' : height,
    'width' : width,
    'fill' : color
  })

  return function(x, y, r){
    if(x !== undefined){
      var circle = el('circle/').attribute({
        'cx' : truncate(x, 2),
        'cy' : truncate(y, 2),
        'r' : truncate(r, 2),
      })
      svg.content(circle)
      return circle
    }
    return svg
  }
}

//truncated a number down to precision number of digits
//past the decimal point
function truncate(number, precision){
  number = number * Math.pow(10, precision)
  number = Math.round(number)
  return number / Math.pow(10, precision)
}
