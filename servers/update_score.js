const turl=require("url")
const sql=require("mssql")
const config=require("../config/config").dbconfig
const sd = require('silly-datetime')

module.exports = (req,res)=>{
    sql.close()
    querystr(req,res)
    res.on("end",()=>{
        try{
            sql.close()
        }catch(ex){
            console.info(ex);
        }
    })
}


async function querystr(req,res){
    var obj=turl.parse(req.url,true).query
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    if(obj)
        str="insert into money(uid,msg,time,type,num) values('"+obj.uid+"','"+obj.msg+"','"+time+"',"+obj.type+","+obj.num+")"
    console.log(str)
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            const tip=JSON.stringify(recordsets.rowsAffected)=='[1]'
            if(tip){
                res.end('ok')
            }else{
                res.end('error')
            }
     }).catch((err)=>{
            console.info(err)
            res.end('error')
         })
         }).catch((err)=>{
            console.info('Connection error')
         })

 }
