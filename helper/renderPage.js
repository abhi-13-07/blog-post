function renderPage(req, res, page, params) {
	if (req.isAuthenticated()) {
		params.auth = true;
		params.user = req.user;
	} else {
		params.auth = false;
	}
	res.render(page, params);
}

module.exports = renderPage;
