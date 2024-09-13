const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 3333;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
const indexRouter = require('./routes/indexRouter');
app.use(cors()); //모든 도메인 허용

app.use('/', indexRouter);


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
