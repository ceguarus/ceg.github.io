var isiPad = navigator.userAgent.match(/iPad/i) != null;
var isAndroid = navigator.userAgent.match(/Android/i) != null;
var sonidos = new Array();
var palabrasCorrectas = new Array();
//--------------------
var url_interfaz = "";
var url_files = "";
var palIndice = 0;
var isKaraoke = 1;
var current_time = 0;
var popcorn1 = new Object();
var popcorn2 = new Object();
inicio = 0;
cuesOnStage = 0;
var arr = [];
var checked = 0;
var listenerBarra = 0;
var dragging = false;
var draggingObj = null;
var item_width = '';
var item_height = '';
var numKaraokes = 0;
var listado_on = 0;
var posicionCue = 0;
var alto_text_ = 0;
var alto_text_k = 16;
var readyKaraoke = 0;
var readyCancion = 0;
var timePlaying = 0;
var timeMuted = 0;
var timeCancionMuted = 0;
var timeKaraokeMuted = 0;
var timeListenerBarra = 0;
var timeLine = 0;
$(document).ready(function() {
	
	if($("#url_interfaz").text() != "") {
		url_interfaz = $("#url_interfaz").text();
	}
	$("#url_interfaz").remove();

	if($("#url_files").text() != "") {
		url_files = $("#url_files").text();
	}
	$("#url_files").remove();
	
	config_xml = $.parseXML(config_xml);
	
	var Interfaz = $(config_xml).find("tipoInterfaz").text();
	ims.interfaz.setSkin(Interfaz);
	ims.interfaz.setWidthLimit('800');
	ims.interfaz.setHeightLimit('600');
	ims.interfaz.setSound('good', url_interfaz + 'audio/good.wav');
	ims.interfaz.setSound('bad', url_interfaz + 'audio/bad.wav');
	ims.interfaz.setSound('result', url_interfaz + 'audio/result.wav');
	ims.interfaz.init();
	inicializar();

	$("#overall").remove();
	$("#left2").remove();
	$("#right2").remove();
	document.addEventListener("touchmove", function(e) {
		e.preventDefault();
		return false;
	}, false);
	
	if (isiPad){
		$("body").css("margin-top","-20px");
	}
});

