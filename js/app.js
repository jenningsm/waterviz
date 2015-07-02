
var app = angular.module('app', ['directives', 'graphic']);

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
  $scope.size = function(cat){
    return cat.name === $scope.current.name ? '1.4em' : '1em'
  }

}])

app.controller('VizController', ['$scope', function($scope){

  $scope.values = {} 

}])

