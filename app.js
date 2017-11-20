var sql = require('./public/js/mysql')
var express = require('express');
var app = express();
var fs = require('fs')
var sequelize = require('./public/js/sequelize')

//app.set('views',path.join('views'));
app.engine('html', require('ejs').renderFile);  // 引入ejs并设置渲染引擎
app.use(express.static(__dirname + '/public'));  //设置静态文件访问位置， 默认是没有的！
app.set('view engine','html'); // 设置渲染模板的文件类型  一般是.ejs 格式的 但是也可以设置为html 更方便调试

/*设置访问根目录时显示的界面*/
app.get('/', function (req, res) {
  res.render('index');
});

app.post('/bindData', (req, res)=>{
  let data = '' // 监听数据
  req.on('data', chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    console.log('Receive  wire-bind data form client: ', data)
    sql.updateDBData(data)
  })
})// 废弃

// 将配线绑定数据输出到txt文件
app.post('/exportWireBindData', (req, res)=>{
  let data = '' // 配线映射关系数据
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    console.log('Export wire-bind data from client into text file. Data:' + data)
    const writeStream = fs.createWriteStream('wireBindData.txt')
    writeStream.write(data)
  })
})





/**存储模块**/
// 存储配线用户自定义数据绑定数据
app.post('/storeWireSmlData', (req, res)=>{
  let data = ''
  req.on('data', chunk=>{
    data += chunk
  })
  req.on('end', ()=>{
    console.log(data)
    const wireSmlData = JSON.parse(data)
    for(let i = 0 ; i < wireSmlData.length ; i++ ) {
      let myObj = {
        nodeId: wireSmlData[i].id,
        parent: wireSmlData[i].parent,
        text: wireSmlData[i].text,
        type: wireSmlData[i].type,
        bind: wireSmlData[i].bind,
        bindName: wireSmlData[i].bindName,
        wireType: wireSmlData[i].wireType
    }
    console.log('myObj',myObj)
    sequelize.storeData(myObj,'smlWireBindTable')
    }

  })
})
// 存储realWireBindTable 数据
// real数据不可修改 为设备实时数据
app.post('/storeWireRealData', (req,res)=>{
  let data = ''
  req.on('data',chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    const wireRealData = JSON.parse(data)
    for(let i = 0 ; i < wireRealData.length ; i++ ) {
      let myObj = {
        nodeId: wireRealData[i].id,
        parent: wireRealData[i].parent,
        text: wireRealData[i].text,
        type: wireRealData[i].type,
        bind: wireRealData[i].bind,
        bindName: wireRealData[i].bindName
    }
    sequelize.storeData(myObj,'realWireBindTable')
    }
  })
})
//存储bindSwitchData
app.post('/storeWireSwitchData', (req,res)=>{
  let data = ''
  req.on('data', chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    console.log('存储切换数据')
    console.log(data)
    const switchData = JSON.parse(data)
    for(let i = 0 ; i < switchData.length ; i++ ) {
      let myObj = {
        parentId: switchData[i].parentId,
        smlId: switchData[i].smlId,
        realId: switchData[i].realId,
        wireSwitchState: switchData[i].wireSwitchState
    }
    sequelize.storeData(myObj,'wireBindSwitchTable')
    }
  })
})

// 存储配电用户自定义数据绑定数据
app.post('/storeElectricSmlData', (req, res)=>{
  let data = ''
  req.on('data', chunk=>{
    data += chunk
  })
  req.on('end', ()=>{
    // console.log(data)
    const wireSmlData = JSON.parse(data)
    for(let i = 0 ; i < wireSmlData.length ; i++ ) {
      let myObj = {
        nodeId: wireSmlData[i].id,
        parent: wireSmlData[i].parent,
        text: wireSmlData[i].text,
        type: wireSmlData[i].type,
        bind: wireSmlData[i].bind
    }
    sequelize.storeData(myObj,'smlElectricBindTable')
    }

  })
})
// 存储realElectricBindTable 数据
// real数据不可修改 为设备实时数据
app.post('/storeElectricRealData', (req,res)=>{
  let data = ''
  req.on('data',chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    const wireRealData = JSON.parse(data)
    for(let i = 0 ; i < wireRealData.length ; i++ ) {
      let myObj = {
        nodeId: wireRealData[i].id,
        parent: wireRealData[i].parent,
        text: wireRealData[i].text,
        type: wireRealData[i].type,
        bind: wireRealData[i].bind
    }
    sequelize.storeData(myObj,'realElectricBindTable')
    }
  })
})
//存储bindSwitchData
app.post('/storeElectricSwitchData', (req,res)=>{
  let data = ''
  req.on('data', chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    console.log('存储切换数据')
    console.log(data)
    const switchData = JSON.parse(data)
    for(let i = 0 ; i < switchData.length ; i++ ) {
      let myObj = {
        parentId: switchData[i].parent,
        smlId: switchData[i].sendsmlId,
        realId: switchData[i].sendrealId,
        wireSwitchState: switchData[i].wireSwitchState
    }
    sequelize.storeData(myObj,'electricBindSwitchTable')
    }
  })
})


