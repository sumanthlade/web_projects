//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
const mongoose = require("mongoose")

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const uri = "mongodb://127.0.0.1:27017/blogDB"
mongoose.connect(uri)
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const Post = mongoose.model("post", postSchema)

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


async function getPost(title) {
  if (!title) {
    return
  }
  try {
    const currentPost = await Post.findOne({
      title: title
    })
    return currentPost
  } catch (err) {
    return err
  }
}
async function createPost(title, content) {
  if (!title || !content) {
    return;
  }
  try {
    const newPost = new Post({
      title: title,
      content: content
    })
    await newPost.save()
  } catch (err) {
    return err
  }
}

async function deletePost(title) {
  try {
    await Post.deleteOne({
      title: title
    })
  } catch (err) {
    return err
  }
}
async function getAllPosts() {
  try {
    const allPosts = await Post.find()
    return allPosts
  } catch (err) {
    return err
  }
}
let war = ""
app.get("/", (req, res) => {
  let warning = []
  if (war != "") {
    warning.push(war)
    war = ""
  }
  getAllPosts()
    .then((result) => {
      if (result.length === 0) {
        createPost("Home", homeStartingContent)
          .then(() => {
            res.redirect("/")
          })
          .catch(console.dir)
      } else {
        res.render('home', {
          posts: result,
          warning: warning
        })
      }
    })
})

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  })
})

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  })
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.post("/compose", (req, res) => {
  const post = {
    title: lodash.capitalize(req.body.postTitle),
    content: req.body.postBody
  }
  createPost(post.title, post.content)
    .then(() => {
      res.redirect("/")
    })
    .catch(console.dir)
})
// app.get("/check-title",(req,res)=>{
//   const curTitle=lodash.capitalize(req.query.username)
//   getPost(curTitle)
//   .then((result)=>{
//     res.json({valid:!result})
//   })
//   .catch(console.dir)
// })
// ... (previous code)

app.get("/check-title", async (req, res) => {
  try {
    const curTitle = lodash.capitalize(req.query.username);
    const result = await getPost(curTitle);

    res.json({
      valid: !result
    });
  } catch (error) {
    console.error("Error checking title:", error);
    res.status(500).json({
      valid: false
    });
  }
});

// ... (remaining code)


app.get("/post/:postName", (req, res) => {

  const requiredPostName = lodash.capitalize(req.params.postName)

  getPost(requiredPostName)
    .then((result) => {
      if (!result) {
        war = (req.params.postName)
        res.redirect("/")
      } else {
        res.render("post", {
          post: result
        })
      }
    })
    .catch(console.dir)
})







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
