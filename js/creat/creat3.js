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
    

    str="select scid,schoolname from school"
    await sql.connect(config).then(()=>{
          new sql.Request().query(str).then((recordsets)=>{
            let arr=new Object()
            arr.arr1=[]
            arr.arr2=[]

            recordsets.recordset.forEach(e=>{
                arr.arr1.push(e.scid)
                arr.arr2.push(e.schoolname)
            })

            console.info(arr)
            res.end(JSON.stringify(arr))
     }).catch((err)=>{
            console.info(err)
         })
         }).catch((err)=>{
            console.info('Con'+err)
         })

 }