function inicializar() {
	// compruebo si existe introduccion para lanzar la pagina principal, en caso
	// de que no, cargamos la actividad
	timePlaying = 0;
	readyKaraoke = 0;
	readyCancion = 0;
	timeMuted = 0;
	timeCancionMuted = 0;
	timeKaraokeMuted = 0;
	timeListenerBarra = 0;

	if ($(config_xml).find("introduccion").find("texto1").text().length != 0) {
		$(config_xml).find("introduccion").each(
				function() {
					var IntTit = $(this).find("titulo").text();
					var IntTex = $(this).find("texto1").text();
					ims.interfaz.setTitle(IntTit);
					$("#visor_content").append(
							"<div id=\"respuesta\" style=\" padding:30px 0px;\">"
									+ IntTex + "</div>");
					var comenzar = $(config_xml).find("comenzar").text();
					ims.interfaz.addButton("Siguiente", "right", "siguiente",comenzar);
					ims.interfaz.enable("Siguiente");
					ims.interfaz.bind("Siguiente", 'nextPage()');
				});

	} else {
		cargar_actividad();
	}
};
//--------------------------------------------------------------
function cargar_actividad() {
	//-------------------------------------------------------------------------
	//Set Interfaz
	
	setFirstInterface();
	//-------------------------------------------------------------------------	
};
//-------------------------------------------------------------------------
//Autor RCBL
//crea los conjuntos
function setFirstInterface(){
	//---------------
	//Variables y propiedades
	//---------------
	//funciones
	emptyStage();
	cargarCommunStage()	;
	
	//---------------
	titulos = $(config_xml).find("titulo").toArray();

	$("#header").html(titulos[0].textContent);
	//---------------
	//Subtitulo
	subtitulo = '<div class="titulo">'+$(config_xml).find("enunciado").text()+'</div>';
	$("#visor_content").append(subtitulo);
	pantallas = "<div id=pantallaFondoGris>";
	pantallas = pantallas+"<div id=pantallaFondoBlanco>";
	pantallas = pantallas+"</div>";
	pantallas = pantallas+"</div";
	$('#fondo').append(pantallas);
	//---------------
	//Imagen
	
	objFoto = $(config_xml).find("imagen");

	if(objFoto.text() != ""){

		if(url_files != ""){
			img  = url_files+objFoto.text();
			
		}else{
			img  = "archivos/"+objFoto.text();
		
		}
		
		$("<img/>").attr("src", img).load(function() {
			image_width = this.width;
			image_height = this.height;
			fondo_width = $("#pantallaFondoBlanco").width();
			fondo_height = $("#pantallaFondoBlanco").height();
			posX = (fondo_width/2)-(image_width/2);
			posY = (fondo_height/2)-(image_height/2);
			$("#pantallaFondoBlanco").css("background-image", "url("+img+")");
			$('#pantallaFondoBlanco').css("background-repeat", "no-repeat");
			$('#pantallaFondoBlanco').css("background-position", Math.round(posX) + "px " + Math.round(posY) + "px");
		});
	}
	//---------------
	//Sonido
	if(url_files != ""){
		snd  = url_files+objFoto.text();
	}else{
		snd  = "archivos/"+objFoto.text();
	}
	//---------------
	//ponemos las canciones segun el listado de canciones
	sonidos[0]	= $(config_xml).find("sonido2").text();
	sonidos[1]	= $(config_xml).find("sonido").text();
	//---------------
	//Audio
	setAudio();
	//---------------

	$("#visor").css("padding-top", 30+"px");

	//---------------
	//Cufon
	ims.interfaz.putCufon();
	introduccion = $(config_xml).find("introduccion").text();
	$('#visor_content').css("height","485px");
	$('#visor_content').css("margin-top","40px");
	$('#visor_content').css("padding-bottom","20px");
	$('#visor_content').css("padding-right","30px");
	$("#visor_content").append(introduccion);
};
//-------------------------------------------------------------------------
function setAudio(){
	str_karaoke= '<video height="0" width="0" id="karaoke_mp3">';
	str_cancion= '<video height="0" width="0" id="cancion_mp3">';
	//---------------
	//Sonido karaoke
	if(url_files != ""){
		str_karaoke = str_karaoke+'<source src="'+url_files+sonidos[1]+'">';
	}else{
		str_karaoke = str_karaoke+'<source src="archivos/'+sonidos[1]+'">';
	}
	//---------------
	//Sonido cancion
	if(url_files != ""){
		str_cancion = str_cancion+'<source src="'+url_files+sonidos[0]+'">';
	}else{
		str_cancion = str_cancion+'<source src="archivos/'+sonidos[0]+'">';
	}
	str_karaoke = str_karaoke+'</video>';
	str_cancion = str_cancion+'</video>';
	$("#visor_content").append(str_karaoke);
	$("#visor_content").append(str_cancion);
	str_error = '<p id="loadStatus1">MOVIE LOADING 7...</p>';
    str_error = str_error+'<p id="loadStatus2">MOVIE LOADING...</p>';
	str_error = str_error+'<p id="loadStatus3">MOVIE LOADING...</p>';

	//$("#visor_content").append(str_error);
	//---------------
	//popcorn1 = Popcorn( "#karaoke_mp3" );
	//popcorn2 = Popcorn( "#cancion_mp3" );
	var objPopCorn = [];
	objPopCorn[0] = document.getElementById('karaoke_mp3');
	objPopCorn[1] = document.getElementById('cancion_mp3');
	
	//---------------
	
	$("#play").click(function(){
		if(readyCancion == 1 && readyKaraoke == 1){
			if(isKaraoke == 0){
				objPopCorn[1].play();
				$(this).css("display", "none");
				$("#pause").css("display", "block");
				$(this).css("display", "none");	
			}else{
				objPopCorn[0].play();
				$(this).css("display", "none");
				$("#pause").css("display", "block");
				$(this).css("display", "none");
			}
		}	
	});
	
	$("#pause").click(function(){
		if(readyCancion == 1 && readyKaraoke == 1){
			if(isKaraoke == 0){
				objPopCorn[1].pause();
				$("#play").css("display", "block");
				$(this).css("display", "none");
				current_time = objPopCorn[0].currentTime;
			}else{
				objPopCorn[0].pause();
				$("#play").css("display", "block");
				$(this).css("display", "none");
				current_time = objPopCorn[1].currentTime;
			}
			
		}	
	});

	$("#mute").click(function(){
		if(readyCancion == 1 && readyKaraoke == 1){
			objPopCorn[0].pause()
			objPopCorn[1].pause()

			timeKaraokeMuted = convertNumberToDecimals(objPopCorn[0].currentTime,1,10,10);
			timeCancionMuted = convertNumberToDecimals(objPopCorn[1].currentTime,1,10,10);
			
			timeMuted = 0;
			$(this).css("display","none");
			$("#unmute").css("display","block");
		}
		
	});	

	$("#unmute").click(function(){
		if(readyCancion == 1 && readyKaraoke == 1){
			
			if(isKaraoke == 0){
				suma = (timeMuted/10)+timeCancionMuted;
				objPopCorn[1].play();
				objPopCorn[1].currentTime = suma;
				console.log("cancion = ")
			}else{
				suma = (timeMuted/10)+timeKaraokeMuted;
				objPopCorn[0].play();
				objPopCorn[0].currentTime = suma;
				console.log("kasraoke = ")
			}
		
			timePlaying = convertNumberToDecimals(suma,1,10,1);
			
			$("#mute").css("display","block");
			$(this).css("display","none");
			$(this)
		}
	
	});
	
	$("#cancion").click(function(){
		$("#karaoke input").attr('checked', false);
		$("#karaoke input").val(0);
		$("#cancion input").attr('checked', true);
		$("#cancion input").val(1); 
		
		if(readyCancion == 1 && readyKaraoke == 1){
			isKaraoke = 0;
			if(objPopCorn[0].currentTime > 0){
					objPopCorn[1].currentTime = objPopCorn[0].currentTime;
					
			}
			if($("#play").css("display") == "none"){
				if($("#mute").css("display") != "none"){
					objPopCorn[1].play();
					objPopCorn[0].pause();
				}
			}else{
				objPopCorn[0].pause();
				objPopCorn[1].pause();
				
			}
			$("#loadStatus3").html("snd 1 = "+objPopCorn[0].currentTime+" snd 2 = "+objPopCorn[1].currentTime);
		}
	});

	$("#karaoke").click(function(){
		$("#karaoke input").attr('checked', true);
		$("#karaoke input").val(1);
		$("#cancion input").attr('checked', false);
		$("#cancion input").val(0);
		
		if(readyCancion == 1 && readyKaraoke == 1){
			isKaraoke = 1;
			if(objPopCorn[1].currentTime > 0){
					objPopCorn[0].currentTime = objPopCorn[1].currentTime;
				}
			if($("#play").css("display") == "none"){
				if($("#mute").css("display") != "none"){
					objPopCorn[0].play();
					objPopCorn[1].pause();
				}
			}else{
				objPopCorn[0].pause();
				objPopCorn[1].pause();
				
			}
			$("#loadStatus3").html("snd 1 = "+objPopCorn[0].currentTime+" snd 2 = "+objPopCorn[1].currentTime);
		}	
	});
	//---------------
	changeCues();
	//---------------
	//la barra
	//-------------
	barra_sup_margin_left =	Number($("#barra_sup").css("margin-left").replace("px", ""));
	barra_sup_border_width =	Number($("#barra_sup").css("border-width").replace("px", ""));
	inicio = iniciobtnBarra = $("#play").offset().left+$("#play").width()+barra_sup_margin_left+barra_sup_border_width;
	if(isiPad || isAndroid) {
	
		$("#btn_barra").live("vmousedown", function(e) {
		
			e.preventDefault();
			
			item_width = $(this).width();
			item_height = $(this).height();
			$("#contentCues").css("top",posicionCue+"px");
			if(checked == 0) {
				dragging = true;
				draggingObj = $(this);
			}
			
		});
		//iniciobtnBarra = $('#barra_sup').offset().left - $('#left').offset().left;
		$(document).live("vmousemove", function(e) {
		
			e.preventDefault();
			var tmp_x = e.pageX - $('#barra_sup').offset().left+iniciobtnBarra - (item_width/2);
			//var tmp_x = e.pageX -item_width-$('#barra_sup').offset().left+$('#fondo').offset().left - (item_width/2);	
			if(readyCancion == 1 && readyKaraoke == 1){			
				move(draggingObj, tmp_x ,e.pageX);
			}
			
		});
	
		$(document).live("vmouseup", function(e) {
		
			if(dragging) {
				suelta();
			}
			
		});
		
	} else {
	
		$("#btn_barra").live("mousedown", function(e) {
			e.preventDefault();
			
			item_width = $(this).width();
			item_height = $(this).height();
			$("#contentCues").css("top",posicionCue+"px");
			if(checked == 0) {
				draggingObj = $(this);
				dragging = true;
			}
			
			
		});
		//iniciobtnBarra = $('#barra_sup').offset().left - $('#left').offset().left;
		$(document).live("mousemove", function(e) {
			var tmp_x = e.pageX - $('#barra_sup').offset().left+iniciobtnBarra - (item_width/2);
			if(readyCancion == 1 && readyKaraoke == 1){
				move(draggingObj, tmp_x ,e.pageX);
			}
		});
	
		$(document).live("mouseup", function(e) {
		
			if(dragging) {  
				suelta(); 
			}
			
		});
	}


	$("#btn_barra").css("left",iniciobtnBarra);
	inicio = $("#play").offset().left+$("#play").width()+barra_sup_margin_left+barra_sup_border_width;
	//---------------
	timeLine = window.setInterval(funcTimeLine, 100, objPopCorn);//Usaremos esta linea de tiempo tambien para los cue point
	$(".titulo").click(function(){
		window.clearInterval(timeLine);
		console.log("//--------Paramos---------//");
	});

}
//-------------------------------------------------------------------------
function funcTimeLine(objPopCorn) {
	//--------------------------------------
	//propiedades de la linea de tiempo
	indexObj = (isKaraoke == 1)?0:1;

	
	//--------------------------------------
	//Muted sumatoria
	if($("#mute").css("display") == "none" && $("#play").css("display") == "none"){
		timeMuted++;
	}
	//--------------------------------------
	//funcListenerVideo1
	var myVideo1 = document.getElementById('karaoke_mp3');
	$("#loadStatus1").html(myVideo1.readyState);
	if(myVideo1.readyState > 0){
		readyKaraoke = 1;
	};
	//--------------------------------------
	//funcListenerVideo1
	var myVideo2 = document.getElementById('cancion_mp3');
	$("#loadStatus2").html(myVideo2.readyState);
	if(myVideo2.readyState > 0){
		readyCancion = 1;
	};
	//--------------------------------------
	//Cue-point

	if($("#play").css("display") == "none"){
		//timeListenerBarra++;
		
		for(i=0; i< arr.length; i++){
			if(arr[i][0] == (timePlaying/10)){
				console.log("Exito con el cue = "+(timePlaying/10));
				//---------------------------------------------------
				//buscamos el indice en el que estamos
				indiceCue = i;

				//NO BORRAR
				//console.log("Entro cue arr["+indiceCue+"][0] = "+arr[indiceCue][0]+" currentTime = "+popcorn1.currentTime()+" indiceCue= "+indiceCue);
				//console.log("seg.start = "+seg.start);
				//for(var property in seg){
				//	console.log("property = "+property+" = "+seg[property]);
				//}
				//console.log("//Data -------");
				//for(var property2 in data){
				//	console.log("property2 = "+property2+" = "+data[property2]);
				//}
				//console.log("//---------------------------------------------------");
				
				if(arr[indiceCue][2] != undefined){
					//-------------------------------
					//Coloreamos los textos
					if($("#cue_on_karaoke_"+( indiceCue - 1)).attr("id") != undefined){
						$("#cue_on_karaoke_"+( indiceCue - 1)).height(alto_text_k);
						$("#cue_on_karaoke_"+( indiceCue - 1)).removeClass("cue_in_on");
					}
					$("#cue_on_karaoke_"+indiceCue).addClass("cue_in_on");
					$("#cue_on_karaoke_"+indiceCue).height((alto_text_k+5));
					
					if($("#cue_on_karaoke_"+( indiceCue + 1)).attr("id") != undefined){
						$("#cue_on_karaoke_"+( indiceCue + 1)).height(alto_text_k);
						$("#cue_on_karaoke_"+( indiceCue + 1)).removeClass("cue_in_on");
					}
					
					posicionContentCue = Number($("#contentCues").css("top").replace("px", ""));
					posicionContentCue = posicionContentCue - alto_text_k;
					
					$("#contentCues").css("top",(arr[indiceCue][2]-8)+"px");
				}
			}
		}
		timePlaying++;
		seg = timePlaying/10;

	}
	//--------------------------------------
	//La barra de sonido
	
	barra_sup_width = $("#barra_sup").width();
	btn_barra_width = $("#btn_barra").width();
	tam_lapso_barra = $("#barra_sup").width() - $("#btn_barra").width();
	draggingObj = $("#btn_barra");
	mitadItemWidth = (draggingObj.width()/2);
	posicionInicioBarraSup = $('#barra_sup').offset().left + mitadItemWidth + Number($('#barra_sup').css("border-left-width").replace("px", ""));
	posicionFinalBarraSup = $('#barra_sup').offset().left + $('#barra_sup').width() - (Number($('#barra_sup').css("border-left-width").replace("px", ""))*2);
	
	if(!dragging && $("#play").css("display") == "none"){
		porcentajeCancion = (seg * 100)/objPopCorn[indexObj].duration;
		PosBtn = (porcentajeCancion * tam_lapso_barra)/100;
		$("#barra_int").width(PosBtn);
		PosBtn2 = inicio + PosBtn;
		draggingObj.css("left", PosBtn2);		
	}else{
		posicionDragObj = draggingObj.offset().left;
		tamBarraInterior = 	posicionDragObj - posicionInicioBarraSup + mitadItemWidth;
		$("#barra_int").width(tamBarraInterior);
		
		x1 = (tamBarraInterior * 100 ) / tam_lapso_barra;
		x2_a = (x1 * objPopCorn[0].duration ) / 100;
		x2_b = (x1 * objPopCorn[1].duration ) / 100;
		objPopCorn[0].currentTime = x2_a;
		objPopCorn[1].currentTime = x2_b;

		timePlaying = convertNumberToDecimals(objPopCorn[indexObj].currentTime,1,10,1);
	}
	//-----------------------
	//Cuando llegamos al final de la barra basado en karaoke reiniciamos el sistema
	if(Math.floor(objPopCorn[indexObj].duration) == Math.floor(objPopCorn[indexObj].currentTime)){
			inicializar();
	}
	//-----------------------
	//Cuando terminan de ponerse los cues, los sacamos del stage
	if((arr[(arr.length - 1)][0] + 5) == (timePlaying/10)){
		$("#contentCues").css("top",$("#cues").height()+"px");
	}	
	//--------------------------------------
	
}

