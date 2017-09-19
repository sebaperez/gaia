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
		base.req("register", data, function(r) {
			var input, i;
			if (r) {
				r = JSON.parse(r);
				if (r.error && r.error.details && r.error.details.messages) {
					for (i in r.error.details.messages) {
						input = document.querySelector("[name='" + i + "']");
						$.notify($(input), r.error.details.messages[i][0]);
					}
				}
			}
		});
	},
	init: function() {
		this.initRegister();
		this.initLogin();
	},
	initLogin: function() {
		document.querySelector("#loginBtn").onclick = function() {
			var emailInput, passwordInput
			emailInput = document.querySelector("#email");
			passwordInput = document.querySelector("#password");
			admin.login(emailInput.value, passwordInput.value);
		};
	},
	initRegister: function() {
		document.querySelector("#registerBtn").onclick = function() {
			var fields = document.querySelectorAll("input.register"), i, data = {};
			for (i in fields) {
				if (fields[i] && fields.hasOwnProperty(i)) {
					data[fields[i].name] = fields[i].value || "";
				}
			}
			if (! data.password) {
				data.password = ".";
			}
			admin.register(data);
		};
	}
};
admin.init();
