const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

let tasks = ["Study JS", "Study NoSQL"];
let workList = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    const day = date.getDate();

    res.render("list", {listTitle: day, listOfTasks: tasks});

});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", listOfTasks: workList})
});

app.post("/", function(req, res){
    const task = req.body.newTask;
    
    // Verify if string is not empty
    if (task.trim().length !== 0){
        
        // Check which route should use
        if (req.body.list === "Work"){
            workList.push(task);
            res.redirect("/work");
        }else{
            tasks.push(task);
            res.redirect("/");
        }
    }
    
});

app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});