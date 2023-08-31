const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/index', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/db', (req, res) => res.sendFile(path.join(__dirname, './db/db.json')));

app.get('/api/notes', (req, res) => {
    const noteList = fs.readFileSync('./db/db.json');
    res.json(JSON.parse(noteList));
    // noteList = req.body;
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
   
        const oldNotes = JSON.parse(fs.readFileSync('./db/db.json'));
        oldNotes.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(oldNotes, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Error writing to file');
            }

            console.log(`Note for ${newNote.title} was written to JSON file`);
            return res.status(201).json({
                status: 'success',
                body: newNote,
              
            });
        });

   
      }});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}!`));
