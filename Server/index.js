const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCfBn-nQAv3EyAdS27QTY7wKXx_Yh88A3g",
  authDomain: "dinodetector.firebaseapp.com",
  projectId: "dinodetector",
  storageBucket: "dinodetector.appspot.com",
  messagingSenderId: "859368794670",
  appId: "1:859368794670:web:1320c3636fb70e04b8cdbf",
  measurementId: "G-KLKC8LV4KC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

try {
  const docRef = await addDoc(collection(db, "users"), {
    username: "catiasilva",
    toxictyCount: 0
  });
  console.log("Document written with ID: ", docRef.id);
} catch (e) {
  console.error("Error adding document: ", e);
}


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

const app1 = express();
const port = 3000;

app1.use(cors());
app1.use(cors());
// Middleware to parse JSON bodies
app1.use(bodyParser.json());

// In-memory storage for messages
let messages = [];

// POST /upload endpoint to receive message data
app1.post('/upload', async (req, res) => {
  const { author, guild, channel, message } = req.body;
  // Extract the last 10 messages and formats them
  const lastTenMessages = messages.slice(-10);
  const formattedLastTenMessages = lastTenMessages.map((msg, index) => 
    `"${msg.author}" says: "${msg.message}"`
  ).join('\n');

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
});

  // words that will trigger the AI to analyze the conversation for signs of cheating
  cheatListener = ['cheat', 'homework', 'quiz', 'test', 'exam', 'midterm', 'number', 
  '(?:#|-?\d+(\.\d+)?)(?=#|\))', 'answers', 'answer', 'discord', 'sc', 'screenshot', 
  'carry', 'google doc', 'DM', 'boost', 'spoiler', 'help', 'study', 'session', 'assignment', 
  'lab', 'professor', 'teacher', 'essay', 'paper', 'final', 'project', 'group', 'partner', 
  'collaborate', 'copy', 'plagiarize', 'unauthorized', 'prohibited', 'share answers', 
  'leak', 'exam bank', 'test bank', 'solution manual', 'study guide', 'private tutor', 
  'grade hack', 'academic integrity', 'forgery', 'deceive', 'misrepresent', 'unfair advantage', 
  'bypass', 'fabricate', 'falsify', 'cheat sheet', 'crib notes', 'group chat', 'share notes', 
  'pay for grades', 'contract cheating', 'ghostwriting', 'impersonate', 'proxy', 'collusion', 
  'unauthorized assistance', 'offsite communication', 'code sharing', 'data leak', 
  'exam questions', 'past papers', 'unofficial resources']

  toxicListener = ["abuse", "assault", "attack", "bigot", "bully", "aids", "cancer", 
  "retard", "nigga", "nigger", "kike", "monkey", "idiot", "stupid", "insane", "mental", 
  "death threat", "disgusting", "hate speech", "harass", "kill", "racist", "rape", "sexist", 
  "threaten", "violent", "xenophobe", "dyke", "kike", "spic", "stab", "murder", "rip"];

  const containsCheatWord = cheatListener.some(keyword => message.includes(keyword));
  const containsToxicWord = toxicListener.some(keyword => message.includes(keyword));

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

  if (containsCheatWord) {
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
app1.get('/analysis', (req, res) => {
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
app1.get('/', (req, res) => {
  res.json({processed, messages});
});

app1.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});