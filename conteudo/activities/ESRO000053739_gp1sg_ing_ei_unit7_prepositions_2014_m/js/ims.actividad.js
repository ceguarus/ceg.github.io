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
var hots = new Array(), hot = new Array();
var results = new Array();
var hotspotDefaultBG = "";
var Images = "";
var ie = false;
var posobjx = 0;
var posobjy = 0;
var staticY = 0;
var staticX = 0;
var dSup = 0;
var color = "";
var magnetismo = false;
var posicionFlechas = "";
var url_files = "";
var url_interfaz = "", idItem = "", skin = "", objeto = [];
if ( typeof document != 'undefined' && document.readyState != 'complete' && window.addEventListener) {
	window.addEventListener('DOMContentLoaded', function(e) {
		init();
		window.addEventListener("scroll", posicionar, false);
		window.addEventListener("resize", posicionar, false);
		
		window.addEventListener("load",posicionar, false);
	});
} else {
	$(window).ready(function() {
		init();
	});
	$(window).resize(function() {
		posicionar();
	});
	$(window).load(function() {
		posicionar();
		
	});
	$(window).scroll(function() {
		posicionar();
	});
}
var posicionar = function() {
	ims.interfaz.resize();
	if ($("#intro_text").html() == null) {
		$("#carcasa").children().not(".pop_up").not(".item").not("#visor").height($("#carcasa").height());
		$('#visor').height($("#content").height() - 60);
		$('#visor').width($('#content').width());
		$("#overall,#fondo").css({
			width : $("#visor").width(),
			height : $("#visor").height(),
			"margin-top" : $("#visor").position().top
		});
	} else {
		$('#visor').width($('#content').width());
		$("#carcasa").height($("#carcasa").height()).children().height($("#carcasa").height());
		$('#visor').height($('#content').height() -60);
		$('#visor').jScrollPane({
			showArrows : false,
			hideFocus : true,
			contentWidth : '0px',
			autoReinitialise : true
		});

	}


};
function init() {
	if ($.browser.msie && $.browser.version == "8.0")
		ie = true;
	if ($("#url_interfaz").text() != "") {
		url_interfaz = $("#url_interfaz").text();
	};
	if ($("#url_files").text() != "") {
		url_files = $("#url_files").text();
	};
	$("#url_interfaz,#url_files,.ui-page,.ui-loader").remove();

	config_xml = $.parseXML(config_xml);

	document.title = "Santillana";
	var SubTipoInterfaz = $(config_xml).find("subTipoInterfaz").text();
	ims.interfaz.setSubSkin(SubTipoInterfaz);

	ims.interfaz.setSound('good', url_interfaz + 'audio/good.mp3');
	ims.interfaz.setSound('rBad', url_interfaz + 'audio/result_bad.mp3');
	ims.interfaz.setSound('rGood', url_interfaz + 'audio/result_good.mp3');
	ims.interfaz.setSound('beep_select', url_interfaz + 'audio/beep_select.mp3');

	ims.interfaz.init();

	if (isMobile) {

		$(".notdisabled").bind("touchstart", function() {
			$(this).addClass("active");
		}).bind("touchend", function() {
			$(this).removeClass("active");
		});
	};
	if ( typeof (editable) == "undefined" && $(config_xml).find("introduccion").find("texto1").text().length != 0) {
		inicializar();
	} else {
		cargar_actividad();
	};
};

function inicializar() {
	var IntTit = $(config_xml).find("introduccion").find("titulo").text();
	var IntTex = $(config_xml).find("introduccion").find("texto1").text();
	$("#visor").append('<div id="intro_title">' + IntTit + '</div><div id="intro_text">' + IntTex + '</div>');
	var comenzar = $(config_xml).find("comenzar").text();

	ims.interfaz.setTitle($(config_xml).find("pregunta").find("titulo").text());

	$('#overall').hide();

	ims.interfaz.addButton("Siguiente", "right", "siguiente ", comenzar);
	ims.interfaz.enable("Siguiente");
	ims.interfaz.bind("Siguiente", 'nextPage()');
	posicionar();
};


