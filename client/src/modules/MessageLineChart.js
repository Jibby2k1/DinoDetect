import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';
import { Box, Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const MessageLineChart = ({ labels, values, title, xAxisTitle, yAxisTitle, onLineClick }) => {
  const data = labels.map((label, index) => ({
    label: label,
    value: values[index],
  }));

  return (
    <Box maxWidth="sm">
      <Typography variant="h2">{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 25, // Adjusted bottom margin for X-axis title
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis label={{ value: xAxisTitle, position: 'insideBottom', offset: -5 }} dataKey="label" />
          <YAxis label={{ value: yAxisTitle, angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ onClick: onLineClick }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MessageLineChart;
