        /** 配线切换功能模块 **/
        app.controller('wireSwitch', function($scope, $route , $http) {

            let wireSwitchDataBindGroup = {} // switch数据 obj
            // 树形结构图原始数据
            $scope.treeData = null
            // 实时显示的切换控件数据
            $scope.bindData = []

            // 检验父节点所有子节点switch相同 更新的是scopretreedata中的数据
            function checkSiblingsSwitch(currentNodeId){
                // 获取渲染树数据
                const localTreeData=$('#switchTree').jstree(true)._model.data
                for(let item in localTreeData){
                    if(item === currentNodeId){
                        const parents = localTreeData[item].parents
                        for(let i=0;i<parents.length;i++){
                            if(parents[i]!=='#'){
                                for(let j=0;j<$scope.treeData.length;j++){
                                    // 将当前节点切换状态改变
                                    if($scope.treeData[j].id===parents[i]){
                                        $scope.treeData[j].switch=9
                                    }
                                }
                            }
                        }
                    }
                }
                /**获取兄弟节点校验所有节点是否switch均相等**/
                // 获取父节点的所有子节点
                let siblings = [],parentId='',sibSwitchState = null,sibSwitchFlag = true
                //父节点id
                let currentState = ''
                for(let i=0;i<$scope.treeData.length;i++){
                    if($scope.treeData[i].id===currentNodeId){
                        currentState = $scope.treeData[i].switch
                    }
                }
                console.log('currentState',currentState)
                for(let item in localTreeData){
                    if(item===currentNodeId){
                        parentId = localTreeData[item].parent
                        break
                    }
                }
                if(parentId==='#'){
                    return
                }
                for(let item in localTreeData){
                    if(item===parentId){
                        siblings=localTreeData[item].children_d // 父节点所有子节点,不是直接
                        break
                    }
                }
                //console.log('localTreeData',localTreeData)
                //校验查看是够所有兄弟switch相同
                for(let i=0;i<siblings.length;i++){
                    for(let j=0;j<$scope.treeData.length;j++){
                        if(siblings[i]===$scope.treeData[j].id){
                            console.log($scope.treeData[j].switch)
                                if(parseInt(currentState)!==parseInt($scope.treeData[j].switch)){
                                    console.log($scope.treeData[j].switch)
                                    sibSwitchFlag=false
                                    //console.log('存在不同!')
                                    return
                                }
                        }
                    }
                }
                //console.log('sibSwitchState',sibSwitchState)
                if(sibSwitchFlag===true){
                    console.log('所有兄弟节点switch相同')
                    for(let i=0;i<$scope.treeData.length;i++){
                        if($scope.treeData[i].id===parentId){
                                $scope.treeData[i].switch=currentState
                                console.log('parent',$scope.treeData[i])
                        }
                    }
                    return checkSiblingsSwitch(parentId)
                }else{
                    for(let i=0;i<$scope.treeData.length;i++){
                        if($scope.treeData[i].id===parentId){
                                $scope.treeData[i].switch=9
                        }
                    }
                }
            }
            // 切换控件功能
            $scope.switchWire = function(goal, val) {
                goal.switch = val
                for(let i=0;i<$scope.treeData.length;i++){
                    // 将当前节点切换状态改变
                    if($scope.treeData[i].id===goal.id){
                        $scope.treeData[i].switch=val
                    }
                }
                //如果节点不是叶子节点 将其所有子节点状态切换
                const localTreeData=$('#switchTree').jstree(true)._model.data
                
                if(localTreeData===null){
                    localTreeData=$('#switchTree').jstree(true)._model.data
                }
                if(goal.type!=='wire'){
                    for(let item in localTreeData){
                        if(goal.id===item){
                            const childrenArr = localTreeData[item].children_d
                            for(let j=0;j<childrenArr.length;j++){
                                const goalId = childrenArr[j]
                                for(let k=0;k<$scope.treeData.length;k++){
                                    if($scope.treeData[k].id===goalId){
                                        $scope.treeData[k].switch=val
                                    }
                                }
                            }
                        }
                    }
                }
                //找父节点的父节点的...将switch设置为9
                //获取所有父节点

                checkSiblingsSwitch(goal.id) // 校验
                compareAndRefreshTree($scope.treeData,$('#switchTree').jstree(true)._model.data)
                $('#switchTree').jstree(true).redraw(true) 
            }
            // 存储切换数据到数据库
            $scope.storeWireSwitchData = function(){
                //console.log('存储切换数据')
                // 处理switch对象 将其转化为数组 把属性名存入数组中每个对象的parent属性中
                // console.log($scope.treeData)
                let switchArr = []
                for(let i=0;i<$scope.treeData.length;i++){
                    const obj ={
                        parentId: $scope.treeData[i].parent,
                        smlId: $scope.treeData[i].id,
                        realId: $scope.treeData[i].bind,
                        wireSwitchState: $scope.treeData[i].switch
                    }
                    switchArr.push(obj)
                }
                // console.log(switchArr)
                $http({
                    method:'POST',
                    url: '/storeWireSwitchData',
                    data: switchArr
                })
            }
            // 生成树形图函数
            function createSwitchTree() { // 生成映射关系树
                    const wireSwitchData = []
                    // 处理设备数据将没有绑定的channel节点去除!
                    for(let i=0;i<$scope.treeData.length;i++){
                        // $scope.treeData[i].switch = 2 // 添加切换属性
                        if($scope.treeData[i].type==='wire'&&$scope.treeData[i].bind === null){
                            continue
                        }
                        wireSwitchData.push($scope.treeData[i])
                    }
                    $scope.treeData=wireSwitchData
                    // console.log('wireSwitchData',wireSwitchData)
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
                                            const inst = jQuery.jstree.reference(data.reference),obj = inst.get_node(data.reference);
                                            menuSwitchState(obj,0) // 菜单修改scopetreedata数据
                                            const currentId = obj.id
                                            compareAndRefreshTree($scope.treeData,$('#switchTree').jstree(true)._model.data)
                                            $('#switchTree').jstree(true).redraw(true) // 刷新树
                                            $('#'+currentId+'_anchor').trigger('click')
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
                                            const inst = jQuery.jstree.reference(data.reference),obj = inst.get_node(data.reference);
                                            menuSwitchState(obj,1)
                                            const currentId = obj.id
                                            compareAndRefreshTree($scope.treeData,$('#switchTree').jstree(true)._model.data)
                                            $('#switchTree').jstree(true).redraw(true)                 
                                            $('#'+currentId+'_anchor').trigger('click')                                            
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
                                            const inst = jQuery.jstree.reference(data.reference),obj = inst.get_node(data.reference);
                                            menuSwitchState(obj,2)
                                            const currentId = obj.id
                                            compareAndRefreshTree($scope.treeData,$('#switchTree').jstree(true)._model.data)
                                            $('#switchTree').jstree(true).redraw(true)             
                                            $('#'+currentId+'_anchor').trigger('click')
                                            
                                        }
                                    },
                
                            }
                        },
                        "types" : {
                            "root" : {
                              "icon" : "icon ion-home",
                              "valid_children" : ["system"]
                            },
                            "system" : {
                              "icon" : "icon ion-cube",
                              "valid_children" : ["system","device"]
                            },
                            "device" : {
                              "icon" : "icon ion-filing"
                            },
                            "wiretype" : {
                              "icon" : "icon ion-folder"
                            },
                            "wire" : {
                              "icon" : "icon ion-flash"
                            }
                      },
                        "state" : {
                            "key" : "wireSwitch"
                        },
                        "plugins" : [ "search",
                            "state", "types" , "contextmenu","sort"]
                    });
                    $('#switchTree').on("select_node.jstree", function (e, data) {
                        const nodeObj = data.node
                        if (nodeObj.type === 'wiretype') {
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
                        if (nodeObj.type !== 'wire') {
                            // console.log('data',$scope.treeData)
                            let arr = []
                            let name = '',switchState = 2, id = '',type=''
                            // console.log(nodeObj.children)
                            for(let i=0;i<nodeObj.children.length;i++){
                                for(let j=0;j<$scope.treeData.length;j++){
                                    if($scope.treeData[j].id==nodeObj.children[i]){
                                        name=$scope.treeData[j].text
                                        switchState=$scope.treeData[j].switch
                                        id=$scope.treeData[j].id
                                        type=$scope.treeData[j].type
                                        break
                                    }
                                }
                                arr.push({name: name, switch: switchState, id: id,type:type})
                            }
                            $scope.bindData = arr
                            $scope.$apply()
                        }else if(nodeObj.type==='wire'){
                            $scope.bindData = []        
                            $scope.$apply()                    
                        }
                    });
                    $('#switchTree').height(screenHeight-120) // 调整树高
            }
            // 根据scope.treeData对比更新树中数据
            function compareAndRefreshTree(sqlData,treeData){
                console.log(sqlData,treeData)
                // 将sql中switch赋值给tree
                for(let i=0;i<sqlData.length;i++){
                    for(let item in treeData){
                        if(item==sqlData[i].id){
                            treeData[item].original.switch=sqlData[i].switch
                        }
                    }
                }
            }

            /**右键菜单功能**/
            function menuSwitchState(currentNode,state){
                const currentId = currentNode.id
                for(let i=0;i<$scope.treeData.length;i++){
                    // 将当前节点切换状态改变
                    if($scope.treeData[i].id===currentId){
                        $scope.treeData[i].switch=state
                    }
                }
                //如果节点不是叶子节点 将其所有子节点状态切换
                const localTreeData=$('#switchTree').jstree(true)._model.data
                
                if(currentNode.type!=='wire'){
                    for(let item in localTreeData){
                        if(currentNode.id===item){
                            const childrenArr = localTreeData[item].children_d
                            for(let j=0;j<childrenArr.length;j++){
                                const goalId = childrenArr[j]
                                for(let k=0;k<$scope.treeData.length;k++){
                                    if($scope.treeData[k].id===goalId){
                                        $scope.treeData[k].switch=state
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                //找父节点的父节点的...将switch设置为9
                //获取所有父节点
                checkSiblingsSwitch(currentId) // 校验
                console.log($scope.treeData)
            }
            // http请求node获取sql中设备绑定信息
            $http({
                method: 'POST',
                url: '/getWireSmlData',
                data: '获取配线设备绑定数据'
            }).success(bindRes=>{
                // 获取switch信息
                $http({
                    method: 'POST',
                    url: '/getWireSwitchData',
                    data: 'get wire switch data'
                }).success(switchRes=>{
                    // console.log('switchData',switchRes)
                    // 对比switch 如果switchRes中switch不为2 即断开 就修改bindRes中的switch
                    for(let i=0;i<bindRes.length;i++){
                        bindRes[i].switch=2
                    }
                    for(let i=0;i<switchRes.length;i++){
                        // console.log(switchRes[i].wireSwitchState)
                            for(let j=0;j<bindRes.length;j++){
                                if(switchRes[i].smlId===bindRes[j].id){
                                    bindRes[j].switch=switchRes[i].wireSwitchState
                                    break
                                }
                            }
                    }
                    // console.log('bindRes',bindRes)
                    $scope.treeData = bindRes
                    createSwitchTree($scope.treeData)
                })
            })



            /**方案切换以及保存**/
                        // 对侧边栏进行动画绑定
            let sideBoxOpenState = false
            // 绑定
            $('#sideBoxBtn').on('click',()=>{
                if(sideBoxOpenState===true){
                    $('#sideBox').animate({right: '-300px'})
                    sideBoxOpenState=false
                }else{
                    $('#sideBox').animate({right: '0'})
                    sideBoxOpenState=true
                }
            })
            $('#closeWin').on('click',()=>{
                $('#myPlan').fadeOut()
                $('#loading').fadeOut()
            })
            $('#createNewPlan').on('click',()=>{
                $('#myPlan').fadeIn()
                $('#sideBox').animate({right: '-300px'})
                sideBoxOpenState=false
            })
            // $('#confirm').on('click',()=>{
            //     $('#loading').fadeIn()
            // })

            $scope.delPlanIndex = null
            $scope.delPlan = function(index){
                $scope.delPlanIndex = index
                const planName = $scope.plansData[index].tableName
                $('#delPlanDetails').html('确认要删除'+planName+'这个方案吗?')
                $('#deletePlan').fadeIn()
            }
            $scope.adtDelPlan = function(){
                $scope.deletePlan($scope.delPlanIndex)
            }
            $scope.cancelDelPlan = function(){
                $('#deletePlan').fadeOut()
            }

            /**提示模块**/
            $scope.loadingMessage = 'Loading'

            $scope.loading = function(str,time){
                $scope.loadingMessage = str
                $('#loading').fadeIn()
                setTimeout(()=>{
                $('#loading').fadeOut()
                },time*1000)
            }

            $scope.alert = function(str,time){
                $scope.loadingMessage = str
                $('#alert').fadeIn()
                setTimeout(()=>{
                $('#alert').fadeOut()
                },time*1000)
            }

            $scope.changePlan =function(){
                if($scope.planSelected!=undefined || $scope.planSelected != null){
                    const tableName = $scope.plansData[$scope.planSelected].tableName
                    console.log(tableName)
                    wireSwitchDataBindGroup = {}
                    $scope.treeData = null
                    $scope.bindData = []
                    $scope.planChoosed = $scope.planSelected
                    $http({
                        method: 'POST',
                        url: '/getWireSmlData',
                        data: ''
                    }).success(bindRes=>{
                        // console.log('bindRes',bindRes)
                        // 获取switch信息
                        $('#switchTree').remove()    
                        $('#treeHome').append('<div id="switchTree" style="overflow-y:auto;overflow-x:hidden;"></div>')
                        $http({
                            method: 'POST',
                            url: '/getSwitchData',
                            data: tableName
                        }).success(switchRes=>{
                            // 对比switch 如果switchRes中switch不为2 即断开 就修改bindRes中的switch
                            for(let i=0;i<bindRes.length;i++){
                                bindRes[i].switch=2
                            }
                            for(let i=0;i<switchRes.length;i++){
                                // console.log(switchRes[i].wireSwitchState)
                                    for(let j=0;j<bindRes.length;j++){                      
                                        if(switchRes[i].smlId===bindRes[j].id){
                                            bindRes[j].switch=switchRes[i].wireSwitchState
                                            break
                                        }
                                    }
                            }
                            $scope.treeData = bindRes
                            createSwitchTree($scope.treeData)
                        })
                    })
                }else{
                    $scope.alert('尚未选中方案!',2)
                }
            }
            
            $scope.updateTable = function(){
                if($scope.planSelected!=undefined||$scope.planSelected!=null){
                    $scope.loading('保存中',5)
                    let switchArr = []
                    for(let i=0;i<$scope.treeData.length;i++){
                        const obj ={
                            parentId: $scope.treeData[i].parent,
                            smlId: $scope.treeData[i].id,
                            realId: $scope.treeData[i].bind,
                            wireSwitchState: $scope.treeData[i].switch
                        }
                        switchArr.push(obj)
                    }
                    const data = {
                        tableName: $scope.plansData[$scope.planSelected].tableName,
                        switchDataArr: switchArr
                    }
                    console.log(data)
                    $http({
                        method: 'POST',
                        url: '/clearAndStoreTable',
                        data: data
                    })
                }else{
                    $scope.alert('请先切换到指定方案！',2)
                }
            }

            $scope.planSelected = null//  当前选中id
            $scope.planChoosed = null// 当前显示的方案id
            $scope.plansData = [] // 方案数据
            $scope.sltPlan = function(goal){
                $scope.planSelected = goal // 当前选中id
                // console.log($scope.plansData)
                $scope.planShowName = $scope.plansData[goal].tableName
                $scope.planShowCreatedTime = $scope.plansData[goal].createdAt
                $scope.planShowDetails = $scope.plansData[goal].details
            }
            $scope.planShowName = ''
            $scope.planShowCreatedTime = ''
            $scope.planShowDetails = ''

            // 保存方案
            $scope.storePlanDetails=function(loadingName){
                // $scope.loading(loadingName)
                // 转化切换数据
                let switchArr = []
                for(let i=0;i<$scope.treeData.length;i++){
                    const obj ={
                        parentId: $scope.treeData[i].parent,
                        smlId: $scope.treeData[i].id,
                        realId: $scope.treeData[i].bind,
                        wireSwitchState: $scope.treeData[i].switch
                    }
                    switchArr.push(obj)
                }

                const planName = $('#planName').val()
                $('#planName').val('')
                const planContent = $('#planContent').val()
                $('#planContent').val('')
                const sendData = {
                    tableName: planName,
                    details: planContent,
                    data: switchArr
                }
                $http({
                    method: 'POST',
                    url: '/storeWirePlanData',
                    data: sendData
                })
                const newPlan = {tableName: planName, details: planContent}
                $scope.plansData.push(newPlan)
                $('#myPlan').fadeOut()
                $scope.loading('正在保存方案...',5)
            }
            // 删除方案
            $scope.deletePlan = function(index){
                // console.log($scope.planSelected)
                if($scope.planSelected!==null){
                    // console.log($scope.plansData[$scope.planSelected])
                    $http({
                        method: 'POST',
                        url: '/dropTable',
                        data: $scope.plansData[index].tableName
                    })
                }
                $scope.plansData.splice($scope.planSelected,1)
            }
            // 加载方案并更新列表
            $scope.initPlan = function(){
                const floatBoxHeight = screenHeight-56
                $('#sideBox').height(floatBoxHeight)
                $('#sideBoxBtn').css('top',floatBoxHeight/2-50)
                $('#planBox').css('height',floatBoxHeight-370)
                $http({
                    method: 'POST',
                    url: 'getWirePlanData',
                    data: 'getWirePlanData'
                }).success(res=>{
                    $scope.plansData = res
                })
            }
            $scope.initPlan()
            // 保存数据模型到sql
        })