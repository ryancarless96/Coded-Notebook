const express = require("express")
const path = require("path")
const PORT = 3001;
const app = express()
const fs = require("fs")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"./public/index.html"))
})
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname,"./public/notes.html"))
})
app.get("/api/notes", function(req,res){
    readFile('db/db.json', "utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes))).then(notes=> res.json(notes))
})
app.post("/api/notes", function(req,res) {
    readFile('db/db.json', "utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes))).then(oldNotes=>{
        var noteObject = {title: req.body.title, text:req.body.text}
        var newNotes = [...oldNotes, noteObject]
        writeFile("db/db.json", JSON.stringify(newNotes)).then(()=> res.json({
            msg:"OK"
        }))
    }) 
})
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);