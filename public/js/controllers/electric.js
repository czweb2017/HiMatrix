        /**配电绑定模块**/
        app.controller('electric' , function ($scope ,$route, $http) { // 配线模块
            const localSmlData = [
                { "id" : "sml0", "parent" : "#", "text" : "Root" , "type": "root"},
                { "id" : "sml1", "parent" : "sml0", "text" : "System 1" , "type": "system"},
                { "id" : "sml2", "parent" : "sml0", "text" : "System 2"  , "type": "system"},
                { "id" : "sml3", "parent" : "sml2", "text" : "Device 1"  , "type": "device"},
                { "id" : "sml4","parent" : "sml0","text" : "System 3"  , "type": "system"},
                { "id" : "sml5", "parent" : "sml3", "text" : "WireType 1"  , "type": "wiretype", "bind": null},
                { "id" : "sml6", "parent" : "sml3", "text" : "WireType 2"  , "type": "wiretype", "bind": null},
                { "id" : "sml7", "parent" : "sml5", "text" : "Wire 1"  , "type": "wire", "bind": 'rel8'},
                { "id" : "sml8", "parent" : "sml5", "text" : "Wire 2"  , "type": "wire", "bind": null},
                { "id" : "sml9", "parent" : "sml5", "text" : "Wire 3"  , "type": "wire", "bind": null},
                { "id" : "sml10", "parent" : "sml6", "text" : "Wire 1"  , "type": "wire", "bind": null},
                { "id" : "sml11", "parent" : "sml6", "text" : "Wire 2"  , "type": "wire", "bind": null},
                { "id" : "sml12", "parent" : "sml6", "text" : "Wire 3"  , "type": "wire", "bind": null},
                { "id" : "sml13", "parent" : "sml6", "text" : "Wire 4"  , "type": "wire", "bind": null}
            ]
            const realData = [
                { "id" : "rel1", "parent" : "#", "text" : "Service 1"  , "type": "service" , "bind": null },
                { "id" : "rel2", "parent" : "#", "text" : "Service 2"  , "type": "service" , "bind": null },
                { "id" : "rel3", "parent" : "#", "text" : "Service 3"  , "type": "service" , "bind": null },
                { "id" : "rel4", "parent" : "rel1", "text" : "Device 1"  , "type": "device" , "bind": null },
                { "id" : "rel5", "parent" : "rel1", "text" : "Device 2"  , "type": "device" , "bind": null },
                { "id" : "rel6", "parent" : "rel2", "text" : "Device 1"  , "type": "device" , "bind": null },
                { "id" : "rel7", "parent" : "rel3", "text" : "Device 1"  , "type": "device" , "bind": null },
                { "id" : "rel8", "parent" : "rel4", "text" : "Channel 1"  , "type": "channel" , "bind": 'sml7' },
                { "id" : "rel9", "parent" : "rel4", "text" : "Channel 2"  , "type": "channel" , "bind": null },
                { "id" : "rel10", "parent" : "rel4", "text" : "Channel 3"  , "type": "channel" , "bind": null },
                { "id" : "rel11", "parent" : "rel5", "text" : "Channel 1"  , "type": "channel" , "bind": null },
                { "id" : "rel12", "parent" : "rel5", "text" : "Channel 2"  , "type": "channel" , "bind": null },
                { "id" : "rel13", "parent" : "rel5", "text" : "Channel 3"  , "type": "channel" , "bind": null },
                { "id" : "rel14", "parent" : "rel5", "text" : "Channel 4"  , "type": "channel" , "bind": null },
                { "id" : "rel15", "parent" : "rel5", "text" : "Channel 5"  , "type": "channel" , "bind": null },
                { "id" : "rel16", "parent" : "rel6", "text" : "Channel 1"  , "type": "channel" , "bind": null },
                { "id" : "rel17", "parent" : "rel6", "text" : "Channel 2"  , "type": "channel" , "bind": null },
                { "id" : "rel18", "parent" : "rel6", "text" : "Channel 3"  , "type": "channel" , "bind": null },
                { "id" : "rel19", "parent" : "rel7", "text" : "Channel 1"  , "type": "channel" , "bind": null },
                { "id" : "rel20", "parent" : "rel7", "text" : "Channel 2"  , "type": "channel" , "bind": null },
                { "id" : "rel21", "parent" : "rel7", "text" : "Channel 3"  , "type": "channel" , "bind": null },
                { "id" : "rel22", "parent" : "rel7", "text" : "Channel 4"  , "type": "channel" , "bind": null },
                { "id" : "rel23", "parent" : "rel7", "text" : "Channel 5"  , "type": "channel" , "bind": null },
                { "id" : "rel24", "parent" : "rel7", "text" : "Channel 6"  , "type": "channel" , "bind": null },
            ]

            // 获取配线用户自定义数据
            $http({
                method: 'POST',
                url: '/getElectricSmlData',
                data: '123'
            }).success(req=>{
                // 删除非wire的bind属性
                for(let i=0;i<req.length;i++){
                    if ( req[i].type != 'wire') {
                        delete req[i].bind
                    }
                }
                $('#smlSys').jstree({
                    "core" : {
                        "check_callback" : true,
                        "themes" : {
                            "variant" : "large"
                        },
                        'data' : req
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
                          },
                        //   "card" : {
                        //     "icon" : "icon ion-clipboard",
                        //     "valid_children" : ['channel']
                        //   },
                        //   "channel" : {
                        //     "icon" : "icon ion-flash",
                        //     "valid_children" : []
                        //   },
                    },
                    "contextmenu":{
                        "items":{
                            "create":{
                                "label":"添加子项目",
                                "submenu":{
                                    "create system":{
                                        "label":"系统",
                                        "_disabled": function(data){
                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            if(obj.type==="root" || obj.type==="system"){
                                                return false
                                            }else{
                                                return true
                                            }
                                        },
                                        "action":function(data){  
                                            var inst = jQuery.jstree.reference(data.reference),  
                                            obj = inst.get_node(data.reference);  
                                            ////console.log(obj)
                                            if(obj.type==="system"){
                                                //console.log('添加子系统到系统！')
                                                const currentId =obj.children.length+1
                                                const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "System "+currentId  , "type": "system"}
                                                inst.create_node(obj, newNode, "last", function (new_node) {
                                                    try {
                                                        inst.edit(new_node)
                                                    } catch (ex) {
                                                        setTimeout(function () { inst.edit(new_node); },0)
                                                    }
                                                })
                                            }else if(obj.type==="root"){
                                                //console.log('添加系统到根目录！')
                                                const currentId =obj.children.length+1
                                                const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "System "+currentId  , "type": "system"}
                                                inst.create_node(obj, newNode, "last", function (new_node) {
                                                    try {
                                                        inst.edit(new_node)
                                                    } catch (ex) {
                                                        setTimeout(function () { inst.edit(new_node); },0)
                                                    }
                                                })
                                            }else{
                                                //console.log('非法操作！')
                                                return
                                            }
                                        }  
                                    },
                                    "create device":{
                                        "label":"设备",
                                        "_disabled": function(data){
                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            if(obj.type==="system"){
                                                return false
                                            }else{
                                                return true
                                            }
                                        },
                                        "action":function(data){  
                                            var inst = jQuery.jstree.reference(data.reference),  
                                            obj = inst.get_node(data.reference);  
                                            ////console.log(obj)
                                            if(obj.type==="system"){
                                                //console.log('添加设备到系统！')
                                                const currentId =obj.children.length+1
                                                const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "Device "+currentId  , "type": "device"}
                                                inst.create_node(obj, newNode, "last", function (new_node) {
                                                    try {
                                                        inst.edit(new_node)
                                                    } catch (ex) {
                                                        setTimeout(function () { inst.edit(new_node); },0)
                                                    }
                                                })
                                            }else{
                                                //console.log('非法操作！')
                                            }
                                        }  
                                    },
                                    "create wiretype":{
                                        "label":"信号组",
                                        "_disabled": function(data){
                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            if(obj.type==="device"){
                                                return false
                                            }else{
                                                return true
                                            }
                                        },
                                        "action":function(data){  
                                            var inst = jQuery.jstree.reference(data.reference),  
                                            obj = inst.get_node(data.reference);  
                                            ////console.log(obj)
                                            if(obj.type==="device"){
                                                //console.log('添加信号组到设备！')
                                                const currentId =obj.children.length+1
                                                const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype"}
                                                inst.create_node(obj, newNode, "last", function (new_node) {
                                                    try {
                                                        inst.edit(new_node)
                                                    } catch (ex) {
                                                        setTimeout(function () { inst.edit(new_node); },0)
                                                    }
                                                })
                                            }else{
                                                //console.log('非法操作！')
                                            }
                                        }  
                                    },
                                    "create channel":{
                                        "label":"通道",
                                        "_disabled": function(data){
                                            var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                            if(obj.type==="wiretype"){
                                                return false
                                            }else{
                                                return true
                                            }
                                        },
                                        "action":function(data){ 
                                            var inst = jQuery.jstree.reference(data.reference),  
                                            obj = inst.get_node(data.reference);
                                            if(obj.type==="wiretype"){
                                                //console.log('添加信号到信号组！')
                                                const currentId =obj.children.length+1
                                                const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "Wire "+currentId  , "type": "wire"}
                                                inst.create_node(obj, newNode, "last", function (new_node) {
                                                    try {
                                                        inst.edit(new_node)
                                                    } catch (ex) {
                                                        setTimeout(function () { inst.edit(new_node); },0)
                                                    }
                                                })
                                            }else{
                                                //console.log('非法操作！')
                                            }
                                        }
                                    }
                                }
                            },
                            "rename" : {
                      "separator_before"	: false,
                      "separator_after"	: false,
                      "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                      "label"				: "重命名",
                      /*!
                      "shortcut"			: 113,
                      "shortcut_label"	: 'F2',
                      "icon"				: "glyphicon glyphicon-leaf",
                      */
                      "action"			: function (data) {
                        var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                        inst.edit(obj);
                      }
                    },
                            "cancelBind" : {
                      "separator_before"	: false,
                      "separator_after"	: false,
                      "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                      "label"				: "取消绑定",
                      /*!
                      "shortcut"			: 113,
                      "shortcut_label"	: 'F2',
                      "icon"				: "glyphicon glyphicon-leaf",
                      */
                      "action"			: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    //console.log(obj)
                                    if(obj.original.bind==null){
                                        //console.log('未绑定！')
                                    }else{
                                        //console.log('已绑定！')
                                        const realNodeId = obj.original.bind
                                        obj.original.bind = null
                                        obj.original.bindName = null
                                        const realTreeData = $('#realSys').jstree(true)._model.data
                                        const realNodeObj = realTreeData[realNodeId]
                                        realNodeObj.original.bind = null
                                        realNodeObj.original.bindName = null
                                        $('#smlSys').jstree(true).redraw(true)
                                        $('#realSys').jstree(true).redraw(true)
                                    }
                      }
                    },
                            "ccp" : {
                      "separator_before"	: true,
                      "icon"				: false,
                      "separator_after"	: false,
                      "label"				: "编辑",
                      "action"			: false,
                      "submenu" : {
                        "cut" : {
                          "separator_before"	: false,
                          "separator_after"	: false,
                          "label"				: "剪切",
                          "action"			: function (data) {
                            var inst = $.jstree.reference(data.reference),
                              obj = inst.get_node(data.reference);
                            if(inst.is_selected(obj)) {
                              inst.cut(inst.get_top_selected());
                            }
                            else {
                              inst.cut(obj);
                            }
                          }
                        },
                        "copy" : {
                          "separator_before"	: false,
                          "icon"				: false,
                          "separator_after"	: false,
                          "label"				: "复制",
                          "action"			: function (data) {
                            var inst = $.jstree.reference(data.reference),
                              obj = inst.get_node(data.reference);
                            if(inst.is_selected(obj)) {
                              inst.copy(inst.get_top_selected());
                            }
                            else {
                              inst.copy(obj);
                            }
                          }
                        },
                        "paste" : {
                          "separator_before"	: false,
                          "icon"				: false,
                          "_disabled"			: function (data) {
                            return !$.jstree.reference(data.reference).can_paste();
                          },
                          "separator_after"	: false,
                          "label"				: "粘贴",
                          "action"			: function (data) {
                            var inst = $.jstree.reference(data.reference),
                              obj = inst.get_node(data.reference);
                            inst.paste(obj);
                          }
                        }
                      }
                    },
                            "remove" : {
                      "separator_before"	: false,
                      "icon"				: false,
                      "separator_after"	: false,
                      "_disabled"			: false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
                      "label"				: "删除",
                      "action"			: function (data) {
                        var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                        if(inst.is_selected(obj)) {
                          inst.delete_node(inst.get_selected());
                        }
                        else {
                          inst.delete_node(obj);
                        }
                      }
                            }
                        }
                    },
                    "state" : {
                        "key" : "electricSml"
                    },
                    "plugins" : [ "contextmenu", "dnd", "search",
                        "state", "types" , "changed","sort"]
                });
            })

            // 获取设备信息数据
            $http({
                method: 'POST',
                url: '/getElectricRealData',
                data: '获取设备数据'
            }).success(res=>{
                //console.log(res)
                $('#realSys').jstree({
                    "core" : {
                        "check_callback" : true,
                        "themes" : {
                            "variant" : "large"
                        },
                        'data' : res
                    },
                    "contextmenu": {
                        "items": {
                            "rename" : {
                      "separator_before"	: false,
                      "separator_after"	: false,
                      "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                      "label"				: "重命名",
                      /*!
                      "shortcut"			: 113,
                      "shortcut_label"	: 'F2',
                      "icon"				: "glyphicon glyphicon-leaf",
                      */
                      "action"			: function (data) {
                        var inst = $.jstree.reference(data.reference),
                          obj = inst.get_node(data.reference);
                        inst.edit(obj);
                      }
                    },
                            "cancelBind" : {
                      "separator_before"	: false,
                      "separator_after"	: false,
                      "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
                      "label"				: "取消绑定",
                      /*!
                      "shortcut"			: 113,
                      "shortcut_label"	: 'F2',
                      "icon"				: "glyphicon glyphicon-leaf",
                      */
                      "action"			: function (data) {
                                    const inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                    if(obj.original.bind==null){
                                        console.log('未绑定！')
                                    }else{
                                        console.log('已绑定！')
                                        const smlNodeId = obj.original.bind
                                        obj.original.bind = null
                                        obj.original.bindName = null
                                        const smlTreeData = $('#smlSys').jstree(true)._model.data
                                        const smlNodeObj = smlTreeData[smlNodeId]
                                        smlNodeObj.original.bind = null
                                        smlNodeObj.original.bindName = null
                                        $('#smlSys').jstree(true).redraw(true)
                                        $('#realSys').jstree(true).redraw(true)
                                    }
                      }
                            }
            
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
                        "key" : "electricReal"
                    },
                    "plugins" : [ "dnd", "search",
                        "state", "types" , "contextmenu","sort"]
                });
            })

            // 获取配线设备信息(需要与设备进行联调,暂时使用假数据)
          let wireBindData = []
          let wireSwitchData = [] // 从用户配线后的树形结构图中提取出来的源数据并去除没有绑定的node，可用于再次生成新的树
          let wireSwitchDataBindGroup = {} // 将wireSwitchData进行处理， 根据父对象id将子节点存到对应的属性值中
          
          // 从树形结构中获取源数据

          $scope.bindData =  [] // 存储右侧切换视图数据

          // save按钮功能实现,可以保存左右树的数据到sql
          $scope.storeWireBindData = function (){
            // refreshSwitchTree()
            // 循环找type为channel的对象，当其bind不为null时，按照bind中存储的id添加到全局对象中作为属性，判断
            // 全局对象中是否已存在该属性，没有创建，有就往里push
            //console.log('electricSwitchData',wireSwitchData)
            for (let i = 0 ; i< wireSwitchData.length; i++) {
                if (wireSwitchData[i].type === 'channel') { // 如果节点类型为channel
                  let parentId = wireSwitchData[i].parent // 获取父节点id
                  if (!wireSwitchDataBindGroup[parentId]) { // 如果设置的本地绑定数据对象中不存在父对象id同名的属性
                      wireSwitchDataBindGroup[parentId] = [] // 创建以父对象id同名的属性
                  }
                    /** 初始化对象 **/
                    const obj = {}
                    obj.sendsmlId = wireSwitchData[i].bind
                    obj.sendrealId = wireSwitchData[i].id
                    obj.wireSwitchState = 2 
                    wireSwitchDataBindGroup[parentId].push(obj) // 向该设备中传入对象
                }
            }
            // 将左侧用户定义的树形结构的数据处理后发送给node
            const smlData = $('#smlSys').jstree(true)._model.data
            const realData = $('#realSys').jstree(true)._model.data
            console.log('待处理的从树形结构提取的数据',smlData)
            const smlArr = [], realArr = []
            for (let item in smlData) {
                if (item !== '#') {
                    let obj ={}
                    obj.id = smlData[item].id
                    obj.parent = smlData[item].parent
                    obj.text = smlData[item].text
                    obj.type = smlData[item].type
                    if (smlData[item].original != undefined && smlData[item].original.bind != undefined){
                        obj.bind = smlData[item].original.bind
                    }
                    smlArr.push(obj)
                }
            }
            console.log('处理完的存入数据库的数据',smlArr)
            $http({
                method: 'POST',
                url: '/storeElectricSmlData',
                data: smlArr
            })
            // 将右侧用户定义的树形结构数据处理后发送给node
            for (let item in realData) {
                if (item !== '#') {
                    let obj ={}
                    obj.id = realData[item].id
                    obj.parent = realData[item].parent
                    obj.text = realData[item].text
                    obj.type = realData[item].type
                    if (realData[item].original != undefined && realData[item].original.bind != undefined){
                        obj.bind = realData[item].original.bind
                    }
                    realArr.push(obj)
                }
            }
            $http({
                method: 'POST',
                url: '/storeElectricRealData',
                data: realArr
            })
          }
         

          $scope.switchWire = function(goal, val) {
              goal.wireSwitchState = val
          }

          var smlSldId = null, relSldId = null, sendDataArrStorage = []

          // 渲染左侧用户自定义树
          $(function () {
              $('#smlSys').on("select_node.jstree", function (e, data) {
                  // //console.log(data)
                  smlSldId = data.selected[0];
                  //console.log('Selected sml item id: ',data);
                  // nodeData=data.node.original;
                  // nodeData.bind={"id" : "rel24", "parent" : "rel7", "text" : "Channel 6"  , "type": "channel"};
                  // nodeData.text=(nodeData.text+'_'+nodeData.bind.text);
                  // smlSldId = data.selected[0];
                  // $('#smlSys').jstree().refresh();
                //  $('#'+smlSldId).css('color','red').append('123')

              });
              $('#bind').on('click',()=>{
                  // 获取当前左右菜单选中项
                  const realNodeObj = $('#realSys').jstree(true).get_selected(true)[0];
                  const smlNodeObj = $('#smlSys').jstree(true).get_selected(true)[0];
                  // console.log(realNodeObj,smlNodeObj)
                  //获取选中项的
                  // const realNodeObj = $('#realSys').jstree(true)._model.data[relSldId]
                  // const smlNodeObj = $('#smlSys').jstree(true)._model.data[smlSldId]
          
          
                  if(smlNodeObj.type === 'wire' && realNodeObj.type === 'channel'){// 识别绑定对象类型
                      if (!realNodeObj.original.bind&&!smlNodeObj.original.bind){// 当两对象均未绑定时
                          realNodeObj.original.bind = smlSldId
                          smlNodeObj.original.bind = relSldId
                  
                          realNodeObj.original.bindName = smlNodeObj.text
                          smlNodeObj.original.bindName = realNodeObj.text
                  
                           $('#smlSys').jstree(true).redraw(true)
                           $('#realSys').jstree(true).redraw(true)
                      }else{
                          console.log('包含对象已绑定！先解绑')
                      }
                  }else{
                      console.log('绑定对象类型不匹配！')
                  }

              })
          });

          //渲染设备信息树
          $(function () {
              $('#realSys').on("changed.jstree", function (e, data) {
                  relSldId = data.selected[0];
              });
          });
          
          function getWireSendData() { // 获取配线数据，用于直接发送到node
              const dataModel = $('#realSys').jstree(true)._model.data // obj
              const sendDataArr = []
              let i = 0
              // //console.log(dataModel)
              for (let item in dataModel){
                  let sendsmlId = null, sendrealId = null
                  sendrealId = dataModel[item].id
                  if(dataModel[item].original != undefined){
                      if ( dataModel[item].original.bind != undefined ) {
                          sendsmlId = dataModel[item].original.bind
                      }
                      sendDataArr[i] = { sendsmlId, sendrealId }
                      i++
                  }
              }
              return sendDataArr
          }

          function getWireSwitchData(bindData) { // 检索getWireSendData返回的数据，返回绑定的数据
            const arr = []
            for (let i = 0; i < bindData.length; i++) {
              if( bindData[i].sendsmlId !== null && bindData[i].sendrealId !== null) {
                bindData[i].wireSwitchState = 2 // 0, 1, 2 -- 2 代表断开 1 代表仿真件 0 代表真件
                arr.push(bindData[i])
              }
            }
            //console.log('arr',arr)
            return arr
          }

          /**页面垂直自适应布局**/
          $('#smlSys').height(adH)
          $('#realSys').height(adH)
        })