
var el = require('../utils/el.js')

module.exports = function(){
  return el('category', {'ng-repeat' : 'cat in cats | orderBy: &quot;-value&quot;', category : 'cat'})
}
