const express=require('express')
const parser=require('body-parser')
const ejs=require("ejs")
const date=require(__dirname+'/date.js')

const app=express()

app.set('view engine','ejs')
app.use(parser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get("/about",(req,res)=>{
  res.render('about')
})
var listArray=[]
app.get("/",(req,res)=>{
  let day=date.getDay()
  res.render('list',{kindOfDay:day,listItem:listArray})
})
app.post("/",(req,res)=>{
  var newItem=req.body.newItem;
  if(newItem!="")
  listArray.push(newItem)
  res.redirect("/");
})
app.listen(process.env.port||3000,()=>{})
