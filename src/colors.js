
var colors = {
  'primary' : [230, 14, 14],
  'secondary' : [220, 172, 36],
  'grey' : [50, 50, 50]
}

var colorStrings = {}

Object.keys(colors).forEach(function(color){
  var values = colors[color]
  colorStrings[color] = 'rgb(' + values[0] + ',' + values[1] + ',' + values[2] + ')'
})

module.exports.colors = colors
module.exports.colorStrings = colorStrings
