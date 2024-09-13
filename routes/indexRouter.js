const express = require('express');
const router = express.Router();
const app = express();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

module.exports = router;

