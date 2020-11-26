const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const passport = require('passport');

const formValidation = require('../middlewares/formValidation');
const restrictAuth = require('../middlewares/restrictAuth');

const renderPage = require('../helper/renderPage');

router.get('/login', restrictAuth, function (req, res) {
	res.render('users/login');
});

router.post('/login', async function (req, res, next) {
	const { email, password } = req.body;
	passport.authenticate('local', {
		successRedirect: '/',
		successFlash: 'You are logged in successfully',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

router.get('/register', restrictAuth, function (req, res) {
	res.render('users/register');
});

router.post('/register', formValidation, async function (req, res) {
	const { name, email, password1 } = req.body;
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password1, salt);

		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});
		await newUser.save();

		req.flash('success', `You can use ${req.body.email} to login`);
		res.redirect('/users/login');
	} catch (err) {
		console.log(err);
		res.redirect('/users/register');
	}
});

router.get('/logout', function (req, res) {
	req.logout();
	req.flash('info', 'You were logged out');
	res.redirect('/');
});

router.get('/:id', async function (req, res) {
	try {
		const user = await User.findById(req.params.id);
		const postsOfUser = await Post.find({ createdBy: user.id });
		const params = {
			user: user,
			posts: postsOfUser,
		};
		renderPage(req, res, 'users/user', params);
	} catch (err) {
		res.redirect('/');
	}
});

module.exports = router;
