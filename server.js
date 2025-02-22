

const legoData = require("./modules/legoSets");
const express = require('express');
const app = express();
//const path = require("path");

const HTTP_PORT = process.env.PORT || 8080;

//app.use(express.static('public'));
app.use(express.static(__dirname + '/public')); //Vercel
app.set('views', __dirname + '/views');//Vercel

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("home")
});

app.get('/about', (req, res) => {
  res.render("about");
});


app.get('/lego/addSet', async(req, res) => {
  let themeData = await legoData.getAllThemes();
  res.render("addSet", { themes: themeData });
});

app.post('/lego/addSet', async(req, res) => {
  try{
    await legoData.addSet(req.body);
    res.redirect('/lego/sets');
  }catch(err){
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  } 
});


app.get('/lego/editSet/:num', async(req, res) => {
  try{
    let setData = await legoData.getSetByNum(req.params.num);
    let themeData = await legoData.getAllThemes();
    res.render("editSet", { themes: themeData, set: setData });
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.post('/lego/editSet', async(req, res) => {
  try{
    await legoData.editSet(req.body.set_num, req.body);
    res.redirect('/lego/sets');
  }catch(err){
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  } 
});

app.get('/lego/deleteSet/:num', async(req, res) => {
  try{
    await legoData.deleteSet(req.params.num);
    res.redirect('/lego/sets');
  }catch(err){
    res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` });
  }
});

app.get("/lego/sets", async (req,res)=>{

  let sets = [];

  try{    
    if(req.query.theme){
      sets = await legoData.getSetsByTheme(req.query.theme);
    }else{
      sets = await legoData.getAllSets();
    }

    res.render("sets", {sets})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
  
});

app.get("/lego/sets/:num", async (req,res)=>{
  try{
    let set = await legoData.getSetByNum(req.params.num);
    res.render("set", {set})
  }catch(err){
    res.status(404).render("404", {message: err});
  }
});

app.use((req, res, next) => {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});
legoData.initialize().then(()=>{
 app.listen(HTTP_PORT, () => { console.log(`server listening on: ${HTTP_PORT}`) });
}).catch((err)=>{
  console.log(err);
});