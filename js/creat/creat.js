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
    

    str="select * from get_table where scid="+obj.schoolid
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            let arr=[]
            recordsets.recordset.forEach(element => {
                arr.push(element.gname)
            });
            let obj2=new Object()
            obj2={
                gname:arr,
                list:recordsets.recordset
            }
            console.info(arr)
             res.end(JSON.stringify(obj2))
     }).catch((err)=>{
             console.info(err)
         })
         }).catch((err)=>{
             console.info('Con'+err)
         })

 }