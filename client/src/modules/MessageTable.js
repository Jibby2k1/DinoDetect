import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const MessageTable = ({ messages }) => (
  <div>
    <h2>Message Table</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {messages[0] &&
              Object.keys(messages[0]).map((key, index) => (
                <TableCell key={index}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.map((row, index) => (
            <TableRow key={index}>
              {Object.keys(row).map((key, cellIndex) => (
                <TableCell key={cellIndex}>
                  {key === "timestamp" ? row[key].toLocaleString() : row[key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export default MessageTable;
