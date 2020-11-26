const router = require('express').Router();
const Post = require('../models/Post');

const restrictUnAuth = require('../middlewares/restrictUnauth');

router.get('/new', restrictUnAuth, function (req, res) {
	res.render('posts/new');
});

router.post('/new', restrictUnAuth, async function (req, res) {
	const { title, coverImage, category, body, public } = req.body;
	try {
		const post = new Post({
			title: title,
			category: category,
			body: body,
			createdBy: req.user.id,
			isPrivate: typeof public !== 'undefined' ? false : true,
		});
		saveCover(post, coverImage);
		const newPost = await post.save();
		req.flash('info', 'Post Created Successfully');
		// res.redirect(`posts/${newPost.id}`);
		res.redirect('/');
	} catch (err) {
		req.flash('error', 'Error While creating Post');
		res.redirect('posts/new');
	}
});

router.get('/:id', function (req, res) {
	res.send(req.params.id);
});

router.get('/category/:category', function (req, res) {
	res.send(req.params.category);
});

module.exports = router;

// for saving cover image
function saveCover(post, encodedImage) {
	const imageMimeType = ['image/jpeg', 'image/png', 'image/gif'];
	if (encodedImage == null) return;
	const cover = JSON.parse(encodedImage);
	if (cover !== null && imageMimeType.includes(cover.type)) {
		post.coverImage = new Buffer.from(cover.data, 'base64');
		post.coverImageType = cover.type;
	}
}
