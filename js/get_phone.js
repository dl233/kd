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
    
        str="select X,Y,phone from user_table where uid='"+obj.uid+"'";
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            const re=JSON.stringify(recordsets.recordset)
            const tip=re!=null||re!='null'
            if(tip){
                console.info('get_phone_success')
                console.log(re)
                res.end(re)
            }else{
                console.info(re)
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
