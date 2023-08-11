// requiring node modules

require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

const { formatDistanceToNow } = require("date-fns");

// initializing some constants
const homeStartingContent =
  "Discover a serene space to express your innermost thoughts and reflections. TranquilWritings is a daily journal and blogging platform where you can effortlessly capture your moments, ideas, and emotions. Our user-friendly interface, powered by a Node.js and Express backend, offers a seamless writing experience. With soothing EJS templates and a calming UI, you'll find yourself at ease while sharing your thoughts with the world. Join us in creating a community of mindful expression and embark on a journey of self-discovery with TranquilWritings.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];

const app = express();

app.set("view engine", "ejs"); //setting view engine for ejs

app.use(bodyParser.urlencoded({ extended: true })); //for using body-parser
app.use(express.static("public")); //for static files such as style.css

//connect to mongodb
mongoose
  .connect(process.env.URL)
  .then(console.log("connected to db"));


const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

const Post = new mongoose.model("Post", postSchema);

const colors = ["#23a094", "#e2442f", "#f1f333", "#ffc900", "#90a8ed", "#23a094"];

//diff get and post routes

app.get('/', (req, res) => {
  res.render("home");
})

app.get("/all", (req, res) => {
  Post.find({}).then((posts) => {
    res.render("all", {
      formatFunc: formatDistanceToNow,
      postContent: posts,
      allColors: colors,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { startingContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { startingContent: contactContent });
});

app.get("/new", (req, res) => {
  res.render("compose");
});

app.post("/new", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });

  post.save().then(res.redirect("/all"));
});

app.get("/posts/:postId", (req, res) => {
  var requestedPostId = req.params.postId;

  Post.findById(requestedPostId)
    .then((post) => {
      res.render("post", { postTitle: post.title, postBody: post.body });
    })
});



//server live on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
