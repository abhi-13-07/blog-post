const router = require('express').Router();
const Post = require('../models/Post');

const restrictUnAuth = require('../middlewares/restrictUnauth');

router.get('/new', restrictUnAuth, function (req, res) {
	res.render('posts/new');
});

router.post('/new', restrictUnAuth, async function (req, res) {
	console.log(req.user);
	const { title, coverImage, category, body, public } = req.body;
	try {
		const newPost = new Post({
			title: title,
			category: category,
			body: body,
			createdBy: req.user.id,
			isPrivate: typeof public !== 'undefined' ? false : true,
		});
		console.log(newPost);
		res.send('Post Created');
	} catch (err) {
		console.log(err);
	}
});

router.get('/:id', function (req, res) {
	res.send(req.params.id);
});

router.get('/category/:category', function (req, res) {
	res.send(req.params.category);
});

module.exports = router;