//-------------------------------------------------------------------------
function changeCues(){
	numTime1 = 0;
	numTime2 = 0;
	textCue = [];
	timesCue = [];
	str_cues= "<div id='cues'></div'>";
	$("#visor_content").append(str_cues);
	str_cues= "<div id='contentCues'></div'>";
	$("#cues").append(str_cues);
	
	var times = new Array();
	times = $(config_xml).find("elemento").toArray();		
	indiceCue = 0;
	
	
	//-----------------------------------------------------
	
	for(i=0; i< times.length; i++){
		seg = convertNumberToDecimals(Number($(times[i]).attr('time')),1000,10,10);
		arr[i] = [seg,$(times[i]).text()];
	}
	//---------------------------------------------------
	arr.sort( function( a, b )
	{
	  if ( a[0] == b[0] ) return 0;
	  return a[0] < b[0] ? -1 : 1;
	});
	
	//---------------------------------------------------
	for(i=0; i< arr.length; i++){

		str_txt= "<span id='cue_on_karaoke_"+i+"' class='cue_in'>"+arr[i][1]+"</span'>";
		$("#contentCues").append(str_txt);
		
		alto_text_k = $("#cue_on_karaoke_"+i).height();
		posicion_inicio = $("#cues").height()-alto_text_k;
		posicionCue =  posicion_inicio-((i+1)*alto_text_k);
		arr[i][2] = posicionCue;
		//NO BORRAR
		for(j=0; j< arr[i].length; j++){
			console.log("arr["+i+"]["+j+"] = "+arr[i][j]);
		}
		
	}
	
	//-----------------------------------------------------
	for(i=0; i< arr.length; i++){
		altoCues = 0;
		posicion_inicio = 0;
		//-------------------------------
		//alto_text_k = $("#cue_on_karaoke_"+i).height();
		posicion_inicio = $("#cues").height()-alto_text_k;
		posicionCue =  posicion_inicio + altoCues;
		altoCues = altoCues + alto_text_k;
		//centroCues  = ($("#fondo").width()/2) - ($("#contentCues").width()/2) -  Number($("#visor").css("padding-left").replace("px", ""));
		centroCues = $("#pantallaFondoGris").offset().left
		$("#contentCues").css("top",posicionCue+"px");
		$("#cues").width($(".cue_in").width());
		$("#cues").css("margin-left",(centroCues+4)+"px");//$("#contentCues").css("left",centroCues+"px");
	}	
	
}
//-------------------------------------------------------------------------
function resetCues(){
	$(".cue_in").each(function(i){
		$(this).height(alto_text_k);
		$(this).removeClass("cue_in_on");
		$(this).css("top",arr[i][2]);
	});
	$("#contentCues").css("top",(posicionCue+alto_text_k)+"px");
}
//-------------------------------------------------------------------------
function resetele(obj) {
	$("#" + obj.attr("posicion")).attr("rel", "-1");
	obj.attr("posicion", "-1");
}
//-------------------------------------------------------------------------
function move(obj, x, e_pageX) {
	if(dragging) {
		$("#contentCues").css("top",$("#cues").height()+"px");
		obj.css("position","absolute");
		mitadItemWidth = (draggingObj.width()/2);
		posicionInicioBarraSup = $('#barra_sup').offset().left - Number($('#barra_sup').css("border-left-width").replace("px", ""));
		posicionFinalBarraSup = $('#barra_sup').offset().left + $('#barra_sup').width();
		
		if(e_pageX > posicionInicioBarraSup && e_pageX < posicionFinalBarraSup){
			obj.css("left", (parseInt(x)) + "px");
		}	
	}
}
//-------------------------------------------------------------------------
function suelta() {
	dragging = false;
	resetCues();
}
//-------------------------------------------------------------------------

