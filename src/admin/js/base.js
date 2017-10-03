var base = {
	url: "http://localhost",
	req: function(action, params, cb) {
		var p = [], i, url;

		for (i in params) {
			p.push(i + "=" + params[i]);
		}
		url = encodeURIComponent(this.url + "/user/" + action + "?" + p.join("&"));

		$.get(this.proxy + url, {}, function(data) {
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
base.proxy = "http://" + location.hostname + "/proxy.php?url=";
