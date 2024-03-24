import React, { useEffect, useState, useCallback } from "react";
import { Button, Slider } from "@mui/material";
import MessageTable from "./modules/MessageTable";
import Tables from "./modules/Tables";

const App = () => {
  const timeSpan = 60*24*60
  const [view, setView] = useState("table");
  const [messages, setMessages] = useState([]);
  const [minutes, setMinutes] = useState(timeSpan);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/analysis?minutes=${minutes}`);
        const data = await res.json();
        console.log("Data received:", data)
        setMessages([...data.processed]);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages(); // Fetch immediately on component mount or minutes change
    const interval = setInterval(fetchMessages, 1000); // Then every second

    return () => clearInterval(interval); // Clear interval on component unmount or minutes change
  }, [minutes]); // Dependency array, effect runs when 'minutes' changes
  // const handleDataReceived = (data) => {
  //   // Process the received data and generate a line graph
  //   console.log("Data received:", data);
  //   // Implement your line graph generation logic here
  // };

  // useEffect(() => {
  //   const fetchData = () => {
  //     fetch("http://localhost:3000/analysis")
  //       .then((res) => res.json())
  //       .then((data) => handleDataReceived(data))
  //       .catch((error) => console.error("Error fetching data:", error));
  //   };

  //   fetchData(); // Fetch immediately on component mount
  //   const interval = setInterval(fetchData, 1000); // Then every second

  //   return () => clearInterval(interval); // Clear interval on component unmount
  // }, []);

  const handleBarClick = (data, index) => {
    // Implement your click handling logic here
    console.log("Bar clicked:", data);
  };

  const handleMinutesChange = (event, newValue) => {
    setMinutes(newValue);
  };

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const remainingMinutes = minutes % 60;

  return (
    <div style={{padding: '20px'}}>
      <div>
        Scanning last <strong>{days} days, {hours} hours, and {remainingMinutes} minutes</strong>
      </div>
      <p>Total Messages: {messages.length}</p>

      <Slider
        value={minutes}
        onChange={handleMinutesChange}
        aria-labelledby="input-slider"
        min={0}
        max={timeSpan}
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
