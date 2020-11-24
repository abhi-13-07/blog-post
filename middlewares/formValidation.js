const User = require('../models/User');

async function formValidation(req, res, next) {
	const errors = [];
	const { name, email, password1, password2 } = req.body;
	if (name == null || email == null || password1 == null || password2 == null) {
		errors.push('Enter all the fields');
	}
	if (password1.length < 6) {
		errors.push('password must be atleast 8 characters');
	}
	if (password1 !== password2) {
		errors.push('password does not match');
	}
	try {
		const user = await User.findOne({ email: new RegExp(email, 'i') });
		if (user) {
			errors.push('Already an account exists with this email');
		}
		if (errors.length > 0) {
			res.render('users/register', { errors: errors });
		} else {
			next();
		}
	} catch (err) {
		console.log(err);
	}
}

module.exports = formValidation;
