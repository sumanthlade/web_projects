const qr=require("qrcode");
const express=require("express");
const parser=require("body-parser");
const app=express();
app.use(parser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
  res.sendFile(__dirname+"/index.html");
});
app.use(express.json())
app.post('/',(req,res)=>{
 var data=req.body.qr_text;
 qr.toDataURL(data,(err,url)=>{
   if(err){
     console.log(err);
   }
   res.send(`<!DOCTYPE HTML><html><head><title>QRCODE</title></head><body><img src=${url}></body></html>`);
 })

});
app.listen(3000,()=>{
  console.log("listening...at 3000");
})
