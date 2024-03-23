import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Text } from 'recharts';
import { Container, Typography } from '@mui/material';

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

const MessageBarChart = ({ labels, values, title, xAxisTitle, yAxisTitle, onBarClick }) => {
  const data = labels.map((label, index) => ({
    label: label,
    value: values[index],
  }));

  return (
    <Container maxWidth="sm">
      <Typography variant="h2">{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
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
          <Bar dataKey="value" fill="#8884d8" onClick={onBarClick} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default MessageBarChart;