require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('GenFolio Chatbot Backend is Running!');
});

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.input;
    if (!userInput) {
      return res.status(400).json({ error: 'Missing input in request body' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Use 'gpt-3.5-turbo' if you don't have GPT-4 access
      messages: [
        { role: 'system', content: 'You are GenFolio, a helpful investment and career portfolio assistant.' },
        { role: 'user', content: userInput },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('Error in /chat:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

