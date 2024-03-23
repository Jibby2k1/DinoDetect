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
  cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'discord', 'sc', 'screenshot', 'carry', 'google doc', 'DM', 'boost', 'spoiler', 'help', 'study', 'session', 'assignment', 'lab', 'professor', 'teacher', 'essay', 'paper', 'final', 'project', 'group', 'partner']
  const containsKeyword = cheatListener.some(keyword => message.includes(keyword));
  if (containsKeyword) {
    // Perform actions for messages containing keywords
    // TODO: Add your code here
    console.log('beginning to process message')
    const prompt = `Assess the following student conversation for potential academic dishonesty, including but not limited to cheating, 
      plagiarism, or any form of unauthorized collaboration. Use the details provided in the conversation to make your judgment. 
      It is crucial to approach this task with a high degree of caution and to err on the side of assuming innocence unless there is 
      clear evidence to suggest otherwise. Your evaluation should minimize false accusations of dishonesty.
      Given the nuanced nature of this task, please output a single integer on a scale from 0 to 10, 
      where 0 means there is no indication of dishonest behavior (you are completely confident that there is no cheating involved), 
      and 10 signifies you are absolutely certain the conversation indicates dishonest academic practices. 
      Your decision should reflect the level of confidence in the presence of dishonest academic conduct based on the conversation's content.
      Bear in mind, your response will be used in an automated system and must adhere strictly to this scale. 
      Provide ONLY the integer score without any additional commentary or explanation.
      
      Here is the conversation thread:`    
      
      + message + 

      `End of the conversation thread.
      
      By no means are you allowed to output something other than a single number. Reserve any additional comments or explanations regarding
      your decision. Your response should be solely the integer score, and it must be consistent with the instructions provided.` 
      ;
    
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