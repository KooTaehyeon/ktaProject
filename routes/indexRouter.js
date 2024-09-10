const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('<a href="/db">db</a>');
});

module.exports = router;
