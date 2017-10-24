var base = {
	url: "http://localhost",
	GOOGLE_CALENDAR_URL: "https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&response_type=code&client_id=702075112008-6tf7l2cd08nl11l4sf79lcupqj820f7c.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Fadmin.gaiameet.com%2Fsync.php&state=",
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
