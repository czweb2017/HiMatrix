module.exports = app.controller('myBind', function ($scope, $route,$http) {
    $scope.$route = $route;
    $scope.name = '123';
    $scope.AdDetails = [
      { id: 0, bindState: false },
      { id: 1, bindState: false },
      { id: 2, bindState: false },
      { id: 3, bindState: false },
      { id: 4, bindState: false },
      { id: 5, bindState: false },
      { id: 6, bindState: false },
      { id: 7, bindState: false },
      { id: 8, bindState: false },
      { id: 9, bindState: false },
      { id: 10, bindState: false },
      { id: 11, bindState: false },
      { id: 12, bindState: false },
      { id: 13, bindState: false },
      { id: 14, bindState: false },
      { id: 15, bindState: false },
    ]
    $scope.DaDetails = [
      { id: 0, bindAdNum: null },
      { id: 1, bindAdNum: null },
      { id: 2, bindAdNum: null },
      { id: 3, bindAdNum: null },
      { id: 4, bindAdNum: null },
      { id: 5, bindAdNum: null },
      { id: 6, bindAdNum: null },
      { id: 7, bindAdNum: null },
      { id: 8, bindAdNum: null },
      { id: 9, bindAdNum: null },
      { id: 10, bindAdNum: null },
      { id: 11, bindAdNum: null },
      { id: 12, bindAdNum: null },
      { id: 13, bindAdNum: null },
      { id: 14, bindAdNum: null },
      { id: 15, bindAdNum: null },
    ]
    $scope.LvdtDetails = [
      { id: 0, bindAdNum: null },
      { id: 1, bindAdNum: null },
      { id: 2, bindAdNum: null },
      { id: 3, bindAdNum: null },
    ]
    $scope.AdSelected = 0
    $scope.bindAdDaArr = []
    $scope.bindAdLvdtArr = []
    $scope.selectAd = function (val){
      $scope.AdSelected = val
    }
    $scope.selectDa = function (val){
      $scope.DaDetails[val]['bindAdNum'] = $scope.AdSelected
    }
    $scope.selectLvdt = function (val){
      //console.log(val)
      $scope.LvdtDetails[val]['bindAdNum'] = $scope.AdSelected
    }
    $scope.getData = function (){
      let DAArr = [], LVDTArr = [];
      let AllArr = []
      for (let i =0;i<$scope.DaDetails.length;i++){
        if($scope.DaDetails[i]['bindAdNum']){
          DAArr[i] = $scope.DaDetails[i]['bindAdNum']
        }else{
          DAArr[i] = 0
        }
      }
      for (let i =0;i<4;i++){
        if($scope.LvdtDetails[i]['bindAdNum']){
          LVDTArr[i] = $scope.LvdtDetails[i]['bindAdNum']
        }else{
          LVDTArr[i] = 0
        }
      }
      AllArr = DAArr.concat(LVDTArr)
      //console.log(AllArr)
      return AllArr
    }

    /**bind all channels of a device**/
    $scope.bindDevice=function(Dev){
      for(let i=0;i<Dev.length;i++){
        Dev[i]['bindAdNum'] = $scope.AdSelected
      }
    }


    /** 发送数据给后端 **/
    $scope.sendDataToServer = function (){
      const data = this.getData()
      $http({
        method: 'POST',
        url: '/bindData',
        data: data
      })
    }
  })