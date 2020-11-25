const router = require('express').Router();

router.get('/', function (req, res) {
	if (req.isAuthenticated()) {
		res.render('index', { auth: true, user: req.user });
	} else {
		res.render('index', { auth: false });
	}
});

module.exports = router;
