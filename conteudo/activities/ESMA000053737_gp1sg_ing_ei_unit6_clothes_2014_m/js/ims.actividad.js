var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isAndroid = navigator.userAgent.match(/Android/i) != null;
var tipoActividad = "Test Multiple";
var url_gen = "";
var checked = 0;
var p = 2;
var dragging = false;
var draggingObj = null;
var soluciones = new Array();
var item_width = '';
var item_height = '';
var items = new Array();
var hots = new Array();
var results = new Array();
var hotspotDefaultBG = "";
var Images = "<div id='preload'><img alt='' src='img/1up.gif' /><img alt='' src='img/1down.gif' /><img alt='' src='img/2up.gif' /><img alt='' src='img/2down.gif' /><img alt='' src='img/4up.gif' /><img alt='' src='img/4down.gif' /><img alt='' src='img/8up.gif' /><img alt='' src='img/8down.gif' /><img alt='' src='img/16up.gif' /><img alt='' src='img/16down.gif' /><img alt='' src='img/32up.gif' /><img alt='' src='img/32down.gif' /><img alt='' src='img/64up.gif' /><img alt='' src='img/64down.gif' /><img alt='' src='img/128up.gif' /><img alt='' src='img/128down.gif' /><img alt='' src='img/256up.gif' /><img alt='' src='img/256down.gif' /></div>";
var ie = false;
var posobjx = 0;
var posobjy = 0;
var staticY = 0;
var staticX = 0;
var sonido=0;
var estado='parado';

var color = "";
var magnetismo = false;

var url_files = "";
var url_interfaz = "";
$(window).resize(function() {
	scroll();
});
function scroll() {
	ims.interfaz.resize();
	if ($("#intro_text").html() == null) {
		$("#carcasa").children().not(".pop_up").not(".item").not("#visor").height($("#carcasa").height());
		$('#visor').height($("#content").height() - 60);
		$('#visor').width($('#content').width());
	} else {
		$('#visor').width($('#content').width());
		$("#carcasa").height($("#carcasa").height()).children().height($("#carcasa").height());
		$('#visor').height($('#content').height() - 60);
		$('#visor').jScrollPane({
			showArrows : false,
			hideFocus : true,
			contentWidth : '0px',
			autoReinitialise : true
		});

	}
}


$(document).ready(function() {
	$(".ui-loader,.ui-page").remove();
	document.title = 'Santillana';
	if ($("#url_interfaz").text() != "") {
		url_interfaz = $("#url_interfaz").text();
	};
	$("#url_interfaz").remove();
	if ($("#url_files").text() != "") {
		url_files = $("#url_files").text();
	};
	$("#url_files").remove();
	config_xml = $.parseXML(config_xml);
	var miRuta = "";
	if (url_files != "") {
		miRuta = url_files;
	} else {
		miRuta = "fotos/";
	};
	var SubTipoInterfaz = $(config_xml).find("subTipoInterfaz").text();
	ims.interfaz.setSound('good', url_interfaz + 'audio/good.mp3');
	ims.interfaz.setSound('rBad', url_interfaz + 'audio/result_bad.mp3');
	ims.interfaz.setSound('rGood', url_interfaz + 'audio/result_good.mp3');
	ims.interfaz.setSound('beep_select', url_interfaz + 'audio/beep_select.mp3');
	if ($(config_xml).find("sonido").text() != ''){
		ims.interfaz.setSound('sonido', miRuta +$(config_xml).find("sonido").text());
	}
	ims.interfaz.setSubSkin(SubTipoInterfaz);
	ims.interfaz.init();
	$("#visor").append("<div id='visor'></div>");
	var overall = "<div id='overall'>" + $("#overall").html() + "</div>";
	$("#overall").remove();
	$("#content").prepend(overall);
	$("#right,#left").css("z-index", "1");
	$("#overall").css("z-index", "0").css("top", 0).css("margin-top", 0);
	if ( typeof(editable) != "undefined") {
		cargar_actividad();
	} else {
		inicializar();
	};
});
function inicializar() {
	if ($(config_xml).find("introduccion").find("texto1").text().length != 0) {

		var IntTit = $(config_xml).find("introduccion").find("titulo").text();
		var IntTex = $(config_xml).find("introduccion").find("texto1").text();

		$("#visor").append('<div id="intro_title">' + IntTit + '</div><div id="intro_text">' + IntTex + '</div>');
		ims.interfaz.setTitle($(config_xml).find("pregunta").find("titulo").text());
		var comenzar = $(config_xml).find("comenzar").text();

		ims.interfaz.addButton("Siguiente", "right", "siguiente2 ", comenzar);

		$('#overall').hide();

		ims.interfaz.enable("Siguiente");
		ims.interfaz.bind("Siguiente", 'nextPage()');
		scroll();

	} else {
		try{
			cargar_actividad();
		}
		catch(err){
			alert(err)
		}
	};
};

