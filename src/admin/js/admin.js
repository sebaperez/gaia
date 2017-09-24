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
		},
		hasCalendar: function() {
			return this.data.googleAccessToken;
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
				$(document).ready(function() {
					$("a#dashboard").click(function() {
						admin.show("dashboard");
					});
					$("a#settings").click(function() {
						admin.show("settings");
					});
					$("a#historial").click(function() {
						admin.show("historial");
					});
					admin.show("dashboard");
				});
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
	},
	setTitle: function(title) {
		$(".block-header h2").html(title);
	},
	setContent: function(content) {
		$("#content-body").html(content);
	},
	settings: {
		show: function() {
			var content = "";
			admin.setTitle("Configuración");
			admin.setContent(content);
		}
	},
	gcalendar: {
		show: function() {
			var content = "";
			admin.setTitle("Primeros pasos");
			content = "<div class='row'><div class='col-sm-12'><div class='card'><div class='card-header bgm-red'><h2>Configure Google Calendar</h2></div><div class='card-body card-padding'>Sincronice su cuenta de Google Calendar con Gaia para continuar<div class='text-center' style='margin-top: 20px;'><button id='gcalendar-sync' class='btn btn-primary btn-lg waves-effect'>Sincronizar</button></div></div></div></div></div>";
			admin.setContent(content);
			$("#gcalendar-sync").click(function() {
				admin.gcalendar.sync();
			});
		},
		sync: function() {
			window.open(base.GOOGLE_CALENDAR_URL + admin.user.get("id"), "_top");
		}
	},
	show: function(section) {
		$(".main-menu .active").removeClass("active");
		if (admin.user.hasCalendar()) {
			if (admin[section] && typeof admin[section].show == "function") {
				$(".main-menu a#" + section).parent().addClass("active");
				admin[section].show();
			}
		} else {
			admin.gcalendar.show();
		}
	}
};
admin.init();
