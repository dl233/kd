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
    
        str="update list set duser='"+obj.uid+"',struct=1 where tip='"+obj.tip+"' and duser='1'";
        console.info(obj)
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            const tip=JSON.stringify(recordsets.rowsAffected)=='[1]'
            if(tip){
                res.end('ok')
            }else{
                res.end('no')
            }
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Connection error')
         })

 }
