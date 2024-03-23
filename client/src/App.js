import React, { useEffect, useState, useCallback } from "react";
import { Button, Slider } from "@mui/material";
import MessageTable from "./modules/MessageTable";
import Tables from "./modules/Tables";

const App = () => {
  const [view, setView] = useState("table");
  const [messages, setMessages] = useState([]);
  const [minutes, setMinutes] = useState(42200);

  useEffect(() => {
    const fetchMessages = () => {
      fetch(`http://localhost:3000/analysis?minutes=${minutes}`)
        .then((res) => res.json())
        .then((data) => setMessages([...data.processed]))
        .catch((error) => console.error("Error fetching messages:", error));
    };

    fetchMessages(); // Fetch immediately on component mount or minutes change
    const interval = setInterval(fetchMessages, 1000); // Then every second

    return () => clearInterval(interval); // Clear interval on component unmount or minutes change
  }, [minutes]); // Dependency array, effect runs when 'minutes' changes

  const handleBarClick = (data, index) => {
    // Implement your click handling logic here
    console.log("Bar clicked:", data);
  };

  const handleMinutesChange = (event, newValue) => {
    setMinutes(newValue);
  };

  const averageSentimentData = useCallback(() => {
    let data = {
      labels: [],
      values: [],
      title: "Average Sentiment",
      xAxisTitle: "Score",
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

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainingMinutes = minutes % 60;

  return (
    <div>
      <div>
        Scanning last <strong>{days} days, {hours} hours, and {remainingMinutes} minutes</strong>
      </div>
      <Slider
        value={minutes}
        onChange={handleMinutesChange}
        aria-labelledby="input-slider"
        min={0}
        max={42200}
        step={1}
      />
      <Button onClick={() => setView(view === "table" ? "chart" : "table")}>
        Switch View
      </Button>
      {view === "table" ? (
        <MessageTable messages={messages} />
      ) : (
        <Tables messages={messages} />
      )}
    </div>
  );
};

export default App;
