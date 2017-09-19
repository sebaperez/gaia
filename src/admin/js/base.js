var base = {
	url: "http://localhost:3001",
	req: function(action, params, cb) {
		$.get(this.url + "/user/" + action, params, function(data) {
			if (cb) {
				cb(data);
			}
		});
	},
	checkSesion: function(cb) {
		var accessToken = localStorage.getItem("gaiaid");
		if (accessToken) {
			this.req("info", { "accessToken": accessToken }, function(data) {
				var res;
				if (data) {
					data = JSON.parse(data);
					if (data && data[0] && data[0].id) {
						res = data[0];
					} else if (data && data.id) {
						res = data;
					}
					res.accessToken = accessToken;
					cb(res);
				}
			});
		} else {
			cb();
		}
	}
};
base.url = "http://" + location.hostname + ":3001";
