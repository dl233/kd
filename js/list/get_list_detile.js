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
    
    if(obj.gid)
        str="select gname,X,Y from get_table where gid='"+obj.gid+"'"
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            console.log(JSON.stringify(recordsets.recordset))

            res.end(JSON.stringify(recordsets.recordset))
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Con'+err)
         })

 }