function convertNumberToDecimals(numberToConvert,question,numberEnters,numberDecimals){
	seg2 = numberToConvert/question;
	seg2 = seg2*numberEnters;
	seg2 = Math.floor(seg2);
	seg2 = seg2/numberDecimals;
	return seg2
}
//-------------------------------------------------------------------------
function setListado(){
	console.log("listado_on = "+listado_on);
	if(!listado_on){
		//--------------------------------
		//posicion listado
		listado_on = 1;
		
		listadoWraper = "<div id='listado'></div>";
		$("#visor_content").append(listadoWraper);
		listado_x = ($("#visor_content").width()/2) - ($("#listado").width()/2);
		listado_y =  ($("#visor_content").height()/2) - ($("#listado").height()/2);
		$("#listado").css("left", listado_x+"px");
		$("#listado").css("top", listado_y+"px");
		//--------------------------------
		//skin listado
		$(config_xml).find("cancion").each(function(a){
				//---------------
				//nomBtn
				
				subtitulo = '<div id="listTit_'+a+'" class="btnsListado" src="'+a+'">'+$(this).find("titulo").text()+'</div>';
				$("#listado").append(subtitulo);
				if(a == palIndice){
					$('#listTit_'+a).addClass("backBtnsListado");

				}
				$("#listTit_"+a).click(function(){
					palIndice = $(this).attr("src");

					listado_on = 0;
					inicializar();
					console.log("listado_on = "+listado_on);
				});
		});
	}else{
		listado_on = 0;
		$("#listado").remove();
	}
}

