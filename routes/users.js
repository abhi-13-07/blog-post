const router = require('express').Router();

router.get('/login', function (req, res) {
	res.render('users/login');
});

router.get('/register', function (req, res) {
	res.render('users/register');
});

module.exports = router;
