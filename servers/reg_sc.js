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
    if(obj.password==password)
        str="insert into school(schoolname,saddress,logo) values('"+obj.schoolname+"','"+obj.saddress+"','"+obj.logo+"')"
    else{ 
        console.log(obj.password+"："+password)
        res.end('404')
    }
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            const tip=JSON.stringify(recordsets.rowsAffected)=='[1]'
            if(tip){
                str="select scid from school where schoolname='"+obj.schoolname+"'"
                new sql.Request().query(str).then(recd=>{
                    res.end(JSON.stringify({
                        tip:'ok',
                        scid:JSON.stringify(recd.recordset)
                    }))
                }).catch(e=>{
                    console.log(e)
                    res.end('error')
                })

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
