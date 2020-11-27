const router = require('express').Router();
const Post = require('../models/Post');

const restrictUnAuth = require('../middlewares/restrictUnauth');
const userPermission = require('../middlewares/userPermission');

const renderPage = require('../helper/renderPage');

router.get('/new', restrictUnAuth, function (req, res) {
	renderPage(req, res, 'posts/new', { post: {} });
});

router.post('/new', restrictUnAuth, async function (req, res) {
	const { title, coverImage, category, body, postType } = req.body;
	try {
		const post = new Post({
			title: title,
			category: category,
			body: body,
			createdBy: req.user.id,
		});
		setPostType(post, postType);
		saveCover(post, coverImage);
		const newPost = await post.save();
		req.flash('info', 'Post Created Successfully');
		res.redirect(`/posts/${newPost.id}`);
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

router.get(
	'/edit/:id',
	restrictUnAuth,
	userPermission,
	async function (req, res) {
		try {
			const post = await Post.findById(req.params.id);
		} catch (err) {
			req.flash('err', 'You are allowed to view this page');
			res.redirect('/');
		}
	}
);

router.put(
	'/edit/:id',
	restrictUnAuth,
	userPermission,
	async function (req, res) {
		const { title, coverImage, category, body, postType } = req.body;
		try {
			const post = await Post.findById(req.params.id);
			post.title = title;
			post.category = category;
			post.body = body;
			setPostType(post, postType);
			if (coverImage != null && coverImage !== '') {
				saveCover(post, coverImage);
			}
			await post.save();
			req.flash('success', 'Successfully Updated');
			res.redirect(`/posts/${post.id}`);
		} catch (err) {
			req.flash('err', err.message);
			res.redirect(`/posts/${req.params.id}`);
		}
	}
);

router.delete(
	'/delete/:id',
	restrictUnAuth,
	userPermission,
	async function (req, res) {
		try {
			const post = await Post.findById(req.params.id);
			post.remove();
			req.flash('success', 'Successfully Deleted');
			res.redirect('/');
		} catch {
			req.flash('err', 'Error while removing the post');
			res.redirect('/');
		}
	}
);

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

function setPostType(post, postType) {
	if (postType === 'Public') {
		post.isPrivate = false;
	} else {
		post.isPrivate = true;
	}
}