function resalta(elEvento) {
	var evento = elEvento || window.event;
	switch(evento.type) {
		case 'mouseover':
			this.style.borderColor = 'black';
			break;
		case 'mouseout':
			this.style.borderColor = 'silver';
			break;
	};
};

function cargar_actividad() {

	var titulo = $(config_xml).find("pregunta").find("titulo").text();
	var enunciado = $(config_xml).find("enunciado").text();

	$("#header").prepend(titulo);

	$("#pregunta").append(enunciado);

	var overall = "<div id='overall'>" + $("#overall").html() + "</div>";
	$("#overall").remove();
	$("#content").prepend(overall);
	$("#right,#left,#center").css("z-index", "9");
	$("#overall").css({
		"z-index" : "0",
		width : $("#fondo").width(),
		height : $("#fondo").height(),
		"margin-top" : 0
	});

	if ($(config_xml).find("pregunta").find("foto").length != 0) {
		var foto_object = $(config_xml).find("pregunta").find("foto");
		var foto = foto_object.text();
		var rotation = foto_object.attr("rotacion");
		var width = foto_object.attr("width");
		var height = foto_object.attr("height");

		var x = foto_object.attr("x");
		var y = foto_object.attr("y");

		if (foto != '') {
			if (isIE && version == 8) {
				var ieversion = new Number(RegExp.$1);
				if (ieversion >= 8) {
					if (url_files != "") {
						foto = url_files + foto
					} else {
						foto = "fotos/" + foto
					};
					$("#fondo").append("<div><img style=\"position:absolute;margin-left:" + x + "px;margin-top: " + y + "px;width:" + width + "px; height:" + height + "px; \" src=\"" + foto + "\"/></div>");
					if (x == "" && y == "") {
						height = parseInt($('#fondo div img').height());
						width = parseInt($('#fondo div img').width());
						if (width < $("#fondo").width() || height < $("#fondo").height()) {
							x = $("#fondo").offset().left + $("#fondo").width() - width;
							y = $("#fondo").offset().top + $("#fondo").height() - height;
							$('#fondo div img').css({
								"margin-left" : x + "px ",
								"margin-top" : +y + "px"
							})
						}
					}
				}
			} else {
				if (url_files != "") {
					$('#fondo').css("background-image", "url(" + url_files + foto + ")")
				} else {
					$('#fondo').css("background-image", "url(fotos/" + foto + ")")
				};
				$('#fondo').css("background-repeat", "no-repeat");
				if (rotation != '') {
					$('#fondo').css("rotation", rotation);
				}
				if (x != '' || y != '') {
					$('#fondo').css("background-position", x + "px " + y + "px");
				}
				if (width != '' && height != '') {
					$('#fondo').css("background-size", width + "px " + height + "px")
				} else {
					if (height != '') {
						$('#fondo').css("background-size", "auto " + height + "px")
					} else {
						if (width != '') {
							$('#fondo').css("background-size", width + "px auto")
						}
					}
				}
			}
		};

	};
	// Elementos
	// Titulo

	var silenciar = $(config_xml).find("silenciar").text();
	var ayuda = $(config_xml).find("palabras").find("ayuda").text();
	var comprobar = $(config_xml).find("comprobar").text();
	var clave = $(config_xml).find("desarrollosolucion").text();
	var versolucion = $(config_xml).find("versolucion").text();
	var reiniciar = $(config_xml).find("reiniciar").text();

	var volver = $(config_xml).find("volver").text();

	ims.interfaz.addButton("Anterior", "left", "anterior", volver);
	if ($(config_xml).find("sonido").text() != ''){
		ims.interfaz.addButton( "pausar", "left", "pause", $(config_xml).find("pausa").text());
	  	ims.interfaz.addButton( "player", "left", "play", $(config_xml).find("reproducir").text());
	}
	if(!isAndroid&&!isiPad)
		ims.interfaz.addButton("silenciar", "left", "silenciar", silenciar);

	ims.interfaz.addButton("reiniciar", "right", "reiniciar", reiniciar);
	ims.interfaz.addButton("clave", "right", "clave", clave);
	ims.interfaz.addButton("versolucion", "right", "versolucion", versolucion);
	ims.interfaz.addButton("comprobar", "right", "comprobar", comprobar);
	ims.interfaz.addButton("ayuda", "right", "ayuda", ayuda);

	//Activamos el reproductor
	$('#pausar').css('display','none');
	if ($(config_xml).find("sonido").text() != ''){
		ims.interfaz.enable("player");
		ims.interfaz.bind("player", 'a_player()');
		ims.interfaz.enable("pausar");
		ims.interfaz.bind("pausar", 'a_pausar()');
		sonido = $("#sonido").get(0);
	}
	

	if ($(config_xml).find("introduccion").find("texto1").text().length != 0) {
		ims.interfaz.enable("Anterior");
		ims.interfaz.bind("Anterior", 'prevPage()');
	};

	if (ims.interfaz.sound) {
		ims.interfaz.enable("silenciar");
		ims.interfaz.bind("silenciar", "mute()");
	} else {
		ims.interfaz.bind("silenciar", "play()");
	};
	if ($(config_xml).find("ayuda").find("texto1").text().length != 0) {
		ims.interfaz.addPopup("ayuda", "ayuda");
		$(config_xml).find("ayuda").each(function() {
			var ayudaTit = $(this).find("titulo").text();
			var ayudaTex = $(this).find("texto1").text();
			$('#pop_ayuda').prepend("<span class='pop_up_title'>" + ayudaTit + "</span>");
			$('#content_ayuda').append(ayudaTex);
		});

	};

	ims.interfaz.bind("reiniciar", 'reload()');
	ims.interfaz.bind("comprobar", 'comprobar()');
	ims.interfaz.enable("reiniciar");
	ims.interfaz.enable("comprobar");

	if ($(config_xml).find("magnetismo").text() == "si")
		magnetismo = true;

	var tipo_actividad = $(config_xml).find("tipo").text();

	var items_class = "";
	if ($(config_xml).find("items").attr('visibles') == "no") {
		var items_class = items_class + ' no_background ';
	};

	var hots_class = "";
	if ($(config_xml).find("hots").attr('visibles') == "no") {
		var hots_class = hots_class + ' no_background ';
	};

	if (tipo_actividad == 'rotulacionmarcar') {

		var marcarhot = "";

		ims.interfaz.bind("comprobar", 'comprobarMarcar()');
		ims.interfaz.enable("comprobar");

		$(config_xml).find("item").each(function() {
			marcarhot = $(this).text().replace('<p>', '').replace('</p>', '');

			var idw = $(this).attr("idw");

			$("#overall").append('<div id = "item_' + idw + '" class="item_marcar" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px;z-index:0; height: ' + $(this).attr("height") + 'px;" posicion="-1" x="' + (Math.round($(this).attr("x")) - $(this).attr("width") ) + '" y="' + ( Math.round($(this).attr("y")) ) + '" rel="' + idw + '">' + marcarhot + '</div>');
			if (marcarhot.indexOf("img") != -1) {
				$('#item_' + idw).children().height($(this).attr("height")).width($(this).attr("width")).attr("id", "hot_" + idw).css("z-index", "0")
			};
			if ($.browser.msie && $.browser.version.slice(0, 1) == "8") {

				// var element = document.getElementById("item_" + idw);
				// element.onmouseover = function() {
				//
				// var elementHot = document.getElementById("hot_" + idw);
				// elementHot.style.border = "2px solid black"
				// // element.style.border="width style color"
				// // $("#item_" + idw).addClass("clicked")
				//
				// }
			};
		});

		$(config_xml).find("hot").each(function() {

			var idw = $(this).attr("idw");
			results[idw] = $(this).attr("correcto");

			$("#overall").append('<div id = "hot_' + idw + '" class="hot_marcar" style="cursor:pointer;display:block;position: absolute;z-index:10000; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px;background: url(' + url_interfaz + 'css/images/transparentepng.png) repeat center; height: ' + $(this).attr("height") + 'px;" posicion="-1" x="' + (Math.round($(this).attr("x")) - $(this).attr("width") ) + '" y="' + ( Math.round($(this).attr("y")) ) + '" rel="' + idw + '"></div>');
			$("#hot_" + idw).click(function() {

				$(this).toggleClass('clicked');

			});

		});

	};
	$("#content_ayuda").width($("#content_ayuda").width() + 20)
	var tA = 0;
	$("#ayuda").click(function() {

		if (tA == 0) {
			$('#content_ayuda').jScrollPane({
				showArrows : false,
				hideFocus : true
			});
			tA++;
		}
	});
	scroll();
};

