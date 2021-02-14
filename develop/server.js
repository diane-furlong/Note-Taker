// dependencies
const express = require('express')
const path = require('path')
const fs = require('fs')
const { json } = require('express')

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

//display all notes
app.get('/api/notes', function (req, res) {
  res.sendFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
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
    for(i=0;i<allNotes.length+1;i++){
      newNote.id = i
    }
    // newNote.id = newNote.title.replace(/\s/g, '').toLowerCase()
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
  })
})

//delete
app.delete('/api/notes/:id', function (req, res) {
  const id = req.param.id
  //read db.json
  fs.readFile('./db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    const allNotes = JSON.parse(data)
    for(i=0;i<allNotes.length+1;i++){
      console.log(allNotes.id[i])
      if(allNotes.id !== id){
        allNotes.splice(i, 1)
      }
    }
    fs.writeFile('./db/db.json', JSON.stringify(allNotes), (err) => {
      if(err) throw err
    })
  })
})

// listener
app.listen(PORT, () => {
  console.log(`App listening on PORT localhost:${PORT}`)
})
