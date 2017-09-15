var base = {
	url: "http://localhost:3001",
	req: function(action, params, cb) {
		$.get(this.url + "/user/" + action, params, function(data) {
			if (cb) {
				cb(data);
			}
		});
	}
};
