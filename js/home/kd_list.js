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
    
    // str="select * from get_table join elist on get_table.gid=elist.gid where get_table.scid="+obj.scid+" and elist.ename='"+obj.ename+"'"
    str ="select * from get_table where scid="+obj.scid+" and gid in(select gid from elist where ename='"+obj.ename+"')"

    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            console.info(str)
            console.log(JSON.stringify(recordsets.recordset))
            res.end(JSON.stringify(recordsets.recordset))
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Con'+err)
         })

 }