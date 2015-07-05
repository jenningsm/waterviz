
function verticalTextPosition(textBox, dims){
  var textStatus = changeDetector(
    function(stat){
      if(stat === 'out'){
        translate(textBox, 0, '50%')
        textBox.style.color = 'black'
      } else {
        translate(textBox, 0, 0)
        textBox.style.top = '50%'
        textBox.style.color = 'white'
      }
    },
    function(stat){
      if(typeof stat === 'number'){
        return 'out'
      } else {
        return 'in'
      }
    }
  )

  var textPositionChange = changeDetector(
    function(stat){
      //if the text is inside the circle, sets its top position to match the apparent radius
      if(typeof stat === 'number'){
        var aspectRatio = dims[0] / dims[1]
        textBox.style.top = ((.5 + realHeight(stat, aspectRatio)) * 100) + '%'
      }
      //update the in-or-out status of the text
      textStatus(stat)
    },
    function(radius, distance){
      var circleDiameter = 2 * dims[0] * radius / distance

      //if the text is too large to fit in the circle, it will need to go outside the circle
      //if it is outside the circle, we will need to change its position everytime the radius changes
      //if it is inside the circle, its positions will remain static, so we only need to make
      //a change when it goes from outside the circle to inside
      if(circleDiameter < textLength + 4){
        //return the apparent radius
        return radius / distance
      } else {
        return 'in'
      }
    }
  )
}
