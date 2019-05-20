const turl=require("url")
const sql=require("mssql")
const config=require("../config/config").dbconfig

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
    
        str="update user_table set X='"+obj.X+"',Y='"+obj.Y+"' where uid='"+obj.uid+"'";
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
