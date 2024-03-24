import React, { useCallback } from 'react'; // Add useCallback to the import
import MessageBarChart from './MessageBarChart'; // Adjust the import path if necessary
import MessageLineChart from './MessageLineChart'; // Adjust the import path if necessary
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

  

  // display a list of tables, the first table will be MessageBarChart using averageSentimentBarData then the next will be MessageLineChart using averageSentimentLineData
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
      <MessageBarChart {...averageSentimentBarData()} />
      <MessageLineChart {...averageSentimentLineData()} />
    </div>
  );
}

export default Tables;