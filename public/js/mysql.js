var mysql  = require('mysql');  

var connection = mysql.createConnection({     
 host     : 'localhost',       
 user     : 'root',              
 password : '1234',       
 port: '3306',                   
 database: 'test', 
}); 

connection.connect();

function getDBData(){
    var  sql = 'SELECT * FROM binddata';
    connection.query(sql,function (err, result) {
           if(err){
             console.log('[SELECT ERROR] - ',err.message);
             return;
           }
    
          console.log('--------------------------SELECT----------------------------');
          console.log(result[0].idwebsites);
          console.log('------------------------------------------------------------\n\n');  
    });
}
function updateDBData(data){
    var  sql = 'UPDATE binddata SET data = ? WHERE Id = 1'
    connection.query(sql, [data],(err, result)=>{
        if(err){
            console.log(err.message)
            return
        }
        console.log(result)
    })
}


module.exports = {
    getDBData: getDBData,
    updateDBData: updateDBData
}