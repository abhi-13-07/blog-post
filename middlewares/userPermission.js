const Post = require('../models/Post');

async function userPermission(req, res, next) {
	try {
		const post = await Post.findById(req.params.id)
			.populate('createdBy')
			.exec();
		if (post.createdBy.id === req.user.id) {
			next();
		} else {
			req.flash('info', 'You are not allowed to perform this action');
			res.redirect('/');
		}
	} catch {
		req.flash('err', 'Error While Processing request');
		res.redirect('/');
	}
}

module.exports = userPermission;
