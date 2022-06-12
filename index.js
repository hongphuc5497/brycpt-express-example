require('@babel/register');
require('babel-polyfill');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('./controllers/userController');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

app.use('/user', user);

app.use((err, req, res, next) => {
	console.error(err);
	return res.status(400).send({ error: err });
});

app.listen(process.env.PORT || 8080, () => {
	console.log('App running on port 8080!');
});
