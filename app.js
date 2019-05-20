const  https = require('https')
const fs = require('fs')
const cwd=process.cwd()
const path = require('path')
const port=require('./config/config.js').port

const option = {
    key: fs.readFileSync('./ca/2_bilibili2233.cn.key'),//.key文件
    cert: fs.readFileSync('./ca/1_bilibili2233.cn_bundle.crt')//.crt文件
}

https.createServer(option,(req,res)=>{
    const url=path.join(cwd+req.url).split('?')[0]
    console.info(url);
    
    if(req.url!=='/')
    try{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html')
    module.require(url)(req,res)
    return
    }
    catch(ex){
        console.info(ex)
        console.info(url)
        res.statusCode=404;
        res.setHeader('Content-Type','text/html')
        res.write('404')
        res.end()
    }
    else{
        res.statusCode=200;
        res.setHeader('Content-Type','text/html')
        res.write('Hello World!')
        res.end()
    }

}).listen(port,()=>{
    console.info('Listening port:'+port)
})