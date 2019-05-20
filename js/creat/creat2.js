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
    var obj=turl.parse(req.url,true).query
    
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.info(time)
    str="select gid from get_table where gname='"+obj.yz+"'"
    
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{

            const gid=JSON.stringify(recordsets.recordset[0].gid)
            
            console.info('gid:'+JSON.stringify(recordsets.recordset[0].gid))
            str="insert into list(gid,struct,cuser,phone,sms,uname,money,time,getaddress) values("+gid+",0,'"+obj.uid+"','"+obj.phone+"','"+obj.sms+"','"+obj.name+"',"+obj.money+",'"+time+"','"+obj.address+"')"
            new sql.Request().query(str).then(ress=>{
                if(JSON.stringify(ress.rowsAffected)=='[1]'){
                    str = "insert into money(uid,time,msg,type,num) values('"+obj.uid+"','"+time+"','订单提交',0,"+obj.money+")"
                    new sql.Request().query(str).then(resss=>{
                        str = "update user_table set score="+obj.score+" where uid='"+obj.uid+"'"
                        console.info(str)
                        new sql.Request().query(str).then(ress=>{
                            res.end('OK')
                        }).catch(e=>{
                            console.info(e)
                        })
                        
                    }).catch(e=>{
                        res.end('NO')
                        console.info(e)
                    })
                }
                // res.end('OK')
            }).catch(ex=>{
                console.info(ex)
            })
        //   res.end('OK')
     }).catch((err)=>{
             console.info(err)
             res.end('NO')
         })
         }).catch((err)=>{
             console.info('Con'+err)
             res.end('ERROR')
         })

 }