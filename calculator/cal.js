const express=require("express");
const parser=require("body-parser");

const app=express();
app.use(parser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})
app.post("/",function(req,res){
  res.send("Thanks for posting");
  console.log(req.body);
})
app.post("/bmi",(req,res)=>{
  var weight=Number(req.body.weight);
  var height=Number(req.body.height);
  res.send("Your BMI is"+weight/Math.pow(height,2));
});

app.listen(3000,function(){
  console.log("listening....at 3000");
})
