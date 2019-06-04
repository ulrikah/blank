const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path');

const PORT = 3000

app.use('/', express.static(path.join(__dirname, './')));

http.listen(PORT, function () {
  console.log('Listening on ' + PORT);
});
