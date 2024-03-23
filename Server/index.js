const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

axios.get('https://api.openai.com/v1/engines', {
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
}).then(response => {
    console.log(response.data);
}).catch(error => {
    console.error(error);
});

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for messages
let messages = [];
let processed = []
// {
//   author: "test",
//   guild: "test",
//   channel: "test",
//   message: "test",
//   timestamp: new Date(),
//   sentiment: 4,
//   ...
// }

// POST /upload endpoint to receive message data
app.post('/upload', (req, res) => {
  const { author, guild, channel, message } = req.body;

  // TODO: preprocess the message
  cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'discord', 'sc', 'screenshot', 'carry', 'google doc', 'DM', 'boost', 'spoiler', 'help', 'study', 'session', 'assignment', 'lab']
  const containsKeyword = cheatListener.some(keyword => message.includes(keyword));
  if (containsKeyword) {
    // Perform actions for messages containing keywords
    // TODO: Add your code here
    console.log('beginning to process message')
    const prompt = 'Given the following conversation thread amongst students, check whether there may be cheating involved. Your decision does not need to be perfect and no one will be held accountable whether you are correct or incorrect. Try to minimize false positives as much as possible. With this in mind, output a single number in the range of 0-10, indicating how confident you are that the student (or students) at hand are engaged in academic cheating, with 0 indicating no cheating and 10 indicating absolute certain of illegal academic conduct. Your output must be a SINGLE integer number in the range of 0-10: ' + message;
    
    axios.post('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
    prompt: prompt,
    max_tokens: 60
}, {
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }
}).then(response => {
    console.log(response.data.choices[0].text.trim());
}).catch(error => {
    console.error(error);
});
  }

  // Validate the input
  if (!author || !guild || !channel || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Add the message to the storage
  // TODO: add to preprocessed
  messages.push({ author, guild, channel, message, timestamp: new Date() });
  res.status(201).json({ message: 'Message received' });
  console.log(message);
});

// GET /analysis endpoint to retrieve messages from the last X minutes
app.get('/analysis', (req, res) => {
  const { minutes } = req.query;

  // Validate the input
  if (!minutes || isNaN(parseInt(minutes))) {
    return res.status(400).send('Invalid or missing minutes parameter');
  }

  const threshold = new Date(new Date() - minutes * 60000);
  const recentMessages = messages.filter(message => message.timestamp > threshold);
  const recentPreprocessed = processed.filter(message => message.timestamp > threshold);
  // You can modify this to return any specific analysis of the messages
  res.json({
    count: recentMessages.length,
    messages: recentMessages,
    processed: recentPreprocessed
  });
});

// create a root get endpoint that will display preprocessed data
app.get('/', (req, res) => {
  res.json({processed, messages});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});