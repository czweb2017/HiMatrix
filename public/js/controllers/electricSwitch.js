        /** 配电切换功能模块 **/
        app.controller('electricSwitch', function($scope, $route , $http) {
            // let wireSwitchDataBindGroup = {} // switch数据 obj
            // 实时显示的切换控件数据
            $scope.bindData = []
            // 切换控件功能
            $scope.switchWire = function(goal, val) {
                goal.wireSwitchState = val
            }
            $scope.getWireSwitchData = function(){}
            $scope.storeWireSwitchData = function(){
                //console.log('存储切换数据')
                // 处理switch对象 将其转化为数组 把属性名存入数组中每个对象的parent属性中
                let switchArr = []
                for(let item in wireSwitchDataBindGroup){
                    for(let i = 0;i<wireSwitchDataBindGroup[item].length;i++){
                        let obj = wireSwitchDataBindGroup[item][i]
                        obj.parent = item
                        switchArr.push(obj)
                    }
                }
                //console.log(switchArr)
                $http({
                    method:'POST',
                    url: '/storeElectricSwitchData',
                    data: switchArr
                })
            }

            // 生成树形图函数
             function createSwitchTree(data) { // 生成映射关系树
                    const wireSwitchData = []
                    // 处理设备数据将没有绑定的channel节点去除!
                    for(let i=0;i<data.length;i++){
                        if(data[i].type==='channel'&&data[i].bind === null){
                            continue
                        }
                        wireSwitchData.push(data[i])
                    }

                    // 生成切换数据
                    // for (let i = 0 ; i< wireSwitchData.length; i++) {
                    //     if (wireSwitchData[i].type === 'channel') { // 如果节点类型为channel
                    //       let parentId = wireSwitchData[i].parent // 获取父节点id
                    //       if (!wireSwitchDataBindGroup[parentId]) { // 如果设置的本地绑定数据对象中不存在父对象id同名的属性
                    //           wireSwitchDataBindGroup[parentId] = [] // 创建以父对象id同名的属性
                    //       }
                    //         /** 初始化对象 **/
                    //         const obj = {}
                    //         obj.sendsmlId = wireSwitchData[i].bind
                    //         obj.sendrealId = wireSwitchData[i].id
                    //         obj.wireSwitchState = 2 // 状态默认为2 断开
                    //         wireSwitchDataBindGroup[parentId].push(obj) // 向该设备中传入对象
                    //     }
                    // }
                    //console.log('wireSwitchDataBindGroup',wireSwitchDataBindGroup)
                    $('#switchTree').jstree({
                        "core" : {
                            "check_callback" : true,
                            "themes" : {
                                "variant" : "large"
                            },
                            'data' : wireSwitchData
                        },
                        "contextmenu": {
                            "items": {
                                "lru" : {
                                        "separator_before"	: false,
                                        "separator_after"	: false,
                                        "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                                        "label"				: "真件",
                                        /*!
                                        "shortcut"			: 113,
                                        "shortcut_label"	: 'F2',
                                        "icon"				: "glyphicon glyphicon-leaf",
                                        */
                                        "action"			: function (data) {

                                        }
                                    },
                                    "sim" : {
                                        "separator_before"	: false,
                                        "separator_after"	: false,
                                        "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                                        "label"				: "仿真件",
                                        /*!
                                        "shortcut"			: 113,
                                        "shortcut_label"	: 'F2',
                                        "icon"				: "glyphicon glyphicon-leaf",
                                        */
                                        "action"			: function (data) {

                                        }
                                    },
                                    "open" : {
                                        "separator_before"	: false,
                                        "separator_after"	: false,
                                        "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                                        "label"				: "断开",
                                        /*!
                                        "shortcut"			: 113,
                                        "shortcut_label"	: 'F2',
                                        "icon"				: "glyphicon glyphicon-leaf",
                                        */
                                        "action"			: function (data) {

                                        }
                                    },
                
                            }
                        },
                        "types" : {
                            "service" : {
                                "icon" : "icon ion-cloud",
                                "valid_children" : ["device"]
                            },
                            "device" : {
                                "icon" : "icon ion-filing",
                                "valid_children" : ["channel"]
                            },
                            "channel" : {
                                "icon" : "icon ion-outlet",
                                "valid_children" : ["channel"]
                            },
                        },
                        "state" : {
                            "key" : "electricSwitch"
                        },
                        "plugins" : [ "dnd", "search",
                            "state", "types" , "contextmenu","sort"]
                    });
                    $('#switchTree').on("select_node.jstree", function (e, data) {
                        const nodeObj = data.node
                        if (nodeObj.type === 'channel') {
                            //console.log('当前选中对象为channel')
                        }
                        if (nodeObj.type === 'device') {
                            if(wireSwitchDataBindGroup[nodeObj.id]) {
                                //console.log('切换到指定设备:' + nodeObj.id)
                                $scope.bindData = wireSwitchDataBindGroup[nodeObj.id]
                                $scope.$apply()
                                // angular.element(document.getElementById('ngapp')).scope().bindData = wireSwitchDataBindGroup[nodeObj.id]
                                ////console.log('ccccc',$scope.bindData,wireSwitchDataBindGroup[nodeObj.id])
                            }else{
                                $scope.bindData = []
                                $scope.$apply()
                            }
                        }
                        if (nodeObj.type === 'service') {
                            // 找到该服务的子项id 按照id将对象合并到bindData 置数 apply继续渲染
                            //console.log(nodeObj)
                            let arr = []
                            for (let i = 0 ; i < nodeObj.children.length; i++) { // 如果存储绑定关系的对象中有注册的属性名且数组长度不为0那么就拼接数组
                                if ( wireSwitchDataBindGroup[nodeObj.children[i]] && wireSwitchDataBindGroup[nodeObj.children[i]].length !== 0 ) {
                                    arr = arr.concat(wireSwitchDataBindGroup[nodeObj.children[i]])
                                }
                            }
                            //console.log(arr)
                            $scope.bindData = arr
                            $scope.$apply()


                        }
                    });
                    $('#switchTree').height(adH) // 调整树高
            }
            // http请求node获取sql中设备绑定信息
            $http({
                method: 'POST',
                url: '/getElectricRealData',
                data: '获取配线设备绑定数据'
            }).success(res=>{
                createSwitchTree(res)
                //console.log('用户定义的最新映射数据:',wireSwitchDataBindGroup)
                // 请求获取到sql中的绑定数据
                $http({
                    method: 'POST',
                    url: '/getElectricSwitchData',
                    data: 'get wire switch data'
                }).success(res=>{
                    //console.log('未及时更新新映射绑定的带有切换状态的数据:',res)
                    // 用户数据中切换状态默认为2,如果数据库中存在数据,覆盖用户数据
                    if(res.length>0){
                        for( let i = 0;i<res.length;i++){
                                if(wireSwitchDataBindGroup[res[i].parentId]){
                                    let localSwitchDataArr = wireSwitchDataBindGroup[res[i].parentId]
                                    for(let j = 0;j<localSwitchDataArr.length;j++){
                                        if(localSwitchDataArr[j].sendsmlId === res[i].smlId && localSwitchDataArr[j].sendrealId === res[i].realId){
                                            localSwitchDataArr[j].wireSwitchState = Number(res[i].wireSwitchState)
                                        }
                                    }
                                }
                        }
                    }
                })
            })
            // 保存数据模型到sql
        })