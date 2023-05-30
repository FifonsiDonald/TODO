const express = require("express");
const bodyParser = require("body-parser");
const getDate = require("./date");
const date =require(__dirname+"/date")
const app = express();

const tasks=[];
const WorkTasks=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.set("view engine", "ejs");

const day = date.getDay();


app.get("/", function (req, res) {
  res.render("list",{todoTitle:day, theTask:tasks});
  
});

app.post("/",function(req,res){
  const task = req.body.task;
if (req.body.list === "Work" ) {
  WorkTasks.push(task);
  res.redirect("/work");
}else{
  tasks.push(task);
  res.redirect("/");
}
 

})

app.get("/work",function(req,res){

  res.render("list",{todoTitle:"Work", theTask:WorkTasks});

})

app.get("/new",function(req,res){
  res.render("new");
})

app.listen(3000, function () {
  console.log("server is running");
});
