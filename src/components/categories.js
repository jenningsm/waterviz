
var el = require('../utils/el.js')
var stys = require('../styles.js')
var sty = stys.style

module.exports = function(data, model){

  var sortedCats = sortCats(data)

  var ret = el()

  for(var i = 0; i < sortedCats.length; i++){
    ret.content(
      el('span', {'onclick' : model + '.update(' + data[sortedCats[i]] + ')'})
      .content(
        sortedCats[i]
      )
    )
  }
  return ret
}


function sortCats(cats){
  var reverseIndex = {}
  Object.keys(cats).forEach(function(cat){
    if(reverseIndex[cats[cat]] === undefined)
      reverseIndex[cats[cat]] = []

    reverseIndex[cats[cat]].push(cat)
  })
  
  var sortedValues = Object.keys(reverseIndex)
  sortedValues.sort(function(a, b) { 
    return (Number(a) > Number(b) ? -1 : 1)
  })

  var sortedCats = []
  for(var i = 0; i < sortedValues.length; i++){
    sortedCats = sortedCats.concat(reverseIndex[sortedValues[i]])
  }
  return sortedCats
}
