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
    
        str="select sfz from user_table where uid='"+obj.uid+"'";
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
              console.log(JSON.stringify(recordsets.recordset));
              
            const tip=JSON.stringify(recordsets.recordset)!=null&&JSON.stringify(recordsets.recordset)!='null'&&JSON.stringify(recordsets.recordset)!='[]'&&recordsets.recordset!=[]&&recordsets.recordset!='[]'
            console.log(JSON.stringify(recordsets.recordset))
            if(tip){
                res.end('ok')
            }else{
                res.end('error')
            }
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Connection error')
         })

 }
