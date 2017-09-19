var admin = {
	user: {
		data: {},
		set: function(data) {
			this.data = data;
		},
		get: function(param) {
			return this.data[param] || "";
		},
		loaded: function() {
			return this.data.id;
		},
		getFullName: function() {
			return this.get("name") + " " + this.get("lastname");
		},
		getAccessToken: function() {
			return this.get("accessToken");
		}
	},
	logout: function() {
		base.req("logout", { "accessToken": admin.user.getAccessToken() }, function() {
			localStorage.setItem("gaiaid", "");
			document.location.href = "/login.php";
		});
	},
	init: function() {
		var user = base.checkSesion(function(user) {
			if (! user) {
				document.location.href = "/login.php";
			} else {
				admin.user.set(user);
			}
		});
	},
	fill: function() {
		if (this.user.loaded()) {
			$(".sp-info").html(this.user.getFullName());
			$("#logout").click(function() {
				admin.logout();
			});
		} else {
			setTimeout(function() {
				admin.fill();
			}, 500);
		}
	}
};
admin.init();