function cargar_actividad() {

	loadContent();

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

	if (tipo_actividad == 'textolibrehotspot') {
		ims.interfaz.bind("comprobar", 'comprobarTextoLibre()');
		ims.interfaz.enable("comprobar");
		var i = 1, hotHeight;
		$(config_xml).find("hot").each(function() {
				hotHeight = $(this).attr("height");
			var idw = $(this).attr("idw");
			$("#overall").append('<div id = "hot_' + idw + '" style="position: absolute; height: ' + $(this).attr("height") + 'px; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px;"></div>');
			$("#hot_" + idw).html('<input id = "input_' + idw + '" class="hotspot_arrastrar ' + hots_class + '" type="text" style=" height: ' + hotHeight + 'px;width: ' + $(this).attr("width") + 'px; text-align:center;">');
		});
		if ($(config_xml).find("items").attr("visibles") == "si") {
			$(config_xml).find("item").each(function() {
				var idw = $(this).attr("idw");
				var id = $(this).attr("id");
				var idi = $(this).attr("idi");
				var items_class = $(this).attr("fondo") + "_background";
				items[idw] = id;
				results[id] = idi;
				$("#overall").append('<div id = "item_' + idw + '" class="item_textolibre ' + items_class + '" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + ($(this).attr("width")) + 'px; height: ' + $(this).attr("height") + 'px; " posicion="-1" x="' + (Math.round($(this).attr("x")) - $(this).attr("width")) + '" y="' + (Math.round($(this).attr("y"))) + '" rel="' + idw + '">' + $(this).text().replace('<p>', '').replace('</p>', '') + '</div>');
				if($(this).text().indexOf('img')!=-1){
					$("#item_" + idw).children().width($(this).attr('width')).height($(this).attr('height'));
				}
			});
		};
		if ($(config_xml).find("palabrasfalsas").attr("visibles") == "si") {
			$(config_xml).find("palabrafalsa").each(function() {
				var idw = $(this).attr("idw");
				var id = $(this).attr("id");
				var idi = $(this).attr("idi");
				var items_class = $(this).attr("fondo") + "_background";
				$("#overall").append('<div id = "item_' + idw + '" class="item_textolibre ' + items_class + '" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px; height: ' + $(this).attr("height") + 'px;" posicion="-1" x="' + (Math.round($(this).attr("x")) - $(this).attr("width")) + '" y="' + (Math.round($(this).attr("y"))) + '" rel="' + idw + '">' + $(this).text().replace('<p>', '').replace('</p>', '') + '</div>');
				if($(this).text().indexOf('img')!=-1){
					$("#item_" + idw).children().width($(this).attr('width')).height($(this).attr('height'));
				}
			});
		};
		$("#bottombar").css("z-index",2);

	};

	if (tipo_actividad == 'arrastrarsoltarhotspot') {
		ims.interfaz.bind("comprobar", 'comprobarArrastrarSoltar()');
		ims.interfaz.enable("comprobar");
		$(config_xml).find("hot").each(function() {
			var id = $(this).attr("id");
			var idw = $(this).attr("idw");
			$("#overall").append('<div id = "hot_' + idw + '" class="hotspot_arrastrar ' + hots_class + '" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px; height: ' + $(this).attr("height") + 'px;" rel="hot_' + idw+'"></div>');
			$("#hot_" + idw).get(0).idis = $(this).attr("idi");
		});
		$(config_xml).find("item").each(function() {
			var itemContent = $(this).text();
			var idw = $(this).attr("idw");
			var id = $(this).attr("id");
			var idi = $(this).attr("idi");
			var fondo = $(this).attr("fondo");
			if (items_class == " no_background ") {
				items_class = "display:none;";
			};
			if (fondo == "si") {
				var classFondo = "fondo_arrastrar";
			} else {
				var classFondo = "";
			};
			if(itemContent.indexOf("img")!=-1){
				$("#overall").append(
					$(itemContent).attr("id","item_" + idw)
								  .addClass('item_arrastrar ' + classFondo)
								  .css({
								  	"position": "absolute",
								  	"top": Math.round($(this).attr("y")) + 'px',
								  	"left": Math.round($(this).attr("x")) + 'px',
								  	"height": $(this).attr("height") + 'px',
								  	"width": $(this).attr("width") + 'px',
								  	"-webkit-border-radius":"0px",
								  	"-ms-border-radius":"0px",
								  	"-moz-border-radius":"0px",
								  	"-o-border-radius":"0px",
								  	"border-radius":"0px"
								  }).attr({
								  	"posicion":"-1",
								  	"x": Math.round($(this).attr("x")),
								  	"y":Math.round($(this).attr("y")),
								  	"rel": 0,
								  	"clicked":false
								  })
				);
				if($(this).text().indexOf('img')!=-1){
					$("#item_" + idw).children().width($(this).attr('width')).height($(this).attr('height'));
				}
			}else{
				$("#overall").append('<div id = "item_' + idw + '" clicked="false" class="item_arrastrar ' + classFondo + '" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px;' + items_class + ' left: ' + Math.round($(this).attr("x")) + 'px;height:' + ($(this).attr("height")) + 'px;; width: ' + ($(this).attr("width")) + 'px; " posicion="-1" x="' + (Math.round($(this).attr("x"))) + '" y="' + (Math.round($(this).attr("y"))) + '" rel="' + 0 + '">' + itemContent + '</div>');
			}
			$("#item_" + idw).get(0).idis = idi;
		});
		if ($(config_xml).find("palabrasfalsas").attr("visibles") == "si")
			$(config_xml).find("palabrafalsa").each(function() {
				var idw = $(this).attr("idw");
				var id = $(this).attr("id");
				var idi = $(this).attr("idi");
				var fondo = $(this).attr("fondo");
				if (fondo == "si") {
					var classFondo = "fondo_arrastrar";
				} else {
					var classFondo = "";
				};
				$("#hot_"+idw).remove();
				$("#overall").append('<div id = "item_' + idw + '" class="item_arrastrar falsa' + items_class + " " + classFondo + '" style="position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px; height: ' + $(this).attr("height") + 'px;" posicion="-1" x="' + (Math.round($(this).attr("x"))) + '" y="' + (Math.round($(this).attr("y"))) + '" rel="0">' + $(this).text().replace('<p>', '').replace('</p>', '') + '</div>');
				if($(this).text().indexOf('img')!=-1){
					$("#item_" + idw).children().width($(this).attr('width')).height($(this).attr('height'));
				}
			});
		ims.interfaz.resize();
	};

	if (tipo_actividad == 'flechashotspot') {
		posicionFlechas = $(config_xml).find("posicion_flechas").text();
		if(typeof(editable)=="undefined"){
			objeto = new drawing;
			objeto.init();
			$("canvas").appendTo("#visor");
		}
		var iniTop = 0, finTop = 0, iniLeft = 0, finLeft = 0;
		ims.interfaz.bind("comprobar", 'comprobarFlechas()');
		ims.interfaz.enable("comprobar");

		if (ie == true)
			$("body").append(Images);
		
			$(config_xml).find("hot").each(function(c) {
				var x = parseInt($(this).attr("x")),
					y = parseInt($(this).attr("y")),
					rotacion = 0,
					alto = parseInt($(this).attr("height")),
					ancho = parseInt($(this).attr("width")),
					idw = $(this).attr("idw"),
					id = $(this).attr("id"),
					color = "";
					if ($(config_xml).find("hots").attr("visibles") == "si")
						color = "#0aa";
					var target = $("<div/>").attr({
						"id":"target_" + idw,
						"x":x-13 ,
						"y":y,
						"class":"targets"
					}).css({
						"position":"absolute",
						"top":y,
						"background-color":color,
						"left":x-13,
						width:ancho,
						height:alto
					});
					target.get(0).idis = $(this).attr("idi");
					$("#overall").append(target);
			});
		
		if ($(config_xml).find("palabrasfalsas").attr("visibles") == "si") 
			$(config_xml).find("palabrafalsa").each(function() {
				var fondo = $(this).attr("fondo");
				var classFondo = fondo + "_background";
				var id = $(this).attr("id"),
					color = "";
				$("#overall").append('<div id = "word_' + id + '" class="word ' + classFondo + '" style="z-index:1; position: absolute; top: ' + Math.round($(this).attr("y")) + 'px; left: ' + Math.round($(this).attr("x")) + 'px; width: ' + $(this).attr("width") + 'px; height: ' + $(this).attr("height") + 'px;" rel="-1">' + $(this).text().replace('<p>', '').replace('</p>', '') + '</div>')
			});
		var imageItem = url_interfaz + "css/images/tablet/flecha_azul.png";
		
			$(config_xml).find("item").each(function() {
				var id = $(this).attr("id");
				var idw = $(this).attr("idw");
				var idi = $(this).attr("idi");
				var fondo = $(this).attr("fondo");
				var classFondo = fondo + "_background";
				var x = parseInt($(this).attr("x")),
					y = parseInt($(this).attr("y")),
					height = parseInt($(this).attr("height")),
					ancho = parseInt($(this).attr("width")),
					idw = $(this).attr("idw"),
					color = "",
					itemText = $(this).text();
					if ($(config_xml).find("items").attr("visibles") == "no")
						itemText = "";
				//DERECHA
				if(posicionFlechas=="derecha"){
					var iniX = x + ancho+10,
						iniY = y + (height / 2) - 2,
						finX = x + ancho + 30,
						finY = y + (height / 2) - 2;
				}
	
				//IZQUIERDA
				if(posicionFlechas=="izquierda"){
					var iniX = x ,
						iniY = y + (height / 2) - 2,
						finX = x - 30,
						finY = y + (height / 2) - 2;
				}
	
				//ABAJO
				if(posicionFlechas=="abajo"){
					var iniX = x +(ancho / 2),
						iniY = y + height,
						finX = x + (ancho / 2),
						finY = y + height + 30;
				}
	
				//ARRIBA
				if(posicionFlechas=="arriba"){
					var iniX = x +(ancho / 2),
						iniY = y,
						finX = x + (ancho / 2),
						finY = y - 30;
				}
				if(itemText.indexOf("img")!=-1)
					itemText = itemText.replace(/width=\".*?\"/g,"width=\""+ancho+"\"").replace(/height=\".*?\"/g,"height=\""+height+"\"");
				$("#overall").append('<div id = "' + id + '" class="flecha ' + classFondo + '" style="z-index:1;position: absolute; top: ' + y + 'px; left: ' + x + 'px; width: ' + ancho + 'px; height: ' + height + 'px;"  posicion="-1"  rel="' + idw + '">' + itemText + '</div>');
				if($(this).text().indexOf('img')!=-1){
					$("#" + id).children().width($(this).attr('width')).height($(this).attr('height'));
				}
				var imgAzulSrc = url_interfaz + "css/images/tablet/flecha_azul.png";
				if(typeof editable=="undefined")
					var linea = objeto.drawLine(iniX,iniY,finX,finY, idi, "#48a9da", "5px", imgAzulSrc,id,false);
				var imagen = $("<img/>").attr({
					"src":imgAzulSrc,
					"id":"row_" + id,
					"class":"rows",
					"x":finX-18,
					"y":finY-18,
					"class":"rows",
					"clicked":"false"
				}).css({
					"position":"absolute",
					"top":finY-18,
					"left":finX-18,
					"z-index":2
				});
				imagen.get(0).myData = idi;
				imagen.get(0).myLine = linea;
				$("#overall").append(imagen);
				if(typeof editable == "undefined")
					rotation(imagen)
			});

		ims.interfaz.resize();
		//loadLineRow();
		//resizeFlecha();
		color = "#FBC73B";

		$(".paint").attr("width", $("#overall").width()).attr("height", $("#overall").height());
		$("#overall,#bottombar").css("z-index",2)
	};
	if(typeof editable == "undefined")
		bindClick(tipo_actividad);
	posicionar();

};

function bindClick(tipo) {

	if (tipo == "arrastrarsoltarhotspot")
		if (isMobile) {
			$(".item_arrastrar").click(function() {
				$(".aspa").remove();
				if(dragging==false){
					draggingObj = $(this);
					if($(this).attr("clicked")=="false"){
						dragging = true;
						$(".item_arrastrar").removeClass(skin + "_selection");
						$(this).addClass(skin + "_selection");
					}else{

						var aspa = $("<div/>").css({
							"top":parseInt($(this).offset().top)-$("#header").outerHeight(true),
							"left":parseInt($(this).offset().left)-parseInt($("#visor").offset().left)+$(this).width(),

						}).append("X").addClass("aspa");
						aspa.get(0).object = draggingObj;
						aspa.bind("click",function(event){
							//draggingObj = $(this).get(0).object;
							if(draggingObj.attr("clicked")=="true"){
								$("#overall").append(draggingObj);
								draggingObj.css({
									top:parseInt(draggingObj.attr("y")),
									left:parseInt(draggingObj.attr("x")),
									"position":"absolute"
								}).attr("clicked","false")
									.attr("posicion", "-1").attr("rel",0);

								draggingObj = null;
								dragging = false;
								$(this).remove();
							}
						});
						$("#visor").append(aspa);
					}
				}
			});

			$(".hotspot_arrastrar").click(function() {
				if(draggingObj!=null && dragging == true){
					if (draggingObj.attr("posicion") != 0) {

						$(".item_arrastrar").removeClass(skin + "_selection");
						draggingObj.attr("rel", $(this).attr("rel"));
						draggingObj.css({
							left : 0,
							top : 0,
							"position":"relative"
						}).attr("posicion", "0");
						$(this).append(draggingObj);

						draggingObj.attr("clicked","true");
						draggingObj =null;
						dragging = false;
					};
				}
			});
		} else {
			$(".item_arrastrar").live("mousedown", function(e) {
				if ( typeof (editable) == "undefined") {
					e.preventDefault();
					item_width = $(this).width();
					item_height = $(this).height();
					if(isMoz == true){
					var z = ims.interfaz.zoomRatio;

				}else{
				var z = ims.interfaz.zoomRatio;

				}
				if(z=='none' || typeof(z)=='undefined')
					z=1;

					posobjx = e.pageX-(($(this).offset().left)*z);
					posobjy = e.pageY - ($(this).offset().top*z);
					posobjx = posobjx/z;
					posobjy = posobjy/z;
					if (checked == 0) {
						draggingObj = $(this);
						draggingObj.attr("rel","0");
						dragging = true;
					};
				};
			});
			$(document).live("mousemove", function(e) {
				if(isMoz == true){
					var z = ims.interfaz.zoomRatio;

				}else{
				var z = ims.interfaz.zoomRatio;

				}
				if(z=='none' || typeof(z)=='undefined')
					z=1;
				var leftOriginalZoom = e.pageX-(($("#visor").offset().left)*z);
				var leftO = (leftOriginalZoom/z);
				var topOriginalZoom = e.pageY-(($("#visor").offset().top)*z);
				var topO = (topOriginalZoom/z);
				if ($("#comprobar").hasClass("notdisabled"))
					move(draggingObj, leftO- posobjx, topO- posobjy);
			});
			$(document).live("mouseup", function(e) {
				if (dragging && $("#comprobar").hasClass("notdisabled")) {
					suelta();
				};
			});
		}
	;

	if (tipo == "flechashotspot"){
		

	if(isMobile){
		$(".rows").live("click",function(event){
			$(".aspa").remove();
			if(dragging==false){
				draggingObj = $(this);
				if($(this).attr("clicked")=="false"){
					dragging = true;
					var	 imgRemAzulSrc = url_interfaz + "css/images/tablet/flecha_remarcada_azul.png";
					draggingObj.attr("src",imgRemAzulSrc);

				}else{

					var aspa = $("<div/>").css({
						"top":parseInt($(this).position().top),
						"left":parseInt($(this).position().left)+$(this).width(),

					}).append("X").addClass("aspa");
					aspa.get(0).object = draggingObj;
					aspa.bind("click",function(event){
						draggingObj = $(this).get(0).object;
						if(draggingObj.attr("clicked")=="true"){

							draggingObj.css({
								top:parseInt(draggingObj.attr("y")),
								left:parseInt(draggingObj.attr("x"))
							});
							var imgAzulSrc = url_interfaz + "css/images/tablet/flecha_azul.png";

							draggingObj.attr("src",imgAzulSrc)
								.attr("clicked","false");
							draggingObj.get(0).myLine.end.x = parseInt(draggingObj.attr("x"))+18;
							draggingObj.get(0).myLine.end.y = parseInt(draggingObj.attr("y"))+18;
							draggingObj.get(0).compareData = 0;
							var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
					canvas.redraw();
rotation(draggingObj);
							draggingObj = null;
							dragging = false;
							$(this).remove();
						}
					});
					$("#visor").append(aspa);
				}
			}else{
				if(draggingObj!=null && dragging == true && $(this).attr("clicked")=="true"){
					var _this = $(this);
					draggingObj.css({
						top:_this.position().top+4,
						left:_this.position().left+4
					});
					draggingObj.get(0).myLine.end.x = _this.position().left;
					draggingObj.get(0).myLine.end.y = _this.position().top;
					draggingObj.get(0).compareData = $(this).get(0).compareData;
					var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
					canvas.redraw();
					var imgAzulSrc = url_interfaz + "css/images/tablet/flecha_azul.png";

					draggingObj.attr("src",imgAzulSrc)
						.attr("clicked","true");
					rotation(draggingObj);
					draggingObj =null;
					dragging = false;
				}
			}
		});
		
		$(".targets").live("touchstart",function(event){
			if(draggingObj!=null && dragging == true){
				var _this = $(this);
				draggingObj.css({
					top:_this.position().top,
					left:_this.position().left
				});
				draggingObj.get(0).myLine.end.x = _this.position().left+18;
				draggingObj.get(0).myLine.end.y = _this.position().top+18;
				draggingObj.get(0).compareData = $(this).attr("id").replace("target_","");
				var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
				canvas.redraw();
				var imgAzulSrc = url_interfaz + "css/images/tablet/flecha_azul.png";

				draggingObj.attr("src",imgAzulSrc)
					.attr("clicked","true");
				rotation(draggingObj);
				draggingObj =null;
				dragging = false;
			}
		});
	}else{

		$(".rows").live("mousedown",function(event){
			event.preventDefault();
			dragging = true;
			draggingObj = $(this);

			if(isMoz == true){
					var z = ims.interfaz.zoomRatio;

				}else{
				var z = ims.interfaz.zoomRatio;

				}
				if(z=='none' || typeof(z)=='undefined')
					z=1;

			xMouse = event.pageX-((draggingObj.offset().left)*z);
			yMouse = event.pageY - (draggingObj.offset().top*z);
			xMouse = xMouse/z;
			yMouse = yMouse/z;
		});

		$(document).bind("mousemove",function(event){
			if(dragging == true){
				var jsTop = 0;
				if(parseInt($(".jspPane").css("top")))
					jsTop = parseInt($(".jspPane").css("top"));
				/*var myX = event.pageX-xMouse-$("#limit").position().left,
					myY = event.pageY-yMouse-$("#limit").position().top-jsTop;*/

				if(isMoz == true){
					var z = ims.interfaz.zoomRatio;

				}else{
				var z = ims.interfaz.zoomRatio;

				}
				if(z=='none' || typeof(z)=='undefined')
					z=1;
				var leftOriginalZoom = event.pageX-(($("#visor").offset().left)*z);
				var leftO = (leftOriginalZoom/z);
				var topOriginalZoom = event.pageY-(($("#visor").offset().top)*z);
				var topO = (topOriginalZoom/z);

				moveFL(draggingObj,leftO-xMouse,topO-yMouse);
			}
		});
		$(document).bind("mouseup",function(){
			if(draggingObj!=null)
				sueltaFL();
			dragging = false,draggingObj = null;
		});
	}
	}
		
	


	var tA = 0;

	$("#ayuda").click(function() {
		if (tA == 0) {
	$("#content_ayuda").width($("#content_ayuda").width());

			$('#content_ayuda').jScrollPane({
				showArrows : false,
				hideFocus : true
			});
			tA++
		};
	});
}

function loadContent() {

	$("#overall").prependTo("#content");

	var titulo = $(config_xml).find("pregunta").find("titulo").text();
	var enunciado = $(config_xml).find("enunciado").text().replace("<p>", "").replace("</p>", "");

	ims.interfaz.setTitle(titulo);

	$("#pregunta").append(enunciado);

	if ($(config_xml).find("pregunta").find("foto").length != 0) {
		var foto_object = $(config_xml).find("pregunta").find("foto");
		var foto = foto_object.text();
		var rotation = foto_object.attr("rotation");
		var width = foto_object.attr("width");
		var height = foto_object.attr("height");
		var x = foto_object.attr("x");

		var y = parseInt(foto_object.attr("y"));
		if (foto != '') {

			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
				var ieversion = new Number(RegExp.$1);

				if (ieversion >= 8) {
					if (url_files != "") {
						foto = url_files + foto;
					} else {
						foto = "fotos/" + foto;
					};
					$("#fondo").append("<div><img style=\"position:absolute;margin-left:" + x + "px;margin-top: " + y + "px;width:" + width + "px; height:" + height + "px; \" src=\"" + foto + "\"/></div>");
					if (x == "" && y == "") {

						height = parseInt($('#fondo div img').height());
						width = parseInt($('#fondo div img').width());

						if (width < $("#fondo").width() || height < $("#fondo").height()) {
							x = $("#fondo").position().left + $("#fondo").width() - width;
							y = $("#fondo").position().top + $("#fondo").height() - height;
							$('#fondo div img').css({
								"margin-left" : x + "px ",
								"margin-top" : +y + "px"
							});
						};

					};
				};
			} else {
				if (url_files != "") {
					$('#fondo').css("background-image", "url(" + url_files + foto + ")");
				} else {
					$('#fondo').css("background-image", "url(fotos/" + foto + ")");
				};
				$('#fondo').css("background-repeat", "no-repeat");
				if (rotation != '') {
					$('#fondo').css("rotation", rotation);
					if (x != '' || y != '') {
						$('#fondo').css("background-position", x + "px " + y + "px");

						if (width != '' && height != '') {
							$('#fondo').css("background-size", width + "px " + height + "px");
						} else {
							if (height != '') {
								$('#fondo').css("background-size", "auto " + height + "px");
							} else {
								if (width != '') {
									$('#fondo').css("background-size", width + "px auto");
								};
							};
						};

					};
				};
			};

			url = $('#fondo').css('background-image').replace('url(', '').replace(')', '').replace("'", '').replace('"', '');
			bgImg = $('<img />');
			bgImg.hide();

			if (x == "" && y == "") {

				bgImg.bind('load', function() {
					height = parseInt($(this).height());
					width = parseInt($(this).width());

					if (width < $("#fondo").width() || height < $("#fondo").height()) {
						x = $("#fondo").position().left + $("#fondo").width() - width;
						y = $("#fondo").position().top + $("#fondo").height() - height;
						$('#fondo').css("background-position", x + "px " + y + "px");
					};

					bgImg.remove();
				});
			};
			$('#fondo').append(bgImg);
			bgImg.attr('src', url);

		};
	};

	var silenciar = $(config_xml).find("silenciar").text();
	var ayuda = $(config_xml).find("palabras").find("ayuda").text();
	var comprobar = $(config_xml).find("comprobar").text();
	var clave = $(config_xml).find("desarrollosolucion").text();
	var imprimir = $(config_xml).find("imprimir").text();
	var versolucion = $(config_xml).find("versolucion").text();
	var reiniciar = $(config_xml).find("reiniciar").text();

	var volver = $(config_xml).find("volver").text();

	ims.interfaz.addButton("Anterior", "left", "anterior", volver);
	if(!isMobile)
		ims.interfaz.addButton("silenciar", "left", "silenciar", silenciar);

	ims.interfaz.addButton("reiniciar", "right", "reiniciar", reiniciar);
	ims.interfaz.addButton("clave", "right", "clave", clave);
	ims.interfaz.addButton("versolucion", "right", "versolucion", versolucion);
	ims.interfaz.addButton("comprobar", "right", "comprobar", comprobar);
	ims.interfaz.addButton("ayuda", "right", "ayuda", ayuda);

	if ($(config_xml).find("introduccion").find("texto1").text().length != 0) {
		ims.interfaz.enable("Anterior");
		ims.interfaz.bind("Anterior", 'prevPage()');
	};
		ims.interfaz.enable("silenciar");
	
	if (ims.interfaz.sound) {
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
ims.interfaz.resize();
	};

	ims.interfaz.bind("reiniciar", 'reload()');
	ims.interfaz.bind("comprobar", 'comprobar()');
	ims.interfaz.enable("reiniciar");
	ims.interfaz.enable("comprobar");
	ims.interfaz.enable("imprimir");

}

