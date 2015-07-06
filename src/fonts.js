var colors = require('./colors.js').colorStrings

var fonts = {
  main : {
    name : 'Yanone Kaffeesatz',
    weight : 200,
    color : colors.grey
  },

  title : {
    name : 'Buda',
    weight : 300,
    color : 'black'
  },
  
  offline : {
    name : 'Arial',
    weight : 200
  }
}

var fontLinks = {}

Object.keys(fonts).forEach(function(font){
  var fontName = fonts[font].name
  if(fontLinks[fontName] === undefined){
    fontLinks[fontName] = [fonts[font].weight]
  } else {
    fontLinks[fontName].push(fonts[font].weight)
  }
})

module.exports.fontLinks = fontLinks
module.exports.fonts = fonts
