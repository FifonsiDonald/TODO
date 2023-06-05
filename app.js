const express = require("express");
const bodyParser = require("body-parser");
const getDate = require("./date");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");
const _ = require("lodash");



const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

const port = process.env.PORT || 3000; // Default to port 3000 if PORT environment variable is not set
const host = process.env.VERCEL_URL || "localhost"; // Default to localhost if VERCEL_URL environment variable is not set

mongoose.connect(
  "mongodb+srv://admin-fifonsi:test123@cluster0.i15cexo.mongodb.net/todolistDB"
);

//Schema for items
const itemsSchema = {
  name: String,
};

//model format
const Item = mongoose.model("Item", itemsSchema);

//Item models
const item1 = new Item({
  name: "Welcome 8)",
});
const item2 = new Item({
  name: "hit + button to add a task",
});
const item3 = new Item({
  name: "Enjoy!",
});

const DefaultItems = [item1, item2, item3];

const ListSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", ListSchema);



const day = date.getDay();

app.get("/", function (req, res) {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(DefaultItems).then((Items) => {
        console.log("successfully saved to db");
      });
      res.redirect("/");
    } else {
      res.render("list", { todoTitle: day, theTask: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.task;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });
  if (listName === day) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(function (foundlist) {
      foundlist.items.push(newItem);
      foundlist.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  const listName = req.body.listName;

if(listName===day){
  Item.deleteOne(checkedItem.value).then(() => {
    console.log("Successfully deleted..");
    res.redirect("/");
   });
}else{
    List.findOneAndUpdate(
      {name:listName},{$pull:{items:{_id:checkedItem}}}
    ).then(function(foundlist){res.redirect("/"+listName)} )
}

  
 
});

app.get("/:customList", function (req, res) {
  const customList = _.capitalize(req.params.customList);
  List.findOne({ name: customList })
    .then(function (foundlist) {
      if (!foundlist) {
        //create new list
        const list = new List({
          name: customList,
          items: DefaultItems,
        });
        list.save();
        res.redirect("/" + customList);
        console.log("new list created");
      } else {
        //then show the existing list
        res.render("list", {
          todoTitle: foundlist.name,
          theTask: foundlist.items,
        });
        console.log("Already exists");
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/new", function (req, res) {
  res.render("new");
});

app.listen(port, host, () => {
  console.log(`Server is listening at http://${host}:${port}`);
});
