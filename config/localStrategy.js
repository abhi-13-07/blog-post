const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email' },
			async function (email, password, done) {
				try {
					const user = await User.findOne({ email: new RegExp(email, 'i') });
					if (!user) {
						return done(null, false, { message: 'Email not registred' });
					}
					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch) {
						return done(null, false, { message: 'Incorrect Password' });
					}
					return done(null, user);
				} catch (err) {
					console.log(err);
				}
			}
		)
	);
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