//-------------------------------------------------------------------------
function siguienteCancion(){
	if((numKaraokes -1) > palIndice){
		palIndice++;
		listado_on = 0;
		inicializar();
	}
}
//-------------------------------------------------------------------------
function anteriorCancion(){
	if(palIndice >= 1 ){
		palIndice--;
		listado_on = 0;
		inicializar();
	}
}

//-------------------------------------------------------------------------
function emptyStage(){
	window.clearInterval(timeLine);
	$("#center").height(0);
	$("#center").empty();
	$("#fondo").css("background", "");
	$("body").toggle(1);
	$("#header").empty();
	$("#pregunta").empty();
	$("#visor_content").remove();
	$("#respuesta").empty();
	$("#right").empty();
	$("#left").empty();
	$("#fondo").empty();
	$("#visor").empty();
	$('.tooltip').hide();
	$("body").toggle(1);
	$("#visor").append('<div id="visor_content" style="height: 425px; "></div>');
	
}
//--------------------------------------------------------------
function cargarCommunStage(){
	//------------------------
	ims.interfaz.setTitle($(config_xml).find("titulo").text());

	silenciar = ($(config_xml).find("silenciar").text())?$(config_xml).find("silenciar").text():"Silenciar";
	volver = ($(config_xml).find("volver").text())?$(config_xml).find("volver").text():"Volver a empezar";
	play =($(config_xml).find("btn_play").text())?$(config_xml).find("btn_play").text():"Reproducir";
	pause =($(config_xml).find("pausar").text())?$(config_xml).find("pausar").text():"Pausar";
	
	cancion = ($(config_xml).find("song_label").text())?$(config_xml).find("song_label").text():"Cancion";
	karaoke = ($(config_xml).find("karaoke_label").text())?$(config_xml).find("karaoke_label").text():"Karaoke";
	//---------------
	//barra de sonido
	if($(config_xml).find("tipoInterfaz").text() == "secundaria"){
		ims.interfaz.addButton("reload2", "left", "reiniciar",	volver);
	}
	ims.interfaz.addButton("play", "left", "play",	play);
	ims.interfaz.addButton("pause", "left", "pause",	pause);
	barra_str = "<div id='barra_sup'>";
	barra_str = barra_str+"<div id='btn_barra'></div>";
	barra_str = barra_str+"<div id='barra_int'></div>";
	barra_str = barra_str+"</div>";
	$("#left").append(barra_str);
	
	ims.interfaz.addButton("mute", "left", "silenciar",	silenciar);
	ims.interfaz.addButton("unmute", "left", "silenciar_on",	silenciar);
	

	
	isCheckedKaraoke = (isKaraoke)?"checked":"";
	btnKaraoke = "<span id='karaoke'><input type='radio' name='sonido' value='1' "+isCheckedKaraoke+">"+karaoke+"</span>";
	$("#right").append(btnKaraoke);
	isCheckedCancion = (!isKaraoke)?"checked":"";
	btnCancion = "<span id='cancion'><input type='radio' name='sonido' value='0' "+isCheckedCancion+">"+cancion+"</span>";
	$("#right").append(btnCancion);
	
	if($(config_xml).find("tipoInterfaz").text() != "secundaria"){
		ims.interfaz.addButton("reload2", "right", "reiniciar",	volver);
	}
	
	ims.interfaz.enable("play");
	
	
	
	ims.interfaz.enable("pause");
	ims.interfaz.enable("mute"); 
	ims.interfaz.enable("unmute");
	ims.interfaz.enable("reload2");
	$("#unmute").css("display","none");
	$("#pause").css("display","none");
	ims.interfaz.bind("reload2","inicializar()");
	ims.interfaz.resize();
}
