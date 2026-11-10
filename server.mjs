import express from 'express';
import { readFile } from 'fs/promises';

let app = express();
let port = 3000;
app.use('/music', express.static('public/music'));

app.get('/api/songs', async (req, res) => {
  let text = await readFile('src/data/songs.json', 'utf8');
  let songs = JSON.parse(text);
  res.json(songs);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});