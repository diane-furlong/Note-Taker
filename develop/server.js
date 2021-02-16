// dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')

// configure express
const app = express()

// set port
const PORT = process.env.PORT || 8080

// set up Express app to handle data parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// routes
//--------------------
//send user first to homepage
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

//notes page
app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './public/notes.html'))
})

//get all notes
app.get('/api/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
  })
})

//get individual notes
app.get('/api/notes/:id', function (req, res){
  //read db.json
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    const allNotes = JSON.parse(data)
    const chosen = req.params.id

    for(i=0;i<allNotes.length;i++){
      if(chosen === allNotes[i].id){
        return res.json(allNotes[i])
      }
    }
  })
}) 

//create new note
app.post('/api/notes', function(req, res) {
  //read db.json
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    
    if (err) throw err
    //save the current data in db.json
    const allNotes = JSON.parse(data)
    console.log(allNotes)
    //define the new note and make a unique id
    const newNote = req.body
    //--method if note id needs to be a unique number--
    // for(i=0;i<allNotes.length+1;i++){
    //   newNote.id = i
    // }
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase()
    console.log(newNote.id)
    //add new note to the current data in db.json
    allNotes.push(newNote)
    console.log(allNotes)
    fs.writeFile('./db/db.json', JSON.stringify(allNotes), (err) => {
      if(err) {
        console.log(err)
        res.json(allNotes)
      }
    })
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes), (err) => {
      if(err) throw err
      res.json(req.body)
    })
  })
})

//delete note
app.delete('/api/notes/:id', function(req, res) {
  
  //read db.json
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    const allNotes = JSON.parse(data)
    const id = req.params.id

    for(i=0;i<allNotes.length;i++){
      if(id === allNotes[i].id){
        allNotes.splice(i,1)
      }
    }
    //save the current data in db.json
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes), (err) => {
      if(err) throw err
      res.json(req.body)
    })
  })  
})

// start listener
app.listen(PORT, () => {
  console.log(`App listening on PORT localhost:${PORT}`)
})
