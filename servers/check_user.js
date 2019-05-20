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
    if(obj.uid)
        str="select * from user_table where uid='"+obj.uid+"'";
    else if(obj.phone)
        str="select * from user_table where phone='"+obj.phone+"'";
    else
        console.info(obj)
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            console.log(str)
            const re=JSON.stringify(recordsets.recordset)
            res.end(re)
     }).catch((err)=>{
            console.info(err)
            res.end('error')
         })
         }).catch((err)=>{
            console.info('Connection error')
         })

 }
