if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const methodOverride = require('method-override');

const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const localStrategy = require('./config/localStrategy');

//setting auth strategy
localStrategy(passport);

mongoose
	.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then((conn) => console.log(`Connected To Database(${conn.connection.host})`))
	.catch((err) => console.error(err));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(express.json());
app.use(express.static('public'));
app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);

app.use('/users/:id', express.static('public'));
app.use('/users', usersRouter);

app.use('/posts/:id', express.static('public'));
app.use('/posts', postsRouter);

app.listen(process.env.PORT || 3000, () =>
	console.log('Server Started on port 3000')
);