/**取数模块**/
//在页面点开后自动请求smlwirebindtable
app.post('/getWireSmlData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('smlWireBindTable', data=>{
      res.send(data)
    })
  })
})

app.post('/getSwitchData', (req, res)=>{
  let tableName = ''
  const format = {
    parentId: 'string',
    smlId: 'string',
    realId: 'string',
    wireSwitchState: 'number',
  }
  req.on('data',chunk=>{
    tableName += chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getTableData(tableName, format, data=>{
      res.send(data)
    })
  })
})

// 更新配线
app.post('/clearAndStoreTable', (req, res)=>{
  let data = ''
  const format = {
    parentId: 'string',
    smlId: 'string',
    realId: 'string',
    wireSwitchState: 'number',
  }
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    // {tableName}
    data = JSON.parse(data)
    sequelize.storeAfterDrop(data.switchDataArr,format,data.tableName)
  })
})

//在页面点开后自动请求realwirebindtable
app.post('/getWireRealData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('realWireBindTable', data=>{
      res.send(data)
    })
  })
})

// 获取wireSwitchData
app.post('/getWireSwitchData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('wireBindSwitchTable', data=>{
      res.send(data)
    })
  })
})


//在页面点开后自动请求smlElectricBindTable数据
app.post('/getElectricSmlData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('smlElectricBindTable', data=>{
      res.send(data)
    })
  })
})

//在页面点开后自动请求realElectricBindTable数据
app.post('/getElectricRealData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data += chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('realElectricBindTable', data=>{
      res.send(data)
    })
  })
})

// 获取wireSwitchData
app.post('/getElectricSwitchData', (req, res)=>{
  let data = ''
  req.on('data',chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    let dataArr = sequelize.getData('electricBindSwitchTable', data=>{
      res.send(data)
    })
  })
})


/**plan模块**/
// 获取wirePlanData的数据
app.post('/getWirePlanData',(req,res)=>{
  let data = ''
  req.on('data',chunk=>[
    data+=chunk
  ])
  const format = {
    tableName: 'string',
    details: 'string'
  }
  req.on('end',()=>{
    sequelize.getTableData('wirePlanTable',format,data=>{
      res.send(data)
    })
  })
})

app.post('/storeWirePlanData', (req,res)=>{
  let data = '' // {tableName: '',content: '',data: [{},{},{}...]}
  req.on('data', chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    const planData = JSON.parse(data)
    // console.log('data',planData.data)
    const planObj = {tableName: planData.tableName,details: planData.details}
    sequelize.insertIntoTable('wirePlanTable',planObj)
    
    const format = {
        parentId: 'string',
        smlId: 'string',
        realId: 'string',
        wireSwitchState: 'number'
    }
    sequelize.createAndStore(planData.tableName,format,planData.data)
  })
})

app.post('/dropTable',(req,res)=>{
  let data = ''
  req.on('data',chunk=>{
    data+=chunk
  })
  req.on('end',()=>{
    const tableName = data
    console.log(tableName)
    sequelize.findTablePlanAndDeleteOneLine('wirePlanTable',tableName)
    sequelize.deleteTable(tableName)
  })
})

// // 在页面开始渲染时获取realWireBindTable数据 
// app.post('/getWireRealData',(req,res)=>{
//   let dataArr = sequelize.getData('realWireBindTable',data=>{
//     res.send(data)
//   })
// })

/*创建服务器 本地3000端口*/
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log(' App listening at http://%s:%s', host, port);
});