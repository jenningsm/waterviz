
var sel = require('./utils/sel.js')

var breakPoint = 900

module.exports = function(element, small, big){
  element.assign(
    sel('@media (max-width: ' + breakPoint + 'px)', '$').style(small),
    [0]
  )
  element.assign(
    sel('@media (min-width: ' + breakPoint + 'px)', '$').style(big),
    [0]
  )
}
