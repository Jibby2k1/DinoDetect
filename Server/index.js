const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors');


const sentiment_taps = [0.04174125, 0.12977557, 0.26427815, 0.40558056, 0.49706885,
  0.49706885, 0.40558056, 0.26427815, 0.12977557, 0.04174125];
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// axios.get('https://api.openai.com/v1/engines', {
//     headers: {
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//     }
// }).then(response => {
//     console.log(response.data);
// }).catch(error => {
//     console.error(error);
// });

const app = express();
const port = 3000;

app.use(cors());
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
  // Extract the last 10 messages and formats them
  const lastTenMessages = messages.slice(-10);
  const formattedLastTenMessages = lastTenMessages.map((msg, index) => 
    `"${msg.author}" says: "${msg.message}"`
  ).join('\n');

  // words that will trigger the AI to analyze the conversation for signs of cheating
  cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'answer', 'discord',
      'sc', 'screenshot', 'carry', 'google doc', 'DM', 'boost', 'spoiler', 'help', 'study', 'session', 'assignment', 'lab', 'professor', 'teacher',
      'essay', 'paper', 'final', 'project', 'group', 'partner', 'collaborate', 'copy', 'plagiarize', 'unauthorized', 'prohibited', 'share answers', 
      'leak', 'exam bank', 'test bank', 'solution manual', 'study guide', 'private tutor', 'grade hack', 'academic integrity', 'forgery', 'deceive',
      'misrepresent', 'unfair advantage', 'bypass', 'fabricate', 'falsify', 'cheat sheet', 'crib notes', 'group chat', 'share notes', 
      'pay for grades', 'contract cheating', 'ghostwriting', 'impersonate', 'proxy', 'collusion', 'unauthorized assistance', 
      'offsite communication', 'code sharing', 'data leak', 'exam questions', 'past papers', 'unofficial resources']

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
    // Checks whether the last 10 messages are likely to be cheating
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
      
      + formattedLastTenMessages + 

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