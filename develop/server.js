//DEPENDENCIES
const express = require('express')
const path = require('path')
const fs = require('fs')

//CONFIGURE EXPRESS
const app = express()

//SET PORT
const PORT = process.env.PORT || 8080

//SET UP EXPRESS TO HANDLE DATA ROUTING
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))


//----------ROUTES----------

//HOMEPAGE
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'develop/public/index.html'))
})

//NOTES PAGE
app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'develop/public/notes.html'))
})

//GET ALL NOTES IN JSON FORMAT
app.get('/api/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'develop/db/db.json'), 'utf8', (err, data) => {
  })
})

//GET INDIVIDUAL NOTE IN JSON FORMAT
app.get('/api/notes/:id', function (req, res){

  //READ DB.JSON
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


//CREATE NEW NOTE
app.post('/api/notes', function(req, res) {

  //READ DB.JSON
  fs.readFile('develop/db/db.json', 'utf-8', (err, data) => {
    
    if (err) throw err

    //SAVE CURRENT DATA IN DB.JSON
    const allNotes = JSON.parse(data)

    //DEFINE THE NEW NOTE AND GIVE IT AN ID
    const newNote = req.body
    newNote.id = newNote.title.replace(/\s+/g, "").toLowerCase()
    console.log(newNote.id)

    //ADD NEW NOTE TO CURRENT DATA IN DB.JSON
    allNotes.push(newNote)
    fs.writeFile('develop/db/db.json', JSON.stringify(allNotes), (err) => {
      if(err) {
        console.log(err)
        res.json(allNotes)
      }
    })

    //SAVE CURRENT DATA IN DB.JSON- DISPLAY ON PAGE
    fs.writeFile(path.join(__dirname, 'develop/db/db.json'), JSON.stringify(allNotes), (err) => {
      if(err) throw err
      res.json(req.body)
    })
  })
})


//DELETE NOTE
app.delete('/api/notes/:id', function(req, res) {

  //READ DB.JSON
  fs.readFile('develop/db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    const allNotes = JSON.parse(data)
    const id = req.params.id

    for(i=0;i<allNotes.length;i++){
      if(id === allNotes[i].id){
        allNotes.splice(i,1)
      }
    }

    //SAVE CURRENT DATA IN DB.JSON- DISPLAY ON PAGE
    fs.writeFile(path.join(__dirname, 'develop/db/db.json'), JSON.stringify(allNotes), (err) => {
      if(err) throw err
      res.json(req.body)
    })
  })  
})


// START LISTENER
app.listen(PORT, () => {
  console.log(`App listening on PORT localhost:${PORT}`)
})
