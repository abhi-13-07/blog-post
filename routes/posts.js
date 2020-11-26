const router = require('express').Router();
const Post = require('../models/Post');

const restrictUnAuth = require('../middlewares/restrictUnauth');

const renderPage = require('../helper/renderPage');

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
		res.redirect(`posts/${newPost.id}`);
	} catch (err) {
		req.flash('error', 'Error While creating Post');
		res.redirect('posts/new');
	}
});

router.get('/category/:category', async function (req, res) {
	const category = req.params.category;
	try {
		const posts = await Post.find({
			category: new RegExp(category, 'i'),
		}).populate('createdBy');
		const params = {
			posts: posts,
		};
		renderPage(req, res, 'posts/index', params);
	} catch (err) {
		console.log(err);
		req.flash('info', 'Error While Loading Information');
		res.redirect('/');
	}
});

router.get('/:id', async function (req, res) {
	try {
		const post = await Post.findById(req.params.id)
			.populate('createdBy')
			.exec();
		const params = {
			post: post,
		};
		renderPage(req, res, 'posts/post', params);
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/');
	}
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
