
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
          cats.push({'value' : data[type][cat], 'index' : i++, 'name' : cat})
        })
        return cats
      })
    }
  }

}])

app.controller('CatsController', ['$scope', 'Data', function($scope, data){

  data.getData($scope.domain).then(function(cats){
    $scope.cats = cats
    $scope.current = cats[0].index
  })

  $scope.color = function(index){
    return index === $scope.current ? 'blue' : 'black'
  }

  $scope.setCurrent = function(index){
    $scope.current = index
  }

}])

