const https=require('https')
const appid=require('../config/config').appid
const appsc=require('../config/config').appsc
const turl=require('url')
// const iconv=require('iconv-lite')
module.exports= (req,res)=>{
    
    var obj=turl.parse(req.url,true).query
    const url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+appsc+'&js_code='+obj[0]+'&grant_type=authorization_code'

    https.get(url, function (ress) {  

        ress.on('data', function (data) {  
            var openid=JSON.parse(data.toString()).openid
            console.info('openid is:'+openid)
            res.end(openid)
        });  
        ress.on("end", function () {  
            // var buff = Buffer.concat(datas, size);  
            // var result = iconv.decode(buff, "utf8");//转码//var result = buff.toString();//不需要转编码,直接tostring  
            // console.log(result);  
        });  
    }).on("error", function (err) {  
        Logger.error(err.stack)  
        callback.apply(null);  
    });  

}

