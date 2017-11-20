        /**配线绑定模块**/
        app.controller('wire' , function ($scope ,$route, $http) { // 配线模块
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

            // 查找所有非叶子节点
            // 校验从数据库获取到的树形结构信息
            // 如果父节点全部子节点没有绑定那么颜色为蓝色 0
            //如果父节点子节点有绑定 那么新加属性 在树渲染之前 父节点黄色 1
            // 如果全部绑定 绿色 2
            function getChildrenBindState(arr){
                for (let i =0;i<arr.length;i++){
                    if ( arr[i].type === 'wiretype'){
                        const childrenArr = queryAllChildOfParent(arr[i].id,arr)
                        // 遍历子节点是否都绑定
                        let flag = 0 // 当前父节点子节点绑定个数 计数对比length
                        for (let j=0;j<childrenArr.length;j++){
                            if(childrenArr[j].bind != null){
                                flag++
                            }
                        }
                        if(flag===0){
                            arr[i].childrenBindState=0
                        }else if(flag===childrenArr.length){
                            arr[i].childrenBindState=2
                        }else{
                            arr[i].childrenBindState=1
                        }
                        console.log(arr[i].id, flag,childrenArr.length)
                    }
                    if ( arr[i].type === 'device'){
                        const childrenArr = queryAllChildOfParent(arr[i].id,arr)
                        // 遍历子节点是否都绑定
                        let flag = 0 // 当前父节点子节点绑定个数 计数对比length
                        for (let j=0;j<childrenArr.length;j++){
                            if(childrenArr[j].childrenBindState === 2){
                                flag++
                            }
                        }
                        if(flag===0){
                            arr[i].childrenBindState=0
                        }else if(flag===childrenArr.length){
                            arr[i].childrenBindState=2
                        }else{
                            arr[i].childrenBindState=1
                        }
                        console.log(arr[i].id, flag,childrenArr.length)
                    }
                }
            }
            
            // 查询非叶子节点的所有子节点并以数组返回
            function queryAllChildOfParent(str, arr) {
                let res = []
                for(let i =0;i<arr.length;i++){
                    if(arr[i].parent === str){
                        res.push(arr[i])
                    }
                }
                return res
            }
            
            // 获取配线用户自定义数据
            $http({
                method: 'POST',
                url: '/getWireSmlData',
                data: '123'
            }).success(req=>{
                //console.log(req)
                // 删除非wire的bind属性
                for(let i=0;i<req.length;i++){
                    if ( req[i].type != 'wire') {
                        delete req[i].bind
                    }
                }
                //console.log('模拟数据:',req)
                getChildrenBindState(req)
                //console.log('处理后的模拟数据:',req)

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
                                                    ////console.log('添加子系统到系统！')
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
                                                    ////console.log('添加系统到根目录！')
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
                                                    ////console.log('非法操作！')
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
                                                    ////console.log('添加设备到系统！')
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
                                                    ////console.log('非法操作！')
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
                                            "submenu": {
                                                "AD Typed":{
                                                    label: 'AD Typed',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'AD Typed'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
                                                },
                                                "AFDX Wire Typed": {
                                                    label: 'AFDX Wire Typed',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'AFDX Wire Typed'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
                                                },
                                                "Wire 429": {
                                                    label: 'Wire 429',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'Wire 429'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
                                                },
                                                "DA Typed": {
                                                    label: 'DA Typed',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'DA Typed'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
                                                },
                                                "DI Typed": {
                                                    label: 'DI Typed',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'DI Typed'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
                                                },
                                                "DO Typed": {
                                                    label: 'Do Typed',
                                                    "action":function(data){
                                                        var inst = jQuery.jstree.reference(data.reference),  
                                                        obj = inst.get_node(data.reference);  
                                                        ////console.log(obj)
                                                        if(obj.type==="device"){
                                                            ////console.log('添加信号组到设备！')
                                                            const currentId =obj.children.length+1
                                                            const newNode = { "id" : obj.id + "-"+currentId, "parent" : obj.id, "text" : "WireType "+currentId  , "type": "wiretype", wireType: 'DO Typed'}
                                                            inst.create_node(obj, newNode, "last", function (new_node) {
                                                                try {
                                                                    inst.edit(new_node)
                                                                } catch (ex) {
                                                                    setTimeout(function () { inst.edit(new_node); },0)
                                                                }
                                                            })
                                                        }else{
                                                            ////console.log('非法操作！')
                                                        }
                                                    }
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
                                                    ////console.log('添加信号到信号组！')
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
                                                    ////console.log('非法操作！')
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
                                                ////console.log(obj)
                                                if(obj.original.bind==null){
                                                    ////console.log('未绑定！')
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
                        "key" : "wireSml"
                    },
                    "plugins" : [ "contextmenu", "search",
                        "state", "types" , "changed", "sort"]
                });
            })

            // 获取设备信息数据
            $http({
                method: 'POST',
                url: '/getWireRealData',
                data: '获取设备数据'
            }).success(res=>{
                //console.log('真实数据',res)
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
                                        //console.log('未绑定！')
                                    }else{
                                        //console.log('已绑定！')
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
                        "key" : "wireReal"
                    },
                    "plugins" : [ "search",
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
            // 循环找type为channel的对象，当其bind不为null时，按照bind中存储的id添加到全局对象中作为属性，判断
            // 全局对象中是否已存在该属性，没有创建，有就往里push
            //console.log('wireSwitchData',wireSwitchData)
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
            //console.log('待处理的从树形结构提取的数据',smlData)
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
                    obj.wireType = smlData[item].original.wireType
                    // 遍历右侧树 获取text存入name属性
                    for(let item1 in realData){
                        //console.log(realData[item1].text)
                        if(realData[item1].id===obj.bind){
                            // console.log(realData[item1].text)
                            obj.bindName = realData[item1].text
                        }
                    }
                    smlArr.push(obj)
                }
            }
            // console.log('smlArr',smlArr)
            $http({
                method: 'POST',
                url: '/storeWireSmlData',
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
                    for(let item1 in smlData){
                        if(smlData[item1].id===obj.bind){
                            // console.log(realData[item1].text)
                            obj.bindName = smlData[item1].text
                        }
                    }
                    realArr.push(obj)
                }
            }
            console.log('realArr',realArr)
            $http({
                method: 'POST',
                url: '/storeWireRealData',
                data: realArr
            })
          }
         

          $scope.switchWire = function(goal, val) {
              goal.wireSwitchState = val
          }
          $scope.exportWireBindData = function() {
              $http({
                  url: '/exportWireBindData',
                  method: 'POST',
                  data: getWireSendData()
              })
          }

          var smlSldId = null, relSldId = null, sendDataArrStorage = []

          $(function () {
              $('#smlSys').on("select_node.jstree", function (e, data) {
                  smlSldId = data.selected[0];
                  //选中另一棵树的已绑定节点
                  const realData = $('#realSys').jstree(true)._model.data
                  const smlData = $('#smlSys').jstree(true)._model.data
                  const bindId = smlData[smlSldId].original.bind
                  if(bindId!==null&&!$('#realSys').jstree(true).is_selected(bindId)){
                    $('#realSys').jstree(true).deselect_all()
                    $('#realSys').jstree(true).select_node(bindId)
                  }
              });
              $('#bind').on('click',()=>{
                  // 获取当前左右菜单选中项
                  const realNodeObj = $('#realSys').jstree(true).get_selected(true)[0];
                  const smlNodeObj = $('#smlSys').jstree(true).get_selected(true)[0];
                //   console.log(realNodeObj,smlNodeObj)
                  // 获取选中项的
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
                      }
                  }

              });
              $('#realSys').on("select_node.jstree", function (e, data) {
                relSldId = data.selected[0];
                //选中另一棵树的已绑定节点
                const realData = $('#realSys').jstree(true)._model.data
                const smlData = $('#smlSys').jstree(true)._model.data
                const bindId = realData[relSldId].original.bind
                //console.log(realData,relSldId,bindId)
                if(bindId!==null&&!$('#smlSys').jstree(true).is_selected(bindId)){
                    $('#smlSys').jstree(true).deselect_all()
                    $('#smlSys').jstree(true).select_node(bindId)
                }
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
          $('#smlSys').height(screenHeight-170)
          $('#realSys').height(screenHeight-170)
        })