if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.static(__dirname + '/public'));

mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((conn) => console.log(`Connected To Database(${conn.connection.host})`))
	.catch((err) => console.error(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000, () =>
	console.log('Server Started on port 3000')
);
