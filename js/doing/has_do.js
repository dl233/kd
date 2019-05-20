const turl=require("url")
const sql=require("mssql")
const config=require("../../config/config").dbconfig
const sd = require('silly-datetime')

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
    const obj=turl.parse(req.url,true).query
    const time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    
        str="update list set struct=2 where duser='"+obj.uid+"' and tip='"+obj.tip+"' and struct=1"
        console.info(obj)
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            const tip=JSON.stringify(recordsets.rowsAffected)=='[1]'
            if(tip){
                str = "insert into money(uid,time,msg,type,num) values('"+obj.uid+"','"+time+"','派件',1,"+obj.money+")"
                new sql.Request().query(str).then(re=>{
                    console.info('has_do_money')
                    str = "update user_table set score="+obj.score+" where uid='"+obj.uid+"'"
                    console.info(str)
                    new sql.Request().query(str).then(ress=>{
                        res.end('ok')
                    }).catch(e=>{
                        console.info(e)
                    })
                  
                }).catch(e=>{
                    console.info('has_do_money_error')
                    res.end('no')
                })
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
