const turl=require("url")
const sql=require("mssql")
const config=require("../config/config").dbconfig
const password=require("../config/config").password

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
    console.log(obj)
    if(obj.password==password)
        str="insert into elist(ename,gid) values('"+obj.ename+"',"+obj.gid+")"
    else{
        console.log(obj.password+"："+password)
        res.end('404')
    }
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
