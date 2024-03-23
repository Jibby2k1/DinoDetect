import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MessageTable = ({ messages }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Author</TableCell>
          <TableCell>Guild</TableCell>
          <TableCell>Channel</TableCell>
          <TableCell>Message</TableCell>
          <TableCell>Timestamp</TableCell>
          <TableCell>Sentiment</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {messages.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.author}</TableCell>
            <TableCell>{row.guild}</TableCell>
            <TableCell>{row.channel}</TableCell>
            <TableCell>{row.message}</TableCell>
            <TableCell>{row.timestamp.toLocaleString()}</TableCell>
            <TableCell>{row.sentiment}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default MessageTable;
