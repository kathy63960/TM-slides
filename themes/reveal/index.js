exports.install = function() {
	F.merge('/reveal/css/default.css', '/css/bootstrap.min.css', '/css/ui.css', '=reveal/public/css/default.css');
	F.merge('/reveal/js/default.js', '/js/jctajr.min.js', '/js/ui.js', '=reveal/public/js/default.js');
};