function comprobarMarcar() {
	$("#overall").css("z-index", 1);
	if ($("#comprobar").hasClass("notdisabled")) {
		if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
			ims.interfaz.enable("clave");
			ims.interfaz.addPopup("solucion", "clave");
			if (ims.interfaz.getSkin() != "musica") {
				$("#content_solucion").width($("#content_solucion").width() + 20)
			} else {
				$("#content_solucion p").width($("#content_solucion").width() - 20)
			};
			if (ims.interfaz.getSkin() == "primaria" || ims.interfaz.getSkin() == "secundaria") {
				$("#content_solucion").height($("#content_solucion").height() - 20)
			}
			var tS = 0;
			$("#clave").click(function() {

				if (tS == 0) {
					$('#content_solucion').jScrollPane({
						showArrows : false,
						hideFocus : true
					});
					tS++;
				}
			});
			$(config_xml).find("solucion").each(function() {
				var solucionTit = $(this).find("titulo").text();
				var solucionTex = $(this).find("texto1").text();
				$('#pop_solucion').prepend("<span class='pop_up_title'>" + solucionTit + "</span>");
				$('#content_solucion').append(solucionTex)
			})
		};
		ims.interfaz.bind("versolucion", "solucionMarcar()");
		ims.interfaz.enable("versolucion");

		var total = 0;
		var aciertos = 0;
		$(config_xml).find("hot").each(function() {
			if ($(this).attr("correcto") == "si") {
				total++;
			};
		});
		var resultado = "";
		$("#overall").find(".hot_marcar").each(function() {

			var id_item = $(this).attr('rel');
			$(this).unbind('click');

			if (($(this).hasClass('clicked') && results[id_item] == "si")) {
				if($(this).width()>$(this).height()){
					var alto = $(this).height()+"px";
					var ancho = "auto";
				}else{
					var ancho = $(this).width()+"px";
					var alto = "auto";
				}

				$(this).removeClass("clicked");
				$(this).addClass("green_border").css({
					"background" : "url(" + url_interfaz + "css/images/marcar_check.png) no-repeat center",
					"background-size" : ancho + " " + alto
				});
				aciertos++;

				ims.interfaz.showStars($(this).offset().left, $(this).offset().top, "center", $(this).attr("id"));
				ims.interfaz.showStars($(this).offset().left + $(this).width() - 20, $(this).offset().top, "right", $(this).attr("id"));

			} else {

				if ($(this).hasClass('clicked') && results[id_item] == "no") {
					if($(this).width()>$(this).height()){
					var alto = $(this).height()+"px";
					var ancho = "auto";
				}else{
					var ancho = $(this).width()+"px";
					var alto = "auto";
				}
					$(this).addClass("green_border").css({
						"background" : "url(" + url_interfaz + "css/images/marcar_nocheck.png) no-repeat center",
						"background-size" : ancho + " " + alto 
					});
					aciertos--;
					$(this).removeClass("clicked");
					$(this).addClass("red_border");

				};

			};

		});
		if(aciertos<0)
			aciertos=0;
		resultado = "<p> " + aciertos + " / " + total + " </p>";
		if (aciertos != total) {
			if (estado == 'parado'){
				ims.interfaz.playSound('rBad');
			}

		} else {
			if (estado == 'parado'){
				ims.interfaz.playSound('rGood');
			}

		};
		if ($(config_xml).find("countOnline").text() == 1) {
			ims.interfaz.showResults(resultado);
		};
		ims.interfaz.disable("comprobar");

	};
};

