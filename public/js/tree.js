var smlSldId = null
var relSldId = null
var smlData = [
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
var realData = [
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
$(function () {
    // 6 create an instance when the DOM is ready
    $('#smlSys').jstree({
        "core" : {
            "check_callback" : true,
            "themes" : {
                "variant" : "large"
            },
            'data' : smlData
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
                                //console.log(obj)
                                if(obj.type==="system"){
                                    console.log('添加子系统到系统！')
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
                                    console.log('添加系统到根目录！')
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
                                    console.log('非法操作！')
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
                                //console.log(obj)
                                if(obj.type==="system"){
                                    console.log('添加设备到系统！')
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
                                    console.log('非法操作！')
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
                                //console.log(obj)
                                if(obj.type==="device"){
                                    console.log('添加信号组到设备！')
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
                                    console.log('非法操作！')
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
                                    console.log('添加信号到信号组！')
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
                                    console.log('非法操作！')
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
                        console.log(obj)
                        if(obj.original.bind==null){
                            console.log('未绑定！')
                        }else{
                            console.log('已绑定！')
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
        "plugins" : [ "contextmenu", "dnd", "search",
            "state", "types" , "changed"]
    });
    // 7 bind to events triggered on the tree
    $('#smlSys').on("changed.jstree", function (e, data) {
        // console.log(data)
        smlSldId = data.selected[0];
        //console.log('Selected sml item id: ',data);
        // nodeData=data.node.original;
        // nodeData.bind={"id" : "rel24", "parent" : "rel7", "text" : "Channel 6"  , "type": "channel"};
        // nodeData.text=(nodeData.text+'_'+nodeData.bind.text);
        // smlSldId = data.selected[0];
        // $('#smlSys').jstree().refresh();
      //  $('#'+smlSldId).css('color','red').append('123')
    //   smlTree.refresh_node(nodeData);
    });
    // 8 interact with the tree - either way is OK
    // $('button').on('click', function () {
        // $('#smlSys').jstree(true).select_node('child_node_1');
        // $('#smlSys').jstree('select_node', 'child_node_1');
        // $.jstree.reference('#smlSys').select_node('child_node_1');

    // });
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
    $('#save').on('click',()=>{
        const data = getSendData()
        console.log(data)
    })
});

$(function () {
    // 6 create an instance when the DOM is ready
    $('#realSys').jstree({
        "core" : {
            "check_callback" : true,
            "themes" : {
                "variant" : "large"
            },
            'data' : realData
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
        "plugins" : [ "dnd", "search",
            "state", "types" , "contextmenu"]
    });
    // 7 bind to events triggered on the tree
    $('#realSys').on("changed.jstree", function (e, data) {
        // console.log('Selected item id:', data.selected[0]);
        relSldId = data.selected[0];
    });
    // 8 interact with the tree - either way is OK
    // $('button').on('click', function () {
    //     $('#realSys').jstree(true).select_node('child_node_1');
    //     $('#realSys').jstree('select_node', 'child_node_1');
    //     $.jstree.reference('#realSys').select_node('child_node_1');
    // });
});

function getSendData() {
    const dataModel = $('#realSys').jstree(true)._model.data // obj
    const sendDataArr = []
    let i = 0
    // console.log(dataModel)
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