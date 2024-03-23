const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors');


const sentiment_taps = [0.04174125, 0.12977557, 0.26427815, 0.40558056, 0.49706885,
  0.49706885, 0.40558056, 0.26427815, 0.12977557, 0.04174125];
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

app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory storage for messages
let messages = [];
let processed = [
  {
    author: "User123",
    guild: "GuildA",
    channel: "Channel1",
    message: "Hello, everyone!",
    timestamp: new Date("2024-03-23T10:00:00"),
    sentiment: 4,
  },
  {
    author: "User456",
    guild: "GuildA",
    channel: "Channel2",
    message: "Good morning!",
    timestamp: new Date("2024-03-23T10:05:00"),
    sentiment: 3,
  },
  {
    author: "User123",
    guild: "GuildB",
    channel: "Channel1",
    message: "How's everyone doing?",
    timestamp: new Date("2024-03-23T10:10:00"),
    sentiment: 5,
  },
  {
    author: "User789",
    guild: "GuildA",
    channel: "Channel3",
    message: "Nice to see you all.",
    timestamp: new Date("2024-03-23T10:15:00"),
    sentiment: 4,
  },
  {
    author: "User456",
    guild: "GuildB",
    channel: "Channel2",
    message: "Hope you're all well.",
    timestamp: new Date("2024-03-23T10:20:00"),
    sentiment: 3,
  },
  {
    author: "User123",
    guild: "GuildA",
    channel: "Channel1",
    message: "Lovely day, isn't it?",
    timestamp: new Date("2024-03-23T10:25:00"),
    sentiment: 5,
  },
  {
    author: "User789",
    guild: "GuildC",
    channel: "Channel3",
    message: "Looking forward to our discussion.",
    timestamp: new Date("2024-03-23T10:30:00"),
    sentiment: 4,
  },
  {
    author: "User456",
    guild: "GuildA",
    channel: "Channel2",
    message: "Let's get started!",
    timestamp: new Date("2024-03-23T10:35:00"),
    sentiment: 3,
  },
  {
    author: "User123",
    guild: "GuildB",
    channel: "Channel1",
    message: "Any updates from everyone?",
    timestamp: new Date("2024-03-23T10:40:00"),
    sentiment: 4,
  },
  {
    author: "User789",
    guild: "GuildA",
    channel: "Channel3",
    message: "Excited for today's agenda!",
    timestamp: new Date("2024-03-23T10:45:00"),
    sentiment: 5,
  }
]

// POST /upload endpoint to receive message data
app.post('/upload', (req, res) => {
  const { author, guild, channel, message } = req.body;
  // TODO: preprocess the message
  cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'discord', 'sc', 'screenshot', 'carry', 'google doc', 'DM', 'boost', 'spoiler', 'help', 'study', 'session', 'assignment', 'lab', 'professor', 'teacher', 'essay', 'paper', 'final', 'project', 'group', 'partner']
  const containsKeyword = cheatListener.some(keyword => message.includes(keyword));

  console.log('beginning sentiment analysis')
  const prompt = 'Given the following message from a student, please rate the sentiment on a scale of 0-10. If more context is needed, please assign a sentiment of 2. Please be very careful in the way you asses this, take a breath if you need to. In doing so make sure to assess negative sentiments with higher numbers, and positive sentiments with lower numbers: ' + message;


  axios.post('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
    prompt: prompt,
    max_tokens: 60
}, {
    headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }
}).then(response => {
  const sentimentText = response.data.choices[0].text.trim();
  const sentimentNumber = sentimentText.match(/\d+/)[0]; // Extract the first number from the string
  const sentiment = Number(sentimentNumber)/10.0; // Convert the string to a number
  console.log(sentiment);
  if (processed.length >= 10) {
    processed.shift();
  }

  processed.push({ author, guild, channel, message, timestamp: new Date(), sentiment });
  console.log(processed)
  console.log(processed.length)

  if (processed.length == 10) {
    // Assuming sentimentList and sentiment_taps are defined and have the same length
    console.log('General Sentiment Analysis:')
    const multipliedValues = processed.map((item, index) => item.sentiment * sentiment_taps[index]);    
    const GeneralSentiment = (multipliedValues.reduce((a, b) => a + b, 0))/(2.6768887497449967);
    console.log(GeneralSentiment);
  }

}).catch(error => {
    console.error(error);
});

  if (containsKeyword) {
    // Perform actions for messages containing keywords
    console.log('beginning keyword process for cheating analysis')
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