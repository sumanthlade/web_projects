const express=require('express')
const parser=require('body-parser')
const ejs=require("ejs")
const mongoose=require("mongoose")
const _=require("lodash")

const app=express()

app.set('view engine','ejs')
app.use(parser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

const itemSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  }
})
const listSchema= new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  items:[itemSchema]
})
const List=mongoose.model("List",listSchema)
const Item=new mongoose.model("item",itemSchema)

const item1=new Item({
  name:"Welcome to your todolist!"
})
const item2=new Item({
  name:"Hit the + button to add a new item."
})
const item3=new Item({
  name:"<--Hit this to delete an item."
})
defaultItems=[item1,item2,item3]

// async function r(){
//     await Item.insertMany(defaultItems)
// }
// r().catch(console.dir)

app.get("/about",(req,res)=>{
  res.render('about')
})

async function findList(customList){
  const res= await List.findOne({name:customList})
  return res
}
async function getItems(listName){
   try{
     let result={}
     if(listName==="Today")
        result = await Item.find()
    else{
      findList(listName)
      .then((listItems)=>{
        result=listItems.items
      })
      .catch(console.dir)
    }
     return result
   }
   catch(err){
     return err
   }
}

async function InsertItem(newItem,listName){
  const newitem=new Item({name:newItem})
  if(listName==="Today"){
    await newitem.save()
  }
  else{
    findList(listName)
    .then((result)=>{
      result.items.push(newitem)
      result.save()
    })
    .catch(console.dir)
  }
}
async function deleteItem(id,listName){
  if(listName==="Today"){
    await Item.deleteOne({_id:id})
  }
  else{
    await List.findOneAndUpdate({
      name:listName
    },
    {
      $pull:{
        items:{
          _id:id
        }
      }
    }
  )
  }
}

app.get("/",(req,res)=>{
  getItems("Today")
  .then((items)=>{
    if(items.length==0){
      items=defaultItems
    }
    res.render('list',{kindOfDay:"Today",listItem:items})
  })
  .catch((err)=>{
    console.log(err)
  })
})
app.get("/:customList",(req,res)=>{
  const customList=_.capitalize(req.params.customList)
  findList(customList)
  .then((result)=>{
    if(!result){
      const list= new List({
        name:customList,
        items:[]
      })
      list.save()
      res.render("list",{kindOfDay:customList,listItem:defaultItems})
    }
    else if(result.items.length===0){
      res.render("list",{kindOfDay:customList,listItem:defaultItems})
    }
    else{
      res.render("list",{kindOfDay:customList,listItem:result.items})
    }
  })
  .catch(console.dir)
})
app.post("/",(req,res)=>{
  const newItem=req.body.newItem;
  const listName=req.body.button
  if(newItem!="")
  {
    InsertItem(newItem,listName)
    .then(()=>{
      if(listName=="Today"){
        res.redirect("/")
      }
      else{
        res.redirect("/"+listName)
      }
    })
    .catch(console.dir)
  }
  else{
    res.redirect("/"+listName)
  }
})
app.post("/delete",(req,res)=>{
  const itemId=req.body.checkbox
  const listName=req.body.listName
  deleteItem(itemId,listName)
  .then(()=>{
    if(listName==="Today"){
      res.redirect("/")
    }
    else{
      res.redirect("/"+listName)
    }
  })
  .catch(console.dir)
})
app.listen(process.env.port||3000,()=>{})
