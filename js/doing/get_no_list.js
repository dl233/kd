const turl=require("url")
const sql=require("mssql")
const config=require("../../config/config").dbconfig

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
    
    if(obj.uid)
        str="select * from list where duser='1'"
    else
        str="select * from list"
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            recordsets.recordset.forEach(e=>{
                e.time=new Date(+new Date(e.time)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'') 
            })
            recordsets.recordset = recordsets.recordset.reverse()
            
            res.end(JSON.stringify(recordsets.recordset))
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Con'+err)
         })

 }