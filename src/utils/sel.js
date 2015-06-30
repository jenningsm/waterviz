
var Selector = require('/home/mjennings/pagebuilder/selector.js')

module.exports = function(){
  var obj = Object.create(Selector.prototype)
  Selector.apply(obj, arguments)
  return obj
}
