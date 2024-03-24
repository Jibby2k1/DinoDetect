import React, { useCallback } from 'react'; // Add useCallback to the import
import MessageBarChart from './MessageBarChart'; // Adjust the import path if necessary
import MessageLineChart from './MessageLineChart'; // Adjust the import path if necessary
// // example data
// [
//   {
//       "author": "cakecrusher",
//       "guild": "TutorialServer",
//       "channel": "bot-channel",
//       "message": "i am depressed",
//       "timestamp": "2024-03-24T06:35:34.209Z",
//       "sentiment": 0,
//       "category": "other",
//       "subject": "other"
//   },
//   {
//       "author": "cakecrusher",
//       "guild": "TutorialServer",
//       "channel": "bot-channel",
//       "message": "I love everythingggg",
//       "timestamp": "2024-03-24T06:35:47.452Z",
//       "sentiment": 10,
//       "category": "feedback",
//       "subject": "other"
//   },
//   {
//       "author": "cakecrusher",
//       "guild": "TutorialServer",
//       "channel": "bot-channel",
//       "message": "life is aight",
//       "timestamp": "2024-03-24T06:35:56.339Z",
//       "sentiment": 5,
//       "category": "chat",
//       "subject": "other"
//   }
// ]
const Tables = ({ messages }) => {
  const averageSentimentBarData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Cumulative Sentiment",
      xAxisTitle: "Time",
      yAxisTitle: "Sentiment",
    };
    if (!messages.length) {
      return data;
    }
    for (let i = 0; i < 10; i++) {
      data.labels.push(i);
      data.values.push(0);
    }
    for (let i = 0; i < messages.length; i++) {
      data.values[messages[i].sentiment]++;
    }
    return data;
  }, [messages]);

  const averageSentimentLineData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Average Sentiment",
      xAxisTitle: "Time",
      yAxisTitle: "Sentiment",
    };
    if (!messages.length) {
      return data;
    }
    let sum = 0;
    for (let i = 0; i < messages.length; i++) {
      sum += messages[i].sentiment;
      data.labels.push(i);
      data.values.push(sum / (i + 1));
    }
    return data;
  }, [messages])

  // create a new data function that creates a bar chart of the categories
  const categoryBarData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Category Distribution",
      xAxisTitle: "Category",
      yAxisTitle: "Frequency",
    };
    if (!messages.length) {
      return data;
    }
    let categories = {};
    for (let i = 0; i < messages.length; i++) {
      if (categories[messages[i].category]) {
        categories[messages[i].category]++;
      } else {
        categories[messages[i].category] = 1;
      }
    }
    data.labels = Object.keys(categories);
    data.values = Object.values(categories);
    return data;
  }, [messages]);

  // create a new new data function that creates a bar chart of the subjects
  const subjectBarData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Subject Distribution",
      xAxisTitle: "Subject",
      yAxisTitle: "Frequency",
    };
    if (!messages.length) {
      return data;
    }
    let subjects = {};
    for (let i = 0; i < messages.length; i++) {
      if (subjects[messages[i].subject]) {
        subjects[messages[i].subject]++;
      } else {
        subjects[messages[i].subject] = 1;
      }
    }
    data.labels = Object.keys(subjects);
    data.values = Object.values(subjects);
    return data;
  }, [messages]);

  // create a line graph that illustrates the interest in ai over time
  const aiInterestLineData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "AI Interest Over Time",
      xAxisTitle: "Time",
      yAxisTitle: "Interest",
    };
    if (!messages.length) {
      return data;
    }
    let sum = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].message.toLowerCase().includes('ai')) {
        sum++;
      }
      data.labels.push(i);
      data.values.push(sum);
    }
    return data;
  }, [messages]);

  // create a line graph showing the average number of messages per minute over time
  const messagesPerMinuteData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Messages Per Minute",
      xAxisTitle: "Time",
      yAxisTitle: "Messages",
    };

    if (messages.length === 0) {
      return data;
    }

    let sortedMessages = messages.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let startTime = new Date(sortedMessages[0].timestamp);
    let endTime = new Date(sortedMessages[sortedMessages.length - 1].timestamp);
    let timeDiff = endTime - startTime;
    let numMinutes = Math.ceil(timeDiff / (1000 * 60));

    let countsPerMinute = new Array(numMinutes).fill(0);
    sortedMessages.forEach(message => {
      let messageTime = new Date(message.timestamp);
      let minuteIndex = Math.floor((messageTime - startTime) / (1000 * 60));
      countsPerMinute[minuteIndex]++;
    });

    for (let i = 0; i < countsPerMinute.length; i++) {
      data.labels.push(new Date(startTime.getTime() + i * 60000).toLocaleTimeString());
      data.values.push(countsPerMinute[i]);
    }

    return data;
  }, [messages]);


  

  // display a list of tables, the first table will be MessageBarChart using averageSentimentBarData then the next will be MessageLineChart using averageSentimentLineData
  return (
    <div style={{ display: 'flex', gap: '40px', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
      <MessageLineChart {...messagesPerMinuteData()} />
      <MessageBarChart {...averageSentimentBarData()} />
      <MessageLineChart {...averageSentimentLineData()} />
      <MessageBarChart {...categoryBarData()} />
      <MessageBarChart {...subjectBarData()} />
      <MessageLineChart {...aiInterestLineData()} />


    </div>
  );
}

export default Tables;