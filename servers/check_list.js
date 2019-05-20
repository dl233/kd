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
    if(obj)
        str="select * from list where tip="+obj.tip+""
    else
        res.end('404')
        console.info(obj)
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            console.log(str)
            let num=1
            recordsets.recordset.forEach(element => {
                element.idx=num
                num++
                element.time=new Date(+new Date(element.time)).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'') 
            });
            const re=JSON.stringify(recordsets.recordset)
            res.end(re)
     }).catch((err)=>{
            console.info(err)
            res.end('error')
         })
         }).catch((err)=>{
            console.info('Connection error')
            res.end('404')
         })

 }
