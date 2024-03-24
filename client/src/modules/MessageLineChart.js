import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

const aggregateData = (labels, values) => {
  const aggregationFactor = Math.ceil(labels.length / 100);
  const aggregatedData = [];

  for (let i = 0; i < labels.length; i += aggregationFactor) {
    const aggregatedLabels = labels.slice(i, i + aggregationFactor);
    const aggregatedValues = values.slice(i, i + aggregationFactor);

    const avgValue = aggregatedValues.reduce((acc, val) => acc + val, 0) / aggregatedValues.length;
    aggregatedData.push({
      label: aggregatedLabels[0], // Use the first label of the group
      value: avgValue,
    });
  }

  return aggregatedData;
};

const MessageLineChart = ({ labels, values, title, xAxisTitle, yAxisTitle, onLineClick }) => {
  console.log("amt of labels: ", labels.length);

  const data = labels.length > 100 ? aggregateData(labels, values) : labels.map((label, index) => ({
    label: label,
    value: values[index],
  }));

  return (
    <Box maxWidth="sm">
      <Typography width="500px" variant="h4" textAlign="center">{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 25,
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