var Element = require('/home/mjennings/pagebuilder/html.js')

module.exports = function(pages, cssName){
  var elements = []
  var keys = Object.keys(pages)
  keys.forEach(function(key){
    elements.push(pages[key])
  })
  
  var p = Element.generate(elements, [{}], false);
  
  if(cssName === undefined)
    cssName = 'o.css'

  var fs = require('fs');
  if(p.css !== undefined){
    fs.writeFileSync('css/' + cssName, p.css);
  }
  
  for(var i = 0; i < keys.length; i++){
    fs.writeFileSync((keys[i] !== 'index' ? 'templates/' : '') + keys[i] + '.html', p.html[i]);
  }
}
