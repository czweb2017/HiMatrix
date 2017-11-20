// 引入sequelize
const Sequelize = require('sequelize')

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


/*** 配线模块 ***/
// 配线用户自定义绑定数据表
const smlWireBindTable = sequelize.define('smlwirebindtable', {
    nodeId: Sequelize.STRING,
    parent: Sequelize.STRING,
    text: Sequelize.STRING,
    type: Sequelize.STRING,
    bind: Sequelize.STRING,
    bindName: Sequelize.STRING,
    wireType: Sequelize.STRING
},{
    freezeTableName: true
})

// 配线设备信息绑定数据表
const realWireBindTable = sequelize.define('realWireBindTable', {
    nodeId: Sequelize.STRING,
    parent: Sequelize.STRING,
    text: Sequelize.STRING,
    type: Sequelize.STRING,
    bind: Sequelize.STRING,
    bindName: Sequelize.STRING
},{
    freezeTableName: true
})

// 配线映射关系切换数据表
const wireBindSwitchTable = sequelize.define('wireBindSwitchTable', {
    parentId: Sequelize.STRING,
    smlId: Sequelize.STRING,
    realId: Sequelize.STRING,
    wireSwitchState: Sequelize.INTEGER
},{
    freezeTableName: true
})

/*** 配电模块 ***/
// 配电用户自定义绑定数据表
const smlElectricBindTable = sequelize.define('smlElectricBindTable', {
    nodeId: Sequelize.STRING,
    parent: Sequelize.STRING,
    text: Sequelize.STRING,
    type: Sequelize.STRING,
    bind: Sequelize.STRING
},{
    freezeTableName: true
})

// 配电设备信息绑定数据表
const realElectricBindTable = sequelize.define('realElectricBindTable', {
    nodeId: Sequelize.STRING,
    parent: Sequelize.STRING,
    text: Sequelize.STRING,
    type: Sequelize.STRING,
    bind: Sequelize.STRING
},{
    freezeTableName: true
})

// 配电映射关系切换数据表
const electricBindSwitchTable = sequelize.define('electricBindSwitchTable', {
    parentId: Sequelize.STRING,
    smlId: Sequelize.STRING,
    realId: Sequelize.STRING,
    wireSwitchState: Sequelize.INTEGER
},{
    freezeTableName: true
})


// 记录配线模块方案数量的表格
const wirePlanTable = sequelize.define('wirePlanTable', {
    tableName: Sequelize.STRING,
    details: Sequelize.STRING
},{
    freezeTableName: true
})

// 记录配电模块方案数量的表格
const electricPlanTable = sequelize.define('electricPlanTable', {
    tableName: Sequelize.STRING,
    details: Sequelize.STRING
},{
    freezeTableName: true
})

// 定义数据表的模板
// const tableName = sequelize.define('wireBindTab', {

// })
const tables = {
    smlWireBindTable: smlWireBindTable,
    realWireBindTable: realWireBindTable,
    wireBindSwitchTable: wireBindSwitchTable,
    smlElectricBindTable: smlElectricBindTable,
    realElectricBindTable: realElectricBindTable,
    electricBindSwitchTable: electricBindSwitchTable,
    wirePlanTable: wirePlanTable,
    electricPlanTable: electricPlanTable
}
module.exports = tables