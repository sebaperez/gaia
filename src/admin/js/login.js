var admin = {
	login: function(email, password) {
		if (email && password) {
			base.req("login", {
				email: email,
				password: password
			}, function(r) {
				if (r) {
					r = JSON.parse(r);
					if (r.error) {
						$.notify(r.error.message);
					} else if (r.accessToken) {
						localStorage.setItem("gaiaid", r.accessToken);
						document.location.href = "/index.php";
					}
				}
			});
		}
	},
	register: function(data) {
		localStorage.setItem("gaiaid", "");
		base.req("register", data, function(r) {
			var input, i;
			if (r) {
				r = JSON.parse(r);
				if (r.error && r.error.details && r.error.details.messages) {
					for (i in r.error.details.messages) {
						input = document.querySelector("[name='" + i + "']");
						$.notify($(input), r.error.details.messages[i][0]);
					}
				} else {
					admin.login(document.querySelector("[name='email']").value, document.querySelector("[name='password']").value);
				}
			}
		});
	},
	init: function() {
		this.initRegister();
		this.initLogin();
	},
	initLogin: function() {
		var doLogin = function() {
			var emailInput, passwordInput
			emailInput = document.querySelector("#email");
			passwordInput = document.querySelector("#password");
			admin.login(emailInput.value, passwordInput.value);
		};
		document.querySelector("#loginBtn").onclick = function() {
			doLogin();
		};
		$(document).keypress(function(e) {
			if (e.which == 13) {
				if ($("#l-login.toggled").length) {
					doLogin();
				}
			}
		});
	},
	initRegister: function() {
		var doRegister = function() {
			var fields = document.querySelectorAll("input.register"), i, data = {};
			for (i in fields) {
				if (fields[i] && fields.hasOwnProperty(i)) {
					data[fields[i].name] = fields[i].value || "";
				}
			}
			data["botEmail"] += "@gaiameet.com";
			if (! data.password) {
				data.password = ".";
			}
			admin.register(data);
		};
		document.querySelector("#registerBtn").onclick = function() {
			doRegister();
		};
		$(document).keypress(function(e) {
			if (e.which == 13) {
				if (! $("#l-login.toggled").length) {
					doRegister();
				}
			}
		});

	}
};
admin.init();
