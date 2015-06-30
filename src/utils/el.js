var Element = require('/home/mjennings/pagebuilder/html.js')

module.exports = function(){
  var obj = Object.create(Element.prototype)
  Element.apply(obj, arguments)
  return obj
}
