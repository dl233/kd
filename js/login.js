const turl=require("url")
const sql=require("mssql")
const config=require("../config/config").dbconfig
const score = require("../config/config").reg_money
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
    console.log(obj)
    var cn=await sql.connect(config).then(()=>{
        str1="select * from user_table where uid='"+obj[0]+"'"
          new sql.Request().query(str1).then((recordsets)=>{

                if(JSON.stringify(recordsets.recordset)=='[]'){
                    if(obj[2]!=0&&obj[3]!=0)
                        str="insert into user_table(uid,utype,sex,score,X,Y) values('"+obj[0]+"',1,"+obj[1]+","+score+",'"+obj[2]+"','"+obj[3]+"')"
                    else
                        str="insert into user_table(uid,utype,sex,score) values('"+obj[0]+"',1,"+obj[1]+","+score+")"
                    new sql.Request().query(str).then((recordsets2)=>{
                    console.log(JSON.stringify(recordsets2.rowsAffected))
                    const tip=JSON.stringify(recordsets2.rowsAffected)=='[0]'
                    console.log(tip);
                    if(tip){
                        console.info("login-insert-error")
                        res.end("login-insert-error")
                    }else{
                        str = "insert into money(uid,time,msg,type,num) values('"+obj[0]+"','"+time+"','注册',1,"+score+")"
                        new sql.Request().query(str).then(ress=>{
                            console.info("login-insert-ok")
                            new sql.Request().query(str1).then((recordsets1)=>{console.log(JSON.stringify(recordsets1.recordset));
                                res.end(JSON.stringify(recordsets1.recordset))
                                
                                
                            }).catch(ex=>{
                            console.info("login-updata-error2")
                            })
                        }).catch(e=>{
                            console.info("money-insert-error")
                            res.end("money-insert-error")
                        })
                    }
                         }).catch((ex)=>{
                            console.info("login-insert-error2")
                    })
                 }
                 else{
                    console.log("UPDATE")
                    if(obj[2]!=0&&obj[3]!=0)
                    str="update user_table set X='"+obj[2]+"',Y='"+obj[3]+"',sex="+obj[1]+" where uid='"+obj[0]+"'"
                    else
                    str="update user_table set sex="+obj[1]+" where uid='"+obj[0]+"'"
                    new sql.Request().query(str).then((recordsetsss)=>{
                        
                        console.log(JSON.stringify(recordsetsss.rowsAffected))
                        const tip2=JSON.stringify(recordsetsss.rowsAffected)=='[0]'
                        console.log(tip2);
                        if(tip2){
                            console.info("login-updata-error")
                            res.end("login-updata-error")
                        }else{
                            console.info("login-updata-ok")
                            new sql.Request().query(str1).then((recordsets1)=>{console.log(JSON.stringify(recordsets1.recordset));
                                res.end(JSON.stringify(recordsets1.recordset))
                                
                                
                            }).catch(ex=>{
                            console.info("login-updata-error2")
                            })
                        }
                    }).catch(ex=>{
                    console.info("login-updata-error2")
                    })
                   }
     }).catch((err)=>{
             console.info(err)

         })
         }).catch((err)=>{
             console.info("Con"+err)
         })
 }


//  sql.close()
//  sql.connect(config).then(()=>{
//     str="insert into user_table(uid,utype,sex,score) values("+obj[0]+",1,"+obj[1]+",0)"
//     new sql.Request().query(str).then((reds)=>{
//         if(recordsets.rowAffected!="0"){
//             console.info("login-ok")
//             res.end("ok")
//         }else{
//             console.info("login-error")
//             res.end("no")
//         }
//              }).catch((ex)=>{
//         console.info(ex)
//         })
//      }).catch((err)=>{
//          console.info("Con2"+err)
//      })