// index.js (o server.js)
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { askBot } from './src/askBotCore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Rutas HTML (si las tienes)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bot.html'));
});

app.get('/ft', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ft.html'));
});

// Ruta API local que reutiliza askBotCore
app.post('/api/ask-bot', async (req, res) => {
  try {
    const { question } = req.body || {};

    const data = await askBot(question, {
      apiUrl: process.env.GENBOX_API_URL,
      apiKey: process.env.GENBOX_API_KEY,
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    // 400 si es error de parámetro, 500 si es otro
    const status = err.message.includes('Falta el parámetro') ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