function solucionMarcar() {

	var total = $(config_xml).find("hot").length;
	var count = total;

	$("#center").hide();
	$("#center").empty();

	$(".stars").remove();
	$(".red_border").removeClass("red_border").css("background","");
	$(".green_border").removeClass("green_border").css("background","");

	$("#overall").find(".hot_marcar").each(function() {

		var id_item = $(this).attr('rel');

		$(this).removeClass("clicked");
		
		$(this).removeClass("red_border");
		if($(this).width()>$(this).height()){
					var alto = $(this).height()+"px";
					var ancho = "auto";
				}else{
					var ancho = $(this).width()+"px" ;
					var alto = "auto";
				}
		if (results[id_item] == "si") {
			$(this).addClass("green_border").css({
				"background" : "url(" + url_interfaz + "css/images/marcar_check.png) no-repeat center",
				"background-size" : ancho + " " + alto
			});;
			ims.interfaz.showStars($(this).offset().left, $(this).offset().top, "center", $(this).attr("id"));
			ims.interfaz.showStars($(this).offset().left + $(this).width() - 20, $(this).offset().top, "right", $(this).attr("id"));
		};

		if (!--count) {
			if (estado == 'parado'){
				ims.interfaz.playSound('good');
			}

		};
		
	});

	ims.interfaz.disable("versolucion");
};

