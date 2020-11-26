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

postSchema.virtual('coverImageLink').get(function () {
	if (this.coverImage !== null && this.coverImageType != null) {
		return `data:${
			this.coverImageType
		};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
	}
});

module.exports = mongoose.model('Post', postSchema);
