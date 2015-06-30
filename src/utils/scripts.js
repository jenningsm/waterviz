var el = require('./el.js')

module.exports = function(scripts){
  var copy = scripts.slice(0)
  for(var i = 0; i < copy.length; i++){
    copy[i] = el('script', 'src', copy[i])
  }
  return copy
}
