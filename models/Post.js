const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	coverImage: {
		type: Buffer,
		required: true,
	},
	coverImageType: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	isPrivate: {
		type: Boolean,
		required: true,
		default: true,
	},
});

module.exports = mongoose.model('Post', postSchema);
