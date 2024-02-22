const express=require("express");
const https=require("https");
const bodyParser=require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended: true}));
app.get("/",(req,res)=>{
 res.sendFile(__dirname+'/index.html');
})
app.post("/",(req,res)=>{
  const query=req.body.cityName;
  console.log(req.body)
  const apiKey="c25096a1ec928297959e2e106232744b"
  const units="metric"
  const apiUrl="https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+units+"&appid="+apiKey;
  https.get(apiUrl,(response)=>{
    response.on("data",(data)=>{
      const weatherData=JSON.parse(data);
      console.log(weatherData)
      const icon=weatherData.weather[0].icon;
      const temp=weatherData.main.temp
      const description=weatherData.weather[0].description;
      const iconUrl="https://openweathermap.org/img/wn/"+icon+ "@2x.png"
      res.write("<p>The weather at "+query+" is currently "+description+"</p>")
      res.write("<img src="+iconUrl+">")
      res.write("<h1>The temperature is "+temp+" degrees ceius");
      res.send();
    })
  })
})
/*const url="https://api.openweathermap.org/data/2.5/weather?q=&units=&appid=";

https.get(url,(response)=>{
  console.log(response.statuscode);
  response.on("data",(data)=>{
      const weatherData=JSON.parse(data);
      const icon=weatherData.weather[0].icon;
      const temp=weatherData.main.temp;
      const type=
      const iconurl= ;
      res.write("<h1>The temperature is "+temp+" degree's celius</h1>");
      res.write("<h2>Type: "+type);
     res.write("<img src="+iconurl+">");
    res.send()
  })
});*/
app.listen(3000,()=>{
  console.log("Server is listening at:3000");
});
