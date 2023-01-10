const express = require("express")
const path = require("path")
let dbjson = require("./db/db.json")
const PORT = process.env.PORT || 3001;
const app = express()

const fs = require("fs")
const util = require("util")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Imports custom middleware
app.use(express.static('public'));
// GET Route
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
})
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})
app.get("/api/notes", function (req, res) {
    readFile('db/db.json', "utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes))).then(notes => res.json(notes))
})
// POST Route
app.post("/api/notes", function (req, res) {
    readFile('db/db.json', "utf-8").then(rawNotes => [].concat(JSON.parse(rawNotes))).then(oldNotes => {
        var noteObject = { title: req.body.title, text: req.body.text }
        var newNotes = [...oldNotes, noteObject]
        writeFile("db/db.json", JSON.stringify(newNotes)).then(() => res.json({
            msg: "OK"
        }))
    })
})
app.delete("/api/notes/:id", (req,res)=> {
    let newdb = [ ]
for (var i = 0; i < dbjson.length; i++){
    if (dbjson[i].id !=req.params.id){
        newdb.push(dbjson[i])
    }
}
dbjson = newdb
fs.writeFileSync("./db/db.json", JSON.stringify(dbjson))
res.json(dbjson)
})
app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
});