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
    var number=new Object()
    var number={
        num1:-1,
        num2:-1,
        num3:-1
    }
        str1="select num=count(*) from list where duser='1'"
        str2="select num=count(*) from list where duser='"+obj.uid+"' and struct=1"
        str3="select num=count(*) from list where duser='"+obj.uid+"' and struct=2"
    await sql.connect(config).then(()=>{
          new sql.Request().query(str1).then((recordsets)=>{
            
            number.num1=recordsets.recordset[0].num
            
                new sql.Request().query(str2).then(ress=>{
                    number.num2=ress.recordset[0].num
                    
                        new sql.Request().query(str3).then(resss=>{
                            number.num3= resss.recordset[0].num
                            console.log(JSON.stringify(number))
                            res.end(JSON.stringify(number))
                        }).catch(e=>{
                            console.log(e)
                        })
                    
                }).catch(e=>{
                    console.log(e)
                })
            
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Con'+err)
         })

 }