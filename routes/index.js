const router = require('express').Router();
const Post = require('../models/Post');

router.get('/', async function (req, res) {
	try {
		const posts = await Post.find({})
			.sort({ createdAt: 'desc' })
			.limit(10)
			.populate('createdBy');
		const params = {
			posts: posts,
			auth: false,
		};
		if (req.isAuthenticated()) {
			params.auth = true;
			params.user = req.user;
		}
		res.render('index', params);
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
