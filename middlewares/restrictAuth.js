function restrictAuth(req, res, next) {
	if (req.isAuthenticated()) {
		req.flash('info', 'You are already logged in');
		res.redirect('/');
	} else {
		next();
	}
}

module.exports = restrictAuth;
