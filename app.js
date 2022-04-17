const express= require("express")
const bodyParser= require("body-parser")
const mongoose= require("mongoose")
const date= require(__dirname +"/date.js")
const lodash= require("lodash")

const app= express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.connect("mongodb+srv://AYush19:hereatmongo2000@cluster0.vx2c5.mongodb.net/todolistDB?retryWrites=true&w=majority",{ useNewUrlParser: true ,useUnifiedTopology: true});

//schema
const itemschema= new mongoose.Schema({
  name:String
});
const Item= mongoose.model("Item", itemschema);

const listschema= new mongoose.Schema({
  name: String,
  items:[itemschema]
});
const List= mongoose.model("List", listschema);

//mongoose default document
const item1= new Item({
  name:"Task1"
});
const item2= new Item({
  name:"Task2"
});
const item3= new Item({
  name:"Task3"
});

const defaultitems= [item1,item2,item3];

let day= date(); //day title

// Item.insertMany(defaultitems,function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("The default items are successfully added to the todolistDB");
//   }
// });
// Item.deleteOne({_id:"60ccf47befb71f321c9f4c6d"},function(err){
//   if(err){
//     console.log(err);
//   }
// });




app.get("/", function(req,res){
  //finding or reading
  Item.find(function(err,items){
    if(err){
      console.log(err);
    }else{
      if(items.length===0){
        Item.insertMany(defaultitems,function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("The default items are successfully added to the todolistDB");
          }
          res.redirect("/");
        });
      }
        res.render("list",{daytype:"Today" , newtaskitem:items});
      console.log(items);
    }
  });



});

app.post("/", function(req, res){

  const newitem= new Item({
    name: req.body.newtask
  });
  const daylength=req.body.newlist.length;
  //console.log(day[7]===req.body.newlist);      //check if it can be done
  const listname= req.body.newlist;

  if(listname === "Today"){
    newitem.save();

    // items.push();
    console.log(newitem.name);
    res.redirect("/");
  }
  else{
    List.findOne({name:listname},function(err,foundlist){
      foundlist.items.push(newitem);
      foundlist.save();
      res.redirect("/"+listname);
    });
  }



});

app.post("/delete",function(req ,res){
  const listname= req.body.listbox;

  if(listname==="Today"){

      Item.deleteOne({_id:req.body.check},function(err){
        if(err){
          console.log(err);
        }
      });
      res.redirect("/");
  }
  else{
    List.findOneAndUpdate(
      {
        name:listname
      },{
        $pull:{items:{_id:req.body.check}}
      },
      function(err, foundlist){
        if(!err){
          res.redirect("/"+listname);
        }
      });
  }

});

app.get("/:customname" , function(req,res){
  console.log(lodash.capitalize(req.params.customname));

  List.findOne({name:lodash.capitalize(req.params.customname)},function(err,foundlist){
    if(!err){
      if(!foundlist){
        console.log("Dosn't exists, thus created");

          const list= new List({
            name: lodash.capitalize(req.params.customname),
            items: defaultitems
          });
          list.save();
          res.redirect("/"+ req.params.customname);
      }else{
        console.log("exists");
        res.render("list",{daytype:foundlist.name , newtaskitem:foundlist.items});
      }
    }
  });

});

app.get("/about", function(req,res){
  res.render("about")
});








app.listen(process.env.PORT||3000, function(){
  console.log("the server is up ");
});













//day="";
// if(currentday===6 || currentday===0){
//   day="weekend";
// }else{
//   day="not a weekend";
// }
// var weekday = new Array(7);
// weekday[0] = "Sunday";
// weekday[1] = "Monday";
// weekday[2] = "Tuesday";
// weekday[3] = "Wednesday";
// weekday[4] = "Thursday";
// weekday[5] = "Friday";
// weekday[6] = "Saturday";