function comprobarTextoLibre() {
	$("input").attr('disabled','disabled');
	if ($("#comprobar").hasClass("notdisabled")) {
		if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
			ims.interfaz.enable("clave");
			ims.interfaz.addPopup("solucion", "clave");
			var tS = 0;
			$("#clave").click(function() {
				if (tS == 0) {
					$('#content_solucion').jScrollPane({
						showArrows : false,
						hideFocus : true
					});
					tS++;
					ims.interfaz.resize();

				};
				$('#content_solucion #contenidoPOP').width($('#content_solucion').width()-50);
				ims.interfaz.resize();
			});

			$(config_xml).find("solucion").each(function() {
				var solucionTit = $(this).find("titulo").text();
				var solucionTex = $(this).find("texto1").text();
				$('#pop_solucion').prepend("<span class='pop_up_title'>" + solucionTit + "</span>");
				$('#content_solucion').append('<div id="contenidoPOP">'+solucionTex+'</div>');
			});
		};
		ims.interfaz.bind("versolucion", "solucion()");
		ims.interfaz.enable("versolucion");
		var resultado = "";
		var aciertos = 0;
		var total = $(config_xml).find("item").length;
		var count = total;
		$("#overall").css("z-index", "1");
		$(config_xml).find("item").each(function() {
			var idw = $(this).attr("idw");

			//Fix para no ver el código html en el input
			//Daniel 20/03/14 d.C
			var div = $('<div/>');
			div.html($(this).text());
		    div.contents().filter(function(){
		        return this.nodeType !== 3;
		    }).after(function(){
		        return $(this).text();
		    }).remove();

			if ($("#input_" + idw).val().replace("&nbsp;", " ") == div.html()) {
				var color = "#39B54A";

				if ($("#input_" + idw).hasClass("no_background")) {
					$("#input_" + idw).css({
						"color" : color,
						"font-size" : "16px"
					});
				} else {
					$("#input_" + idw).css({
						"background-color" : color,
						"color" : "#FFFFFF",
						"font-size" : "16px"
					});
				};
				aciertos++;
				ims.interfaz.showStars($("#input_" + idw));
			} else {
				if ($("#input_" + idw).hasClass("no_background")) {
					$("#input_" + idw).css({
						"color" : "red",
						"font-size" : "16px"
					});
				} else {
					$("#input_" + idw).css({
						"background-color" : "red",
						"color" : "white",
						"font-size" : "16px"
					});
				};
			};

			if (!--count) {
				resultado = "<p> " + aciertos + " / " + total + " </p>";
				if (aciertos != total) {
					ims.interfaz.playSound('rBad');
				} else {
					ims.interfaz.playSound('rGood');
				};
			};
		});
		ims.interfaz.showResults(resultado, "70");
		ims.interfaz.disable("comprobar");
	};
};
function comprobarArrastrarSoltar() {
	if ($("#comprobar").hasClass("notdisabled")) {
		ims.interfaz.disable("comprobar");
		if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
			ims.interfaz.enable("clave");
			ims.interfaz.addPopup("solucion", "clave");
			var tS = 0;
			$("#clave").click(function() {
				if (tS == 0) {
			$("#content_solucion").width($("#content_solucion").width());

					$('#content_solucion').jScrollPane({
						showArrows : false,
						hideFocus : true
					});
					tS++;
					ims.interfaz.resize();

				};
				ims.interfaz.resize();
			});
			$(config_xml).find("solucion").each(function() {
				var solucionTit = $(this).find("titulo").text();
				var solucionTex = $(this).find("texto1").text();
				$('#pop_solucion').prepend("<span class='pop_up_title'>" + solucionTit + "</span>");
				$('#content_solucion').append(solucionTex);
			});
		};
		$("#overall").css("z-index", "1");
		ims.interfaz.bind("versolucion", "solucionArrastrarSoltar()");
		ims.interfaz.enable("versolucion");
		var total = $("#overall").find(".item_arrastrar").not(".falsa").length;
		var correct = 0;
		var resultado = "";

		$("#overall").find(".item_arrastrar").each(function() {
			var _this = $(this);
			var _item = _this.get(0);
			var id_rel = _this.attr("rel").replace("hot_","");
			if(_this.hasClass("fondo_arrastrar")){
						_this.css({
							"background-color":"red",
							"color":"#FFFFFF"
						}).addClass('error');
					}else{
						_this.css({
							"color":"red"
						}).addClass('error');
					}
			if(_this.attr("rel")!=0)

			if(typeof _item.idis !="undefined" && _item.idis!=""){
				if(_item.idis.indexOf(id_rel)!=-1){
					correct++;
					if(_this.hasClass("fondo_arrastrar")){
						_this.css({
							"background-color":"#39B54A",
							"color":"#FFFFFF"
						});
					}else{
						_this.css({
							"color":"#39B54A"
						});
					}
					ims.interfaz.showStars(_this);
				}else{
					if(_this.hasClass("fondo_arrastrar")){
						_this.css({
							"background-color":"red",
							"color":"#FFFFFF"
						}).addClass('error');
					}else{
						_this.css({
							"color":"red"
						}).addClass('error');
					}
				}
			}else{
				if(_this.hasClass("falsa")&&_this.attr("rel")==0){
					if(_this.hasClass("fondo_arrastrar")){
						_this.css({
							"background-color":"#39B54A",
							"color":"#FFFFFF"
						});
					}else{
						_this.css({
							"color":"#39B54A"
						});
					}
					ims.interfaz.showStars(_this);
					
				}
			}
				
		});
		resultado = "<p>" + correct + " / " + total + "</p>";
		if(correct==total){
			var sound = "rGood";
		}else{
			var sound = "rBad";
		}
			ims.interfaz.playSound(sound);
		ims.interfaz.showResults(resultado, "70");
		ims.interfaz.disable("comprobar");
	};
};
function solucion() {
	var total = $(config_xml).find("item").length;
	var count = total;
	$(".red").removeClass("red");
	$("#center").hide();
	$("#center").empty();
	$(".stars").remove();
	$(config_xml).find("item").each(function() {
		var idw = $(this).attr("idw");
		$("#input_" + idw).val($(this).text().replace("&nbsp;", " "));

		//Fix para no ver el código html en el input
		//Daniel 18/03/14 d.C
		var div = $('<div/>');
		div.html($("#input_" + idw).val());
	    div.contents().filter(function(){
	        return this.nodeType !== 3;
	    }).after(function(){
	        return $(this).text();
	    }).remove();
	    $("#input_" + idw).val(div.html());

		var color = "#39B54A";
		if ($("#input_" + idw).hasClass("no_background")) {
			$("#input_" + idw).css({
				"color" : color,
				"font-size" : "16px"
			});
		} else {
			$("#input_" + idw).css({
				"background-color" : color,
				"color" : "#FFFFFF",
				"font-size" : "16px"
			});
		}
		ims.interfaz.showStars($("#input_" + idw));
		if (!--count) {
			ims.interfaz.playSound('good');
		}
	});
	ims.interfaz.disable("versolucion");
};
function solucionArrastrarSoltar() {
	var total = $(config_xml).find("item").length;
	var count = total;
	$("#center").hide();
	$("#center").empty();
	$(".stars").remove();
	$(".red").removeClass("red");
	$(".error").each(function(){
		var _x = $(this).attr('x');
		var _y = $(this).attr('y');
		$(this).css({
			top:_y+'px',
			left:_x+'px'
		});
	});
	$(".hotspot_arrastrar").each(function(c){
		$($(this)).attr("id","hot_"+c);
	});
	$("#overall").find(".hotspot_arrastrar").each(function() {
		var _this = $(this);
		var _item = _this.get(0);
		var idis = new Array();

		if(_item.idis.indexOf(",")!=-1){
			idis = _item.idis.split(",");
		}else{
			idis.push(_item.idis);
		}
		hotCompletado = false;//fix para cuando varios hotspot aceptan varios items indiferentemente
		$.each(idis,function(index,obj){
			if(hotCompletado==false){
				var myItem = $("#item_"+obj).css({
					top:0,
					left:0
				});
				if(myItem.hasClass("fondo_arrastrar")){
					myItem.css({
						"background-color":"#39B54A",
						"color":"#FFFFFF"
					});
				}else{
					myItem.css({
						"color":"#39B54A"
					});
				}
				myItem.attr("posicion","0").css("position","relative");
				//fix para cuando varios hotspot aceptan varios items indiferentemente
                if(!myItem.hasClass('resuelto')){
                    _this.append(myItem);//_this = div#hot_2.hotspot_arrastrar.no_background   myItem = #item_199537                    
                    myItem.addClass('resuelto');
                    //hotCompletado = true;
                }
            }
		});
	});

	//Ponemos los incorrectos en su sitio (DRR 12/05/14 d.C)
	 $(".item_arrastrar").each(function () {
	 	if (!$(this).hasClass('resuelto')){
			$(this).css({'top':$(this).attr('y')+'px','left':$(this).attr('x')+'px'});
		}
	});

	$(".falsa").each(function(){
		var obj = $(this);
		obj.animate({
			left : ((parseInt(obj.attr("x"))) + "px"),
			top : (obj.attr("y") + "px")
		}, {
			duration : 200,
			easing : "linear"
		});
		if(obj.hasClass("fondo_arrastrar")){
					obj.css({
						"background-color":"#39B54A",
						"color":"#FFFFFF"
					});
				}else{
					obj.css({
						"color":"#39B54A"
					});
				}
	});
	ims.interfaz.playSound('good');
	$(".hotspot_arrastrar").each(function() {
		ims.interfaz.showStars($(this));
	});
	ims.interfaz.disable("versolucion");
};
function imprimir() {
	document.location.href = $(config_xml).find("urlimprimir").text();
};
function prevPage() {
	$(".stars").remove();
	$(".tooltip").remove("");
	$("#limit").remove("");
	ims.interfaz.init();
	var overall = "<div id='overall'>" + $("#overall").html() + "</div>";
	$("#overall").remove();
	$("#content").prepend(overall);
	$("#right,#left").css("z-index", "1");
	$("#overall,#fondo").css({
		"z-index" : "1",
		width : $("#visor").width(),
		height : $("#visor").height(),
		"margin-top" : $("#visor").position().top
	});
	$("#overall").hide();

	inicializar();
};
function nextPage() {
	$("#overall").show();
	$(".tooltip").remove("");
	$("#limit").remove("");
	ims.interfaz.init();

	var overall = "<div id='overall'>" + $("#overall").html() + "</div>";
	$("#overall").remove();
	$("#content").prepend(overall);
	$("#right,#left").css("z-index", "1");
	$("#overall,#fondo").css({
		"z-index" : "1",
		width : $("#visor").width(),
		height : $("#visor").height(),
		"margin-top" : $("#visor").position().top
	});
	cargar_actividad();
};
function reload() {
	fill = "";
	$("#limit").remove();
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
function ajustar() {
	var leftDyn = (($(window).width() - $("#limit").width()) / 2) - 70;
	var topDyn = (($(window).height()) / 2) - 70;
	var topStac = $("#limit").height() - $("#right").height() - 40;
	if ((leftDyn <= 0) && ((topDyn <= 0))) {
		x = leftStac;
		y = topStac;
	} else {
		if ((leftDyn <= 0) && (topDyn > 0)) {
			x = leftStac;
			y = topDyn;
		} else {
			if ((topDyn <= 0) && (leftDyn > 0)) {
				x = leftDyn;
				y = topStac;
			} else {
				x = leftDyn;
				y = topDyn;
			};
		};
	};
	$(".item_arrastrar").each(function() {
		$(this).css("left", (x + $(this).width() - 10) + "px");
		$(this).css("top", (y + (topStac / 2)) + "px");
		$(this).attr("x", (x));
		$(this).attr("y", (y + (topStac / 2)));
		x = x + $(this).width() + 10;
	});
};
function suelta() {
	var obj = draggingObj;
	var counter = 0;
	var topStac = ($("#limit").height() - $("#right").height() - 40) / 2;
	$(".hotspot_arrastrar").each(function() {
		if (intersects(obj, $(this)) && (obj.attr("rel") == "0")) {
			resetele(obj);
			var objoff = $(this).position(),
				topOff = (objoff.top - $('#overall').position().top),
				leftOff = (objoff.left - $('#overall').position().left);
			$(".item_arrastrar[rel='"+ $(this).attr("id")+"']").each(function(){
				topOff+=$(this).height();
			});
			if (magnetismo == true) {
				obj.css({
					left :  (leftOff+ "px"),
					top : (topOff + "px")
				});
			};

			

			counter++;
			obj.attr("rel", $(this).attr("id"));
			//$(this).attr("rel", obj.attr("rel"));
			return false;
		};
	});
	if (counter == 0) {
		obj.animate({
			left : ((parseInt(obj.attr("x"))) + "px"),
			top : (obj.attr("y") + "px")
		}, {
			duration : 200,
			easing : "linear"
		}).attr("rel",0);
		resetele(obj);
	};
	dragging = false;
};
function resetele(obj) {
	$("#" + obj.attr("posicion")).attr("rel", "-1");
	obj.attr("posicion", "-1").css( {
		"position":"absolute"
	});
};
//aaaaabajo mal
function move(obj, x, y) {
	if (dragging) {
		obj.css("left", (parseInt(x)) + "px");
		obj.css("top", (parseInt(y)) + "px");
		$(".hotspot_arrastrar").each(function() {
			if (hotspotDefaultBG == "") {
				hotspotDefaultBG = $(this).css("background");
			};
		});
	};
};
function intersects(obj1, obj2) {
	obj1x = parseInt(obj1.css("left"));
	obj1y = parseInt(obj1.css("top"));
	obj2x = parseInt(obj2.css("left"));
	obj2y = parseInt(obj2.css("top"));
	obj1width = obj1.width();
	obj1height = obj1.height();
	obj2width = obj2.width();
	obj2height = obj2.height();
	obj1off = obj1.position();
	obj2off = obj2.position();
	if (obj1off.left + obj1width < obj2off.left) {
		return false;
	};
	if (obj1off.top + obj1height < obj2off.top) {
		return false;
	};
	if (obj1off.left > obj2off.left + obj2width) {
		return false;
	};
	if (obj1off.top > obj2off.top + obj2height) {
		return false;
	};
	return true;
};
$(window).resize(function() {
	resizeFlecha();
});
$(window).scroll(function() {
	resizeFlecha();
});
function resizeFlecha() {
	var posicion_flechas = $(config_xml).find("posicion_flechas").text();
	var rotate = "";
	$(".row").each(function() {
		if ($(this).attr("posicion") == undefined) {
			var rotation = $(this).css("-webkit-transform");

			$(this).css("-webkit-transform", "rotate(0deg)");

			var itemId = $(this).attr("id").split("_");
			var finePos = 0;
			var itemOff = $("#" + itemId[1]).position();
			var itemX = parseInt(itemOff.left) + $("#" + itemId[1]).outerWidth();

			var itemY = itemOff.top + ($("#" + itemId[1]).outerHeight() / 2) - ($(this).outerHeight() / 2);
			var ancho = $("#" + itemId[1]).width();

			if (posicion_flechas == "arriba") {
				rotate = "-90";
				itemX = (itemX - (ancho / 2) - ($(this).outerWidth() / 2));
				itemY = (itemY - $(this).outerHeight());
			};

			if (posicion_flechas == "abajo") {
				rotate = "90";
				itemX = (itemX - (ancho / 2) - ($(this).outerWidth() / 2));
				itemY = (itemY + ($("#" + itemId[1]).outerHeight() - ($(this).outerHeight() / 2)));
			};

			if (posicion_flechas == "izquierda") {
				rotate = "180";
				itemX = itemX - $("#" + itemId[1]).outerWidth() - $(this).outerWidth();
				itemY = (itemY + ($("#row" + $(this).attr("id")).outerHeight()));
			};
			if (posicion_flechas == "derecha") {
				itemX = (itemX);
				itemY = (itemY + ($("#row" + $(this).attr("id")).outerHeight()));
			};

			if (posicion_flechas == "abajo" && (ims.interfaz.skin == "tablet")) {
				itemY = itemY + 8;
			};
			$(this).attr("x", itemX);
			$(this).attr("y", itemY);
			$(this).css({
				"top" : itemY,
				"left" : (itemX),
				"transform" : "rotate(" + rotate + "deg)",
				"-ms-transform" : "rotate(" + rotate + "deg)",
				"-moz-transform" : "rotate(" + rotate + "deg)",
				"-webkit-transform" : "rotate(" + rotate + "deg)",
				"-o-transform" : "rotate(" + rotate + "deg)"
			});
			if ($(this).attr("posicion")) {
				$(this).css("-webkit-transform", rotation);
			};
		} else {
			var posicion = $("#" + $(this).attr("id")).attr("posicion");
			var targetOff = $("#" + posicion).position();
			var id = $(this).attr("id").split("_");
			if (posicion_flechas == "arriba") {
				var targetX = parseInt(targetOff.left) + ($("#" + posicion).outerWidth() / 2) - ($(this).outerWidth() / 2);
				var targetY = targetOff.top + $("#" + posicion).outerHeight();
				var initX = $("#" + id[1]).position().left + ($("#" + id[1]).outerWidth() / 2);
				var initY = $("#" + id[1]).position().top;
			};
			if (posicion_flechas == "abajo") {
				var targetX = parseInt(targetOff.left) + ($("#" + posicion).outerWidth() / 2);
				var targetY = targetOff.top;
				var initX = $("#" + id[1]).position().left + ($("#" + id[1]).outerWidth() / 2) - ($(this).outerWidth() / 2);
				var initY = $("#" + id[1]).position().top + ($("#" + id[1]).outerHeight());
			};
			if (posicion_flechas == "izquierda") {
				var targetX = parseInt(targetOff.left) + $("#" + posicion).outerWidth() - $("#" + $(this).attr("id")).width();
				var targetY = targetOff.top + ($("#" + posicion).outerHeight() / 2);
				var initX = $("#" + id[1]).position().left;
				var initY = $("#" + id[1]).position().top + ($("#" + id[1]).outerHeight() / 2) - ($(this).outerHeight() / 2);
			};
			$(this).css("left", targetX).css("top", targetY);
			draggingObj.attr("x", initX);
			draggingObj.attr("y", initY);
		};
	});
};
function loadLineRow() {
	fill = "";
	$(".flecha").each(function() {
		var x = $(this).position().left;
		var y = $(this).position().top;
		var ancho = $(this).width();
		var idi = $(config_xml).find("item[id=" + $(this).attr("id") + "]").attr("idi");
		var n_idis = idi.split(",").length;
		var c = 1;
		while (c <= n_idis) {
			$("#overall").append("<div id=\"row" + c + "_" + $(this).attr("id") + "\" class=\"row\" ></div>");
			if (ie == true) {
				$("#overall").append("<div class=\"paint\" id=\"linerow" + c + "_" + $(this).attr("id") + "\"  style=\"position: absolute;   top:0; left:0;  \" width=\"" + $(window).width() + "\" height=\"" + ($("#right").position().top) + "\"></div>");
			} else {
				fill += "<canvas class=\"paint\" id=\"linerow" + c + "_" + $(this).attr("id") + "\"  style=\"position: absolute;pointer-events:none; top:0; z-index:1; left:0;  \" width=\"" + $("#overall").width() + "\" height=\"" + $("#overall").innerHeight() + "\" >Su navegador no permite utilizar canvas.</canvas>";
			};
			c++;
		};
	});
	if (ie == false) {
		$("#overall").append(fill);
		fill = "";
	};
};

var rotation = function(e) {
	var _this = e;

	var y1 = _this.get(0).myLine.end.y;
	var y2 = parseInt(_this.get(0).myLine.start.y);
	var x1 = _this.get(0).myLine.end.x;
	var x2 = parseInt(_this.get(0).myLine.start.x);
	
	Y = y1 - y2;
	X = x1 - x2;
	angulo = (Math.atan2(Y, X) * 180 / Math.PI);
	_this.css({
		"transform": "rotate(" + angulo + "deg)",
		"-ms-transform": "rotate(" + angulo + "deg)",
		"-moz-transform": "rotate(" + angulo + "deg)",
		"-webkit-transform": "rotate(" + angulo + "deg)"
	});		
	
};

function sueltaFL() {
	var obj = draggingObj,
		magX = 0,
		magY = 0;
	var counter = 0;
	$(".targets").each(function() {
		var thisW = $(this).outerWidth(true),
			thisH = $(this).outerHeight(true);
		if (intersects(obj, $(this))) {
			objoff = $(this).position(),
			objtop = parseInt(objoff.top)-parseInt($("#limit").position().top),
			objleft = parseInt(objoff.left);

			if(magnetismo==true){
				if(posicionFlechas=="derecha"){
					magX = objleft;
					magY = objtop+(thisH/2)-18;
				}
				if(posicionFlechas=="izquierda"){
					magX = objleft+thisW;
					magY = objtop+(thisH/2)-18;
				}
				if(posicionFlechas=="arriba"){
					magX = objleft+(thisW/2)-18;
					magY = objtop+thisH-18;
				}
				if(posicionFlechas=="abajo"){
					magX = objleft+(thisW/2)-18;
					magY = objtop-18;
				}
				obj.css({
					top:magY,
					left:magX
				});
				var linea = obj.get(0).myLine;

				linea.end.x = magX+18;
				linea.end.y = magY+18;
				var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
				canvas.redraw();
			}
			counter++;
			obj.attr({
				"posicion" : "0"
			}).get(0).compareData = $(this).attr("id").replace("target_","");

			
			rotation(obj);
			return false;
		}
	});
	if (counter == 0 && magnetismo==true)
		reseteleFlecha(obj);
	rotation(obj);	
	dragging = false;
};
function moveFL(obj, x, y) {

	if (dragging){
		obj.css({
			"left" : (parseInt(x)) + "px",
			"top" : (parseInt(y)) + "px"
		});
		
		obj.get(0).myLine.end.x =parseInt(x)+18;
		obj.get(0).myLine.end.y =parseInt(y)+18;
		obj.css({
			"transform": "rotate(0deg)",
			"-ms-transform": "rotate(0deg)",
			"-moz-transform": "rotate(0deg)",
			"-webkit-transform": "rotate(0deg)"
		});		
		rotation(obj);

		canvas.redraw();
	}
};
function comprobarFlechas() {
	if ($("#comprobar").hasClass("notdisabled")) {
		color = "#FF0000";
		if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
			ims.interfaz.enable("clave");
			ims.interfaz.addPopup("solucion", "clave");
			$(config_xml).find("solucion").each(function() {
				var solucionTit = $(this).find("titulo").text().replace("<b>", "").replace("</b>", "");
				var solucionTex = $(this).find("texto1").text();
				$('#pop_solucion').prepend("<span class='pop_up_title'>" + solucionTit + "</span>");
				$('#content_solucion').append(solucionTex);
			});
			var tS = 0;
			$("#clave").click(function() {
				if (tS == 0) {
			$("#content_solucion").width($("#content_solucion").width());

					$('#content_solucion').jScrollPane({
						showArrows : false,
						hideFocus : true
					});
					tS++;
					ims.interfaz.resize();

				};
			});
		};
		var total = $(".row").length;
		var correct = 0;
		var posicion_flechas = $(config_xml).find("posicion_flechas").text();
		$("#comprobar").removeClass("notdisabled");
		$("#versolucion").addClass("notdisabled");
		ims.interfaz.bind("versolucion", "solucionFlechas()");
		var ancho = 30,
			height = 30,
			lineas = new Array();
		$(".rows").die("mousedown");
		for (var n = 0; n <= $(".rows").length - 1; n++) {
			var _this = "";
			_this = $(".rows")[n];	

				if ( typeof (_this.myLine) != "undefined") {
					total++;
					
				}
				var _this_row = _this.myLine;
				$(_this).css({
					"transform": "rotate(0deg)",
					"-ms-transform": "rotate(0deg)",
					"-moz-transform": "rotate(0deg)",
					"-webkit-transform": "rotate(0deg)"
				});		
				if(typeof _this.myData != "undefined")
						if (_this.myData.indexOf( _this.compareData)!=-1) {
						
							correct++;
							/*var image = canvas.display.image({
								x: _this_row.end.x,
								y: _this_row.end.y,
								origin: { x: "center", y: "center" },
								image: url_interfaz + "css/images/tablet/flecha_verde.png"
							});*/

							/*canvas.addChild(image);*/
							var imageItem = url_interfaz + "css/images/tablet/flecha_verde.png";
							$(_this).attr("src", imageItem);
							_this_row.stroke = "5px #39B54A";
							ims.interfaz.showStars($(_this));

						} else {
							
							if ( typeof (_this_row) != "undefined") {
								
								var imageItem = url_interfaz + "css/images/tablet/flecha_roja.png";
								$(_this).attr("src", imageItem);

								_this_row.stroke = "5px #FF0000";canvas.redraw();
							}
						
						}

					rotation($(_this));
		}
		var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
canvas.redraw();

		$.each(lineas,function(){
			this.remove();
		});

		if (correct === total) {
			var sound = "rGood";
		} else {
			var sound = "rBad";
		};
			ims.interfaz.showResults("<p>" + correct + " / " + total + "</p>");
			var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
						canvas.redraw();
		
			ims.interfaz.playSound(sound);
			return false;
	} else {
		alert("La actividad ya ha sido comprobada.");
	};
};
function imgChange(imagePath,myx,myy,rot,obj,disable) {
            var image = canvas.display.image({
				x: myx,
				y: myy,
				rotation:rot,
				origin: { x: "center", y: "center" },
				image: imagePath
			});
			if(!disable){
	            image.lines=obj.lines;
	            image.myData = obj.myData;
	            obj.remove();
	        }
			canvas.addChild(image);
			
}
function reseteleFlecha(obj) {
	
		obj.css({
			"left" : obj.attr("x") + "px",
			"top" : obj.attr("y") + "px"
		}).attr("posicion", "-1").get(0).compareData = 0;
		obj.get(0).myLine.end.x = parseInt(obj.attr("x"))+18;
		obj.get(0).myLine.end.y = parseInt(obj.attr("y"))+18;
		var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
	canvas.redraw();
	$("#hotspot_" + obj.attr("id")).attr("id", "");
	$("#" + obj.attr("posicion")).attr("rel", "-1");
	obj.css({
		"transform": "rotate(0deg)",
		"-ms-transform": "rotate(0deg)",
		"-moz-transform": "rotate(0deg)",
		"-webkit-transform": "rotate(0deg)"
	});	
};
function solucionFlechas() {
	ims.interfaz.disable("versolucion");
	$("#center").hide();
	$(".stars").remove();
	$(".nocheck").removeClass("nocheck");
	var dleft = 0, top = 0;
	var posicion_flechas = $(config_xml).find("posicion_flechas").text();
	for(var n = 0; n<= $(".rows").length-1;n++){
			var _this = $(".rows").get(n);
			var _line = _this.myLine;
			var _data = _this.myData;
			var _id   = $(".rows").eq(n).attr("id").replace("row_","");
			//console.log(_id)

					if (( typeof (_this.myLine) != "undefined")&& _data != "") {
						var imageItem = url_interfaz + "css/images/tablet/flecha_verde.png";
					if(_data.indexOf(",")!=-1){
							_data = _data.split(",");
							$.each(_data,function(index,id){
								_data = id;
								console.log(id)
								if($("#target_"+_data).length!=0){
									$(_this).attr("src", imageItem);
									var this_ = $("#target_"+_data);
									var obj = $(_this),
										magX = 0,
										magY = 0;
									var thisW = $(this_).outerWidth(true),
										thisH = $(this_).outerHeight(true);
										objoff = $(this_).position(),
										objtop = parseInt(objoff.top)-parseInt($("#limit").position().top),
										objleft = parseInt(objoff.left);

											if(posicionFlechas=="derecha"){
												magX = objleft;
												magY = objtop+(thisH/2)-18;
											}
											if(posicionFlechas=="izquierda"){
												magX = objleft+thisW;
												magY = objtop+(thisH/2)-18;
											}
											if(posicionFlechas=="arriba"){
												magX = objleft+(thisW/2)-18;
												magY = objtop+thisH-18;
											}
											if(posicionFlechas=="abajo"){
												magX = objleft+(thisW/2)-18;
												magY = objtop-18;
											}
											obj.css({
												top:magY,
												left:magX
											});

									$(_this).css({
										top:parseInt(magY),
										left:parseInt(magX)
									})
									_this.myLine.end.x = parseInt(magX)+18;
									_this.myLine.end.y = parseInt(magY)+18;

									_this.myLine.stroke = "5px #39B54A";
									ims.interfaz.showStars($(_this));
								}
							});

						//_this.rotation = objeto.getAngle(_this_row.start.x, _this_row.start.y, _this_row.end.x, _this_row.end.y);
						}else{

						    $(_this).attr("src", imageItem);

							var this_ = $("#target_"+_data);
									var obj = $(_this),
										magX = 0,
										magY = 0;
									var thisW = $(this_).outerWidth(true),
										thisH = $(this_).outerHeight(true);
										objoff = $(this_).position(),
										objtop = parseInt(objoff.top)-parseInt($("#limit").position().top),
										objleft = parseInt(objoff.left);

											if(posicionFlechas=="derecha"){
												magX = objleft;
												magY = objtop+(thisH/2)-18;
											}
											if(posicionFlechas=="izquierda"){
												magX = objleft+thisW;
												magY = objtop+(thisH/2)-18;
											}
											if(posicionFlechas=="arriba"){
												magX = objleft+(thisW/2)-18;
												magY = objtop+thisH-18;
											}
											if(posicionFlechas=="abajo"){
												magX = objleft+(thisW/2)-18;
												magY = objtop-18;
											}
											obj.css({
												top:magY,
												left:magX
											});

									$(_this).css({
										top:parseInt(magY),
										left:parseInt(magX)
									})
									_this.myLine.end.x = parseInt(magX)+18;
									_this.myLine.end.y = parseInt(magY)+18;

							_this.myLine.stroke = "5px #39B54A";
							ims.interfaz.showStars($(_this));
						}
						var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
						canvas.redraw();
					}else{
						var _this_row = _this.myLine;
						$(_this).css({
							top:parseInt($(_this).attr("y")),
							left:parseInt($(_this).attr("x"))
						});
						var imageItem = url_interfaz + "css/images/tablet/flecha_verde.png";
					    $(_this).attr("src", imageItem);
						_this_row.end.x = parseInt($(_this).attr("x"))+18;
						_this_row.end.y = parseInt($(_this).attr("y"))+18;
						_this_row.stroke = "5px #39B54A";
						var w = canvas.width;
					var h = canvas.height;   // save old width/height
					canvas.width = canvas.height = 0;  //set width/height to zero
					canvas.width=w;
					canvas.height=h;
						canvas.redraw();
					}
				rotation($(_this));
		};
	var sound = "good";
		ims.interfaz.playSound(sound);
		return false;
};
var rotation = function(e) {
	var _this = e;

	var y1 = _this.get(0).myLine.end.y;
	var y2 = parseInt(_this.get(0).myLine.start.y);
	var x1 = _this.get(0).myLine.end.x;
	var x2 = parseInt(_this.get(0).myLine.start.x);
	
	Y = y1 - y2;
	X = x1 - x2;
	angulo = (Math.atan2(Y, X) * 180 / Math.PI);
	_this.css({
		"transform": "rotate(" + angulo + "deg)",
		"-ms-transform": "rotate(" + angulo + "deg)",
		"-moz-transform": "rotate(" + angulo + "deg)",
		"-webkit-transform": "rotate(" + angulo + "deg)"
	});		
	
};
