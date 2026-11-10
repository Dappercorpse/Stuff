import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

let folder = path.dirname(fileURLToPath(import.meta.url));
let songsFile = path.join(folder, 'src/data/songs.json');
let musicFolder = path.join(folder, 'public/music');
let distFolder = path.join(folder, 'dist');
let indexFile = path.join(distFolder, 'index.html');

let app = express();
let port = process.env.PORT || 3000;

app.use('/music', express.static(musicFolder));
app.use(express.static(distFolder));

app.get('/api/songs', async (req, res) => {
  try {
    let text = await readFile(songsFile, 'utf8');
    let songs = JSON.parse(text);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: 'Could not load songs' });
  }
});

app.use((req, res) => {
  res.sendFile(indexFile);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});