const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/db', (req, res) =>
  res.sendFile(path.join(__dirname, './db/db.json'))
);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  res.json(`${req.body}request recieved to get notes` );
  console.info(`${req.body} request received to get notes`)
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} req received to add note`);
  const { title , note } = req.body;
  if (title && note) {
    const newNote = {
      title, 
      text, 
      note_id: uuid(),
    };
    const noteString = JSON.stringify(newNote);
    fs.writeFile(`./db/db.json`, noteString, (err) =>
    err
    ? console.error(err)
    : console.log(`review for ${newNote.title} was written to JSON file`)
    );
    const response = {
      status: 'success',
      body: newNote 
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('error')
  }
})


app.listen(PORT, () =>
  console.log(`Serving static asset routes at http://localhost:${PORT}!`)
);
