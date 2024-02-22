const express=require("express");
const app=express();
app.get("/",function(request,response){
  response.send("<h1>Hello world</h1>");
});
app.get("/contact",function(req,res){
  res.send('Contact me at: sumanth@gmail.com');
})
app.get("/about",function(req,res){
  res.send('YO! Ore wa Monkey.D Luffy. Kaizoku ou ni ore wa naru.');
})
app.get("/hobbies",function(req,res){
  res.send("Animes, Cricket..");
})
app.get("/hobbies/anime",function(req,res){
  res.send("OnePiece");
});
app.listen(3000,function(){
  console.log("server started on port 3000");
});
