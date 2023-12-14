const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

//all data
const categories = require("./Data/Category.json");
const menu = require("./Data/menu.json");
const chef = require("./Data/chef.json");
const blogs = require("./Data/Blogs.json");

app.get("/", (req, res) => {
  console.log("server is running");
});

//get all categories data
app.get("/categories", (req, res) => {
  res.send(categories);
});

//get all menu item data

app.get("/menu", (req, res) => {
  res.send(menu);
});

//get all chef data

app.get("/chef", (req, res) => {
  res.send(chef);
});

//find single chef
app.get("/chef/:id", (req, res) => {
  const id = req.params.id;
  const findChef = chef.find((item) => item._id === id);
  res.send(findChef);
});

//blog data get

app.get("/blogs", (req, res) => {
  res.send(blogs);
});

app.listen(port, () => {
  console.log(`Byte server running is: ${port}`);
});
