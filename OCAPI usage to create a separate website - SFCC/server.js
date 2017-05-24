'use strict';

const express = require('express');
const app = express();

app.use(express.static(__dirname));
app.listen(3000);

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

console.log('Server running on port 3000. Last update was at' + new Date().toString());
