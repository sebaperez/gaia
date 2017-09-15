var admin = {
	login: function(email, password) {
		if (email && password) {
			base.req("login", {
				email: email,
				password: password
			}, function(r) {
				console.log(r);
			});
		}
	},
	init: function() {
		var emailInput, passwordInput, btn;
		emailInput = document.querySelector("#email");
		passwordInput = document.querySelector("#password");
		btn = document.querySelector("#loginBtn");
		btn.onclick = function() {
			admin.login(emailInput.value, passwordInput.value);
		};
	}
};
admin.init();
