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
		},
		getTimeStart: function() {
			var time = admin.user.data.timeStart || "9";
			return window.parseInt(time, 10);
		},
		getTimeEnd: function() {
			var time = admin.user.data.timeEnd || "18";
			return window.parseInt(time, 10);
		},
		getBlacklist: function() {
			return this.get("blacklistedContacts");
		},
		getConversaciones: function(cb) {
			base.req("conversaciones", { email: admin.user.get("email") }, function(data) {
				data = JSON.parse(data);
				cb(data);
			});
		},
		getStats: function(cb) {
			base.req("stats", { email: admin.user.get("email") }, function(data) {
				data = JSON.parse(data);
				cb(data);
			});
		}
	},
	logout: function() {
		base.req("logout", { "accessToken": admin.user.getAccessToken() }, function() {
			localStorage.setItem("gaiaid", "");
			document.location.href = "/login.php";
		});
	},
	delete: function() {
		base.req("delete", { "accessToken": admin.user.getAccessToken() }, function() {
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
					$("a#settings").click(function() {
						admin.show("settings");
					});
					$("a#profile").click(function() {
						admin.show("profile");
					});
					$("a#conversaciones").click(function() {
						admin.show("conversaciones");
					});
					$("a#dashboard").click(function() {
						admin.show("dashboard");
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
	profile: {
		show: function() {
			var content = "";
			admin.setTitle("Profile");

			content += '<div class="row">';
			content += '<div class="col-sm-8">';
			content += '<div class="card"><div class="card-header bgm-green"><h2>Información de la cuenta<small>Aquí se lista la información relacionada a la cuenta</small></h2></div><div class="card-body card-padding"><div class="pmo-contact"><ul>';

			content += '<li class="ng-binding"><i class="zmdi zmdi-account"></i><b>Nombre:</b> ' + admin.user.data.name + ' ' + admin.user.data.lastname + ' </li>';
			content += '<li class="ng-binding"><i class="zmdi zmdi-email"></i><b>E-mail:</b> ' + admin.user.data.email + ' </li>';
			content += '<li class="ng-binding"><i class="zmdi zmdi-mood"></i><b>Bot:</b> ' + admin.user.data.botName + ' (' + admin.user.data.botEmail + ') </li>';
			content += '<li class="ng-binding"><i class="zmdi zmdi-calendar"></i><b>Fecha de alta:</b> ' + (new Date(admin.user.data.creationDate)).toDateString() + ' </li>';

			content += '</ul></div></div></div>';
			content += '</div>';

			content += '<div class="col-sm-4">';
			content += '<div class="card"><div class="card-header bgm-red"><h2>Eliminar cuenta<small>Elimine su cuenta. Esta acción es permanente.</small></h2></div><div class="card-body card-padding"><div class="text-center"><button id="deleteAccount" class="btn bgm-red waves-effect">Eliminar cuenta</button></div></div></div>';
			content += '</div>';

			content += '</div>';

			admin.setContent(content);
			$("#deleteAccount").click(function() {
				swal({
					title: "Esta seguro?",
					text: "Su cuenta sera eliminada, junto con toda su información. Esta acción no podra ser revertida.",
					type: "warning",
					showCancelButton: true,
					confirmButtonText: "Si, eliminar mi cuenta",
					cancelButtonText: "Cancelar"
				}).then(function(){
					admin.delete();
				});
			});
		}
	},
	dashboard: {
		show: function() {
			admin.setTitle("Dashboard");
			admin.setContent("Cargando...");

			admin.user.getStats(function(data) {
				var content = "", hasConv = data.convperday && data.convperday.length, d, raw = [];
				content += '<div class="card">';
				content += '<div class="card-header"><h2>Conversaciones mantenidas por día <small>Este gráfico muestra como se distribuyen por día la cantidad de conversaciones mantenidas por el bot</small></h2></div>';
				content += '<div class="card-body">'
				if (hasConv) {
					content += '<div class="chart-edge"><div id="curved-line-chart" class="flot-chart "></div></div>';
				} else {
					content += '<div class="card-body card-padding text-center">No se realizó ninguna conversación aún.</div>';
				}

				content += '</div>';
				content += '</div>';

				content += '<div class="mini-charts"><div class="row">';

				content += '<div class="col-sm-6 col-md-3"><div class="mini-charts-item bgm-lightgreen"><div class="clearfix"><div class="chart stats-bar"></div><div class="count"><small>Total conversaciones</small><h2>' + data.totalconv + '</h2></div></div></div></div>';

				content += '<div class="col-sm-6 col-md-3"><div class="mini-charts-item bgm-bluegray"><div class="clearfix"><div class="chart stats-bar"></div><div class="count"><small>Promedio diario</small><h2>' + data.avg.toFixed(2) + '</h2></div></div></div></div>';

				content += '<div class="col-sm-6 col-md-3"><div class="mini-charts-item bgm-orange"><div class="clearfix"><div class="chart stats-bar"></div><div class="count"><small>Total días con conversaciones</small><h2>' + data.convperday.length + '</h2></div></div></div></div>';

				content += '</div></div>';



				admin.setContent(content);

				if (hasConv) {
					    var options = {
						series: {
            						shadowSize: 0,
           						lines: {
               							show: false,
                						lineWidth: 0,
                						fill: 1
            						},
        					},
        					grid: {
            						borderWidth: 0,
            						labelMargin:10,
            						hoverable: true,
            						clickable: true,
            						mouseActiveRadius:6,
        					},
        					xaxis: {
            						tickDecimals: 1,
            						ticks: false
        					},
       						yaxis: {
            						tickDecimals: 0,
           						ticks: false
        					},
        					legend: {
            						show: false
        					}
    					};

					d = ([[null, 0]]).concat(data.convperday);
					d.push([null, 0]);

					for (i = 0; i < d.length; i++) {
						raw.push([i, d[i][1]]);
					}

					$.plot($("#curved-line-chart"), [
            					{ data: raw, lines: { show: true, fill: 0.98 }, label: '', stack: true, color: '#f1dd2c' },
        				], options);
					$(".flot-chart").bind("plothover", function (event, pos, item) {
            					if (item && raw[item.datapoint[0]]) {
                    					var y = item.datapoint[1];
                					$(".flot-tooltip").html(d[item.datapoint[0]][0] + ": " + y + " conversaciones").css({top: item.pageY + 5, left: item.pageX + 5}).show();
            					} else {
                					$(".flot-tooltip").hide();
            					}
        				});
        				$("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");
				}

			});
		}
	},
	conversaciones: {
		show: function() {
			var content = "", i, contenido;
			admin.setTitle("Conversaciones");
			admin.setContent("Cargando...");
			admin.user.getConversaciones(function(data) {
				var o;
				content += '<div class="row"><div class="col-sm-12"><div class="card">';
				content += '<div class="card-header"><h2>Conversaciones<small>Aquí se listan los ultimos mensajes recibidos por tu asistente (<b>' + admin.user.data.botName + '</b>)</small></h2>';
				content += '<div class="card-body card-padding"><div class="media-demo">';
				for (i = 0; i < data.length; i++) {

					for (o = 0; o < data[i].mensajes.length; o++) {
						contenido = data[i].mensajes[o].contenido || "";
						contenido = contenido.replace(/\n/, "<br>");
						content += '<div class="media"><div class="media-body"><h4 class="media-heading">Con: ' + data[i].guest + ' - ' + (new Date(data[i].createdAt)).toString() + '</h4>' + contenido + '</div></div>';
					}
				}
				content += '</div></div>';
				content += '</div></div></div>';
				admin.setContent(content);
			});
		}
	},
	settings: {
		show: function() {
			var content = "";
			admin.setTitle("Configuración");

			content += "<div class='row'>";

			content += "<div class='col-sm-4'><div class='card'><div class='card-header bgm-cyan'><h2>Horarios<small>Configure los horarios en los que Gaia concertará reuniones</small></h2></div><div class='card-body card-padding'>";
			content += "<p class='f-500 c-black m-b-20'>Rango de horarios</p>";
			content += "<div class=m-b-20 clearfix'><div id='input-slider-value' class='input-slider-range m-b-15'></div><strong class='pull-left text-muted' id='input-slider-value-output'></strong></div>";
			content += "<div class='m-t-20 text-right'><button id='guardarHorario' class='btn btn-info waves-effect'>Guardar</div></div>";
			content += "</div></div>";

			content += "<div class='col-sm-8'><div class='card'><div class='card-header bgm-red'><h2>Lista negra<small>Gaia nunca concertará una reunion con los contactos de esta lista</small></div><div class='card-body card-padding'>";

			content += "<select id='blacklist' class='form-control' multiple='multiple'></select>";
			content += "<div class='m-t-20 text-right'><button id='guardarBlacklist' class='btn btn-info waves-effect'>Guardar</div></div>";

			content += "</div></div></div>";

			content += "</div>";


			admin.setContent(content);

			var blacklistContacts = admin.user.getBlacklist(), i;
			for (i = 0; i < blacklistContacts.length; i++) {
				$("#blacklist").append($("<option>", { value: blacklistContacts[i], text: blacklistContacts[i], selected: "true" }));
			}

			$("#blacklist").select2({
				tags: true
			});

			var slider = document.getElementById ('input-slider-value');
			noUiSlider.create (slider, {
				start: [admin.user.getTimeStart(), admin.user.getTimeEnd()],
				connect: true,
				step: 1,
				range: {
					'min': 0,
					'max': 23
				}
			});
			slider.noUiSlider.on("update", function(values, handle) {
				document.getElementById('input-slider-value-output').innerHTML = "Solo organizar de " + values[0] + "hs a " + values[1] + "hs";
			});
			$("#guardarHorario").on("click", function() {
				var values = slider.noUiSlider.get(), timeStart = window.parseInt(values[0], 10), timeEnd = window.parseInt(values[1], 10);
				if (timeEnd > timeStart) {
					base.req("set", { accessToken: admin.user.getAccessToken(), timeStart: timeStart, timeEnd: timeEnd }, function(data) {
						if (data.error) {
							$.notify("Ocurrio un error al guardar las preferencias");
						} else {
							$.notify("Preferencias guardadas!", "success");
						}
					});
				}
			});
			$("#guardarBlacklist").on("click", function() {
				var values = JSON.stringify($("#blacklist").val());
				base.req("set", { accessToken: admin.user.getAccessToken(), "blacklistedContacts": values }, function(data) {
					if (data.error) {
						$.notify("Ocurrio un error al guardar las preferencias");
					} else {
						$.notify("Preferencias guardadas!", "success");
					}
				});
			});
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
