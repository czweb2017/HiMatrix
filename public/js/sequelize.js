// 引入sequelize
const Sequelize = require('sequelize')
const tables = require('./mysql_tables')

// 实例化sequelize 输入数据库名 用户名 密码
// 本机地址 数据库类型 最大连接数 延迟
const sequelize = new Sequelize('test','root','1234',{
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorsAliases: false
})

// 删除表格
const queryInterface = sequelize.getQueryInterface()
//queryInterface.dropTable('users')

function deleteTable(tableName){
    // 删除表 如果存在
    queryInterface.dropTable(tableName)
}

// 在指定的方案表中删除指定的表名
function findTablePlanAndDeleteOneLine(tableName,attrName){
    tables[tableName].findOne({
        where: {
            tableName: attrName
        }
    }).then(projects=>{
        projects.destroy()
    })
}

const newTable = sequelize.define('newTable', {
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    }
  });

// 仅适用于对绑定和切换的表格,将数据存储到已存在的表格
// 将数据存储到数据库
function storeData(obj, tableName) {
    // 先清除数据表
    if(obj !== undefined && tableName !== undefined){
        sequelize.query('truncate table ' + tableName)
        sequelize.sync()
        .then(()=> tables[tableName].create(obj))
    }
}

function insertIntoTable(tableName,obj) {
    // 不清除数据表
    if(obj !== undefined && tableName !== undefined){
        sequelize.sync()
        .then(()=> tables[tableName].create(obj))
    }
}

/**创建表并存储数据**/
// 输入:表名 格式 数据
function createAndStore(tableName,format,data){
    console.log(data)
    for(let item in format){
        if(format[item]==='string') format[item]=Sequelize.STRING
        else if(format[item]==='number') format[item]=Sequelize.INTEGER
    }
    const newSwitchTable = sequelize.define(tableName,format,{
        freezeTableName: true
    })
    sequelize.sync()
    .then(()=>{
        for(let item of data){
            newSwitchTable.create(item)
        }
    })
    // if(obj !== undefined && tableName !== undefined){
    //     sequelize.query('truncate table ' + tableName)
    //     sequelize.sync()
    //     .then(()=> tables[tableName].create(obj))
    // }
}

// 从数据库中取数
// 注意!需要对数据进行处理
// 非wire类型应该没有bind属性
function getData(tableName, func) {
    let dataArr = []
    tables[tableName].findAll().then(res=>{
        for (let i = 0 ; i < res.length; i++) {
            dataArr[i] = res[i].dataValues
            dataArr[i].id = dataArr[i].nodeId
            delete dataArr[i].nodeId
            delete dataArr[i].createdAt
            delete dataArr[i].updatedAt
        }
        if ( func&&typeof(func)==="function")  func(dataArr)
    })
}


// function getSwitchData(tableName,format,func) {
//     let dataArr = []
//     for(let item in format){
//         if(format[item]==='string') format[item]=Sequelize.STRING
//         else if(format[item]==='number') format[item]=Sequelize.INTEGER
//     }
//     const thisTable = sequelize.define(tableName,format,{
//         freezeTableName: true
//     })
//     thisTable.findAll().then(res=>{
//         for (let i = 0 ; i < res.length; i++) {
//             dataArr[i] = res[i].dataValues
//             dataArr[i].id = dataArr[i].nodeId
//             delete dataArr[i].nodeId
//             delete dataArr[i].createdAt
//             delete dataArr[i].updatedAt
//         }
//         if ( func&&typeof(func)==="function")  func(dataArr)
//     })
// }





/**其他**/
function getTableData(tableName,format,func) {
    let dataArr = []
    for(let item in format){
        if(format[item]==='string') format[item]=Sequelize.STRING
        else if(format[item]==='number') format[item]=Sequelize.INTEGER
    }
    const thisTable = sequelize.define(tableName,format,{
        freezeTableName: true
    })
    thisTable.findAll().then(res=>{
        for (let i = 0 ; i < res.length; i++) {
            dataArr[i] = res[i].dataValues
        }
        if ( func&&typeof(func)==="function")  func(dataArr)
    })
}

/**声明新的表**/
function declareNewTable(tableName,format){
    for(let item in format){
        if(format[item]==='string') format[item]=Sequelize.STRING
        else if(format[item]==='number') format[item]=Sequelize.INTEGER
    }
    const newSwitchTable = sequelize.define(tableName,format,{
        freezeTableName: true
    })
}
// function know(res){
//     console.log(res)
// }
// getTableData('wirePlanTable',know)

// 模板
// 创建表,并向表中存数,最后两列自动记录创建和修改时间
// input obj -- 数据库每行参数
// function createOrUpdataTable(obj) {
//     sequelize.sync()
//     .then(()=> User.create(obj))
//     .then(jane=>{
//         console.log(jane.toJSON())
//     })
// }

function storeAfterDrop(objArr, format, tableName) {
    // 先清除数据表
    for(let item in format){
        if(format[item]==='string') format[item]=Sequelize.STRING
        else if(format[item]==='number') format[item]=Sequelize.INTEGER
    }
    const thisTable = sequelize.define(tableName,format,{
        freezeTableName: true
    })
    if(tableName !== undefined){
        sequelize.query('truncate table ' + tableName)
        for(let obj of objArr){
            sequelize.sync()
            .then(()=> thisTable.create(obj))
        }
    }
}


module.exports = {
    storeData: storeData, // 存储树形结构数据
    getData: getData,  // 获取树形结构数据
    getTableData: getTableData, // 获取一般表格的数据
    deleteTable: deleteTable, // 删除表
    insertIntoTable: insertIntoTable,
    createAndStore: createAndStore,
    findTablePlanAndDeleteOneLine: findTablePlanAndDeleteOneLine,
    storeAfterDrop: storeAfterDrop
}