const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const date = require(__dirname + '/date.js');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb+srv://admin-matheus:' + process.env.PASSWORD + '@cluster0.tudcm.mongodb.net/todolistDB');

const itemSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model('Item', itemSchema);

const listSchema = mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model('List', listSchema);

app.get("/", function(req, res){

    const day = date.getDate();

    Item.find({}, function(err, items){
        res.render("list", {listTitle: day, listOfItems: items});
    });

});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){

            if (foundList){
                // Show an existing list
                res.render("list", {listTitle: customListName, listOfItems: foundList.items});
            }else{
                // Create a new list
                const list = new List({name: customListName, items: []});
                list.save();

                res.redirect("/" + customListName);
            }

        }
    });
});


app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const weekday = date.getDay(); // weekday to check if is / route
    
    const item = new Item({name: itemName});

    // Verify if string is not empty
    if (itemName.trim().length !== 0){
        // Check which list is
        if (listName.includes(weekday)){
            item.save();
            res.redirect("/");
        }else{
            List.findOne({name: listName}, function(err, foundList){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            });
        }
    }else{
        // If string is empty only redirect to the correct page
        if (listName.includes(weekday)){
            res.redirect("/");
        }else{
            res.redirect("/" + listName);
        }
    }
    
});

app.post("/delete", function(req, res){
    const itemCheckedID = req.body.checkbox;
    
    let listName;
    if (Array.isArray(req.body.listName)){
        listName = req.body.listName[0];
    }else{
        listName = req.body.listName;
    }

    const day = date.getDate(); // day to check if is / route

    if (listName === day){
        Item.findByIdAndDelete({_id: itemCheckedID}, function(err){
            if(!err){
                console.log("Document removed successfully.");
            }
            res.redirect("/");
        });
    }else{
        
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemCheckedID}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });

    }
});

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

app.listen(port, function(){
    console.log("Server has started successfully.");
});