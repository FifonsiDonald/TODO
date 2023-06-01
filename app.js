const express = require("express");
const bodyParser = require("body-parser");
const getDate = require("./date");
const date =require(__dirname+"/date")
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000; // Default to port 3000 if PORT environment variable is not set
const host = process.env.VERCEL_URL || 'localhost'; // Default to localhost if VERCEL_URL environment variable is not set


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

app.listen(port, host, () => {
  console.log(`Server is listening at http://${host}:${port}`);
});
