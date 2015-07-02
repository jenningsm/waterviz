
var app = angular.module('app', ['directives']);

app.factory('Data', ['$http', function($http){

  var waterData = $http.get('data/water.json').then(function(data){
    return data.data
  })

  return {
    getData : function(type){
      return waterData.then(function(data){
        var cats = []
        var i = 0
        Object.keys(data[type]).forEach(function(cat){
          cats.push({'value' : data[type][cat], 'name' : cat})
        })
        cats.sort(function(a, b){
          return Number(a.value) > Number(b.value) ? -1 : 1
        })   
        return cats
      })
    }
  }

}])

app.controller('CatsController', ['$scope', 'Data', function($scope, data){

  data.getData($scope.domain).then(function(cats){
    $scope.cats = cats
    $scope.setCurrent(cats[0])
  })

  $scope.setCurrent = function(cat){
    $scope.current = cat
    $scope.$parent.values[$scope.domain === 'domestic' ? 'left' : 'right'] = cat.value
  }

  $scope.color = function(cat){
    return cat.name === $scope.current.name ? 'blue' : 'black'
  }

}])

app.controller('VizController', ['$scope', function($scope){

  $scope.values = {} 

}])

app.controller('GraphicController', ['$scope', function($scope){

  function areas(values){
    function area(value){
      return Math.sqrt(2 * value)
    }
    return {'left' : area(values.left), 'right' : area(values.right)}
  }

  function normalize(sizes){

    var rat = .8 * .5 * Math.min($scope.aspectRatio, 1 / $scope.aspectRatio) / Math.max(sizes.left, sizes.right)

    return { 'left' : sizes.left * rat, 'right' : sizes.right * rat}
  }

  var moveCircle = sequence({
    'left' : function(x){
      $scope.leftSize = x / 200
    },
    'right' : function(x){
      $scope.rightSize = x / 200
    }
  }, {'left' : .25, 'right' : .2 })

  $scope.$watch('$parent.values', function(newv){
    var scaled = normalize(areas(newv))
    $scope.leftSize = scaled.left
    $scope.rightSize = scaled.right

//    moveCircle(newv)

  }, true)


}])
