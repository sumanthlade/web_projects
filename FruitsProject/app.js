const { MongoClient } = require("mongodb");
const mongoose=require("mongoose")

// Replace the uri string with your connection string.
const dbName='fruitsDB'
const uri = "mongodb://127.0.0.1:27017/"+dbName;


mongoose.connect(uri);
const fruitSchema = new mongoose.Schema({
  name: {
    type:String,
    required:[true,"check data entry,no name field specified"]
  },
  rating: {
    type:Number,
    min:1,
    max:10},
  review: {
    type: String,
    maxLength:[100]
  }
})

const Fruit=mongoose.model('Fruit',fruitSchema)
const kiwi=new Fruit({
  name:"kiwi",
  rating:8,
  review:"tastes good"
})
//kiwi.save()
const personSchema= new mongoose.Schema({
  name:{type:String,required:true},
  age: {type:Number},
  favouriteFruit: fruitSchema
})
const Person=mongoose.model("People",personSchema)

// const john=new Person({
//   name:"John",
//   age:37
// });
async function getFruit(name){
  return await Fruit.find({name:name})
}
const r=async ()=>{
  //await Person.deleteMany({name:"Amy"}).exec()
  const pineapple=new Fruit({
    name:"pineapple",
    rating:7,
    review:"sometimes tastes good, sometimes doesn't"
  })
  pineapple.save()
  await Person.updateOne({name:"John"},{favouriteFruit:pineapple}).exec()
//  const fruit=await Fruit.find({name:"kiwi"})
  //console.log(fruit[0])
  // const amy= Person({
  //   name:'Amy',
  //   age:12,
  //   favouriteFruit:fruit[0]
  // })
//  amy.save()
}
r().catch(console.dir)





// const run=async ()=> {await Fruit.deleteOne(
// {name:"Peaches"},
// )}
// run().catch(console.dir)
// const fruit =new Fruit({
//
//     rating: 10,
//     review: "Peaches are yummy"
// })
// const fruit = new Fruit({
//   name:"Apple",
//   rating: 25,
//   review: "I don't like it"
// })
//fruit.save()

// const watermelon={
//   name:"watermelon",
//   rating:9,
//   review:"Fresh and watery"
// }
// const grapes={
//   name:"grapes",
//   rating:8,
//   review:"Looks small but tastes good"
// }
// async function run(){
//   try{
//     fruitsCollection=await Fruit.find().exec()
//     console.log(fruitsCollection)
//   }
//   finally{
//     mongoose.connection.close()
//   }
// }
// run().catch(console.dir)

//Fruit.insertMany([kiwi,watermelon,grapes])
//fruit.save()
// async function run() {
//   try {
//     const database = client.db(dbName);
//     const fruits = database.collection('fruits');
//     const allFruits=fruits.find()
//     if ((await fruits.countDocuments()) === 0) {
//       console.log("No documents found!");
//     }
//     // Print returned documents
//     for await (const doc of allFruits) {
//       console.dir(doc);
//     }
//
//     // Query for a movie that has the title 'Back to the Future'
//   /*  await fruits.insertMany([
//       {
//         name:"Apple",
//         score:8,
//         review: "Taste less fruit"
//       },
//       {
//         name: "Orange",
//         score:6,
//         review: "Great fruit"
//       },
//       {
//         name: "Banana",
//         score: 9,
//         review: "Gives good protein"
//       }
//     ])*/
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
