const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
//get routes
app.get('/index', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

//get api/notes then read/parse json
app.get('/api/notes', (req, res) => {
  const noteList = fs.readFileSync('./db/db.json');
  res.json(JSON.parse(noteList));
});

//post notes and assign const for title, text, and ID
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // assign and parse previously saved notes to const to make them renderable with the new note
    const oldNotes = JSON.parse(fs.readFileSync('./db/db.json'));
    oldNotes.push(newNote);
    // write to json file, stringify previously saved notes to make them readable, null and 4 add space between each entry in json file to keep it looking neat
    fs.writeFile('./db/db.json', JSON.stringify(oldNotes, null, 4), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json('Error writing to file');
      }
      //log that the note/title were written to the json file
      console.log(`Note for ${newNote.title} was written to JSON file`);
      return res.status(201).json({
        status: 'success',
        body: newNote,
      });
    });
  }
});
// delete function specifying which note needs to be deleted by filtering by id
app.delete('/api/notes/:id', (req, res) => {
  //map params to id
  const deleteNote = req.params.id;

  let noteDelete = JSON.parse(fs.readFileSync('./db/db.json'));
  //filter note by id and making it strictly inequal to the deleted note then re-writing it as blank
  const deleted = noteDelete.filter((note) => note.id !== deleteNote);
  fs.writeFileSync('./db/db.json', JSON.stringify(deleted));
  res.json(deleted);
});

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