function prevPage() {
	$(".stars").remove();
	$(".tooltip").remove("");
	$("#limit").remove("");
	ims.interfaz.init();
	$("#overall").hide();
	inicializar();

};

function nextPage() {
	$("#overall").show();
	$(".tooltip").remove("");
	$("#limit").remove("");
	ims.interfaz.init();
	cargar_actividad();

};

function reload() {
	fill = "";
	$("canvas, .row").remove();
	$(".stars").remove();
	$(".tooltip").remove("");
	$("#limit").remove("");
	ims.interfaz.init();

	cargar_actividad();

	if (!ims.interfaz.sound) {
		mute();
	};

};

function mute() {
	$('.tooltip').hide();
	$('#silenciar').attr('title', $(config_xml).find("silenciar").text());
	$('#silenciar').removeClass('silenciar');
	$('#silenciar').addClass('silenciar_on');
	$('#silenciar').tooltip();
	ims.interfaz.bind("silenciar", "play()");
	ims.interfaz.disableSound();
};

function play() {
	$('.tooltip').hide();
	$('#silenciar').attr('title', $(config_xml).find("silenciar").text());
	$('#silenciar').removeClass('silenciar_on');
	$('#silenciar').addClass('silenciar');
	$('#silenciar').tooltip();
	ims.interfaz.bind("silenciar", "mute()");
	ims.interfaz.enableSound();
};

function a_player(){
	estado = 'sonando';
	$('#player').css('display','none');
	$('#pausar').css('display','block');
	sonido.play();
	setTimeout(function() {
		if (sonido.currentTime == sonido.duration && $('#pausar').css('display') == 'block'){
			$('#pausar').css('display','none');
			$('#player').css('display','block');
			estado = 'parado';
		}
	}, sonido.duration*1100);
}

function a_pausar(){
	sonido.pause();
	estado = 'parado';
	$('#pausar').toggle();
	$('#player').toggle();
}