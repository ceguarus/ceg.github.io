var isAndroid = navigator.userAgent.match(/Android/i) != null;
var isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null;
var isMobile = (isiOS || isAndroid);
var isIE = $.browser.msie;
var isMoz = $.browser.mozilla;
var isOp = $.browser.opera;
var version = parseInt($.browser.version);
var tooltext = "";

$(".tool").live("mouseover", function(e) {
	tooltext = $(this).data().title;
						
	if (!($(this).hasClass("notdisabled"))) {
		$(".tooltip").hide();
	}
});

if ( typeof ims == "undefined") {
	var ims = {
		test : function() {
			console.log("ims existe");
		}
	};
};

ims.interfaz = {
	skin : 'tablet',
	subSkin : '',
	sound : true,
	widthLimit : '1024',
	heightLimit : '600',
	iecompatible : true,
	ie8compatible : true,
	Mp3Mp4compatible:true,
	zoomRatio: 1,
	audios : [],
	init : function() {

		if ((!isMobile && isIE) || (!this.Mp3Mp4compatible)){
		    if ((!this.Mp3Mp4compatible) || (!this.iecompatible) || (version <= 7) || ((version==8) && !this.ie8compatible)) {
			    $("body").append('<div class="changeBrowser">Este recurso no es compatible con esta versión de navegador. Le recomendamos usar la ultima versión de Chrome o Safari.<br />Copie el siguiente enlace en su navegador para ver el recurso:<br /><br />' + $(location).attr('href') + '</div>');
			    $(".ui-page").remove();
			    $("*").css({
				    '-webkit-user-select': 'auto',
				    '-khtml-user-select': 'auto',
				    '-moz-user-select': 'auto',
				    '-o-user-select': 'auto',
				    'user-select': 'auto'
			    });
			    $("body").css({
				    'background-color': '#78c3ed'
			    });
			    $(".changeBrowser").css({
				    'background-color': '#ffffff',
				    'width': '800px',
				    'margin': '50px auto 0px auto',
				    'padding': '20px',
				    'overflow': 'auto'
				    
			    });
			    throw "stop execution";
		    }
    	}
		$("body").append('<div id="limit"><div id="carcasa"><div id="fondo"></div><div id="overall"></div><div id="content"><div id="visor"><div id="header"><div id="pregunta"></div><div style="clear:both;"></div></div><hr/></div><div id="bottombar"><div id="left"></div><div id="center"></div><div id="right"></div></div></div></div></div>');
		$("body").addClass(ims.interfaz.skin);
		if (ims.interfaz.subSkin != "") {
			$("body").addClass(ims.interfaz.subSkin);
		}

		ims.interfaz.resize();
		ims.interfaz.showTooltips();

		$("body").css('background-color', '#cccccc');
		$("body").css('overflow', 'auto');
		$("#limit").css('background-color', '#ffffff');
		
		$("#limit").css("width", this.widthLimit + "px");
		$("#carcasa").css("width", this.widthLimit + "px");
		$("#content").css("width", this.widthLimit + "px");
		
		$("#limit").css("height", this.heightLimit + "px");
		$("#carcasa").css("height", this.heightLimit + "px");
		$("#content").css("height", this.heightLimit + "px");
		
		if(typeof(editable)=="undefined") {
			$("#limit").css('margin', 'auto');
			$("#limit").css("margin-top", Math.round(($(window).height() - this.heightLimit) / 2));
		}
			
		$('.pop_up').css("margin-left", ($(window).width() - $('.pop_up').width()) / 2);
		$('#pop_' + name + '').css("margin-top", ($(window).height() - $('#pop_' + name + '').outerHeight()) / 2);
		$("#fondo").width($("#content").width());
		$("#fondo").height($("#content").height());
		$("#overall").width($("#content").width());
		$("#overall").height($("#content").height());
		$("#center").css('left', (Math.ceil($("#content").width() / 2) - Math.floor($("#center").width() / 2) - 55));

	},
	resize : function() {

		if(typeof(editable)=="undefined") {
			
	    	if (isMobile) {
				if (($(document).width() / 1024) <= ($(document).height() / 600)) {
					ims.interfaz.zoomRatio = $(window).width() / 1024;
					
				} else {
					ims.interfaz.zoomRatio = $(window).height() / 600;
				}
			}
			
			if (isMobile && ims.interfaz.zoomRatio != 1) {
				$("#limit").css({
					"zoom": ims.interfaz.zoomRatio ,
					"-moz-transform": "scale("+ims.interfaz.zoomRatio+")"
				});
			}
			
			$("#limit").css("margin-top", Math.round(($(window).height() - (this.heightLimit * ims.interfaz.zoomRatio)) / 2));
			$("#limit").css("margin-left", "auto");
						
		}

	},
	getSkin : function() {
		return this.skin
	},
	setSubSkin : function(a) {
		this.subSkin = a
	},
	getSubSkin : function() {
		return this.subSkin
	},
	addButton : function(a, b, c, d) {
		if (d == '' || !(d)) {
			console.log("La variable tooltip no puede estar vacia");
		} else {
			if (b == '' || !(b)) {
				console.log("Especifique la capa")
			} else {
				if ((b != "left") && (b != "right") && (b != "left2") && (b != "right2")) {
					console.log("Capa no válida. Use \"left\" o \"right\"")
				} else {
					var e = "<div id=\"" + a + "\" class=\"button_" + b + " " + c + " tool\" title=\"" + d + "\"></div>";
					$("#" + b).append(e);
					if (!isMobile) {
						$("#" + a).tooltip()
					}
				}
			}
		}
	},
	enable : function(a) {
		$("#" + a).addClass("notdisabled")
	},
	disable : function(a) {
		$("#" + a).removeClass("notdisabled")
	},
	disableIE: function() {
		this.iecompatible = false;	
	},
	disableIE8: function() {
		this.ie8compatible = false;	
	},
	disableMp3Mp4: function() {
		this.Mp3Mp4compatible = false;	
	},
	bind : function(a, b) {
		$("#" + a).unbind('click');
		if (!(b) || b == '') {
			console.log("El parámetro funcion está vacio o no existe")
		} else {
			$("#" + a).bind("click", function() {
				eval(b)
			})
		}
	},
	setTitle : function(a) {
		if (!(a) || a == '') {
			console.log("El parámetro title está vacio o no existe")
		} else {
			$("#header").prepend(a)
		}
	},
	showTooltips : function() {
	
		$("#left").bind('mousemove', function(e) {
			$(".tooltip").mouseenter(function() {
				$(this).hide();
			});
			$('.tooltip').css({
				left : e.pageX,
				top : e.pageY - 45
			})
		});
		
		$("#right").bind('mousemove', function(e) {

			var flag = false;
			$(".tooltip").each(function(index) {
			
				if ( $(this).text() == tooltext ) {
					if(!flag) {
					
						$('.tooltip').css({
							left : e.pageX - 400,
							top : e.pageY - 80
						});
						
						$('.tooltip').css({
							left : e.pageX - $(this).width(),
							top : e.pageY - 45
						});
						//$(this).show();
						
						flag = true;
					}
				}
				
			}); 

			$(".tooltip").mouseenter(function() {
				$(this).css({
					left : parseInt($(this).css("left")) - 400,
					top : parseInt($(this).css("top")) - 80
				});
			});

		});
		
	},
	addPopup : function(a, b) {
		var c = '<div id="pop_' + a + '" class="pop_up"><div id=close_' + a + ' class="pop_up_close"></div><div id="content_' + a + '" class="pop_up_content"></div></div>';
		$("#carcasa").append(c);
		ims.interfaz.enable(b);
		ims.interfaz.bind(b, "$('#pop_" + a + "').fadeIn('slow');");
		$('#pop_' + a + '').width($('#content').width() / 2);
		$('#pop_' + a + '').height(($("#content").height() / 2));
		$('.pop_up').css("margin-left", ($(window).width() - $('.pop_up').width()) / 2);
		$('#pop_' + a + '').css("margin-top", ($(window).height() - $('#pop_' + a + '').outerHeight()) / 2);
		$('#content_' + a + '').width($('#pop_' + a + '').width());
		$('#content_' + a + '').height($('#pop_' + a + '').height());
		ims.interfaz.bind('close_' + a + '', '$(\'#pop_' + a + '\').fadeOut(\'slow\');')
	},
	showResults : function(a) {
		a = a.replace("<p>", "").replace("</p>", "").split("/");
		$("#center").append("<p>" + a[0] + "<span class='marc'> / " + a[1] + "</span></p>");
		$("#center").show("")
	},
	setSound : function(a, b) {
		if (isIE && version == 8) {
			var c = new Number(RegExp.$1);
			if (c <= 8) {
				this.audios[a] = b;
				return
			}
		} else {
			$("body").append('<audio id="' + a + '" name="' + a + '" src="' + b + '" preload="auto"></audio>')
		}
	},
	playSound : function(a) {
		if (this.sound) {
			if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
				var b = new Number(RegExp.$1);
				if (b <= 8) {
					$("body").append('<bgsound src="' + this.audios[a] + '"  AUTOSTART="TRUE"></bgsound>');
					return
				}
			};
			$("#"+a)[0].play()
		}
	},
	pauseSound : function(a) {
		$("#"+a)[0].pause()
	},
	enableSound : function() {
		this.sound = true
	},
	disableSound : function() {
		this.sound = false
	},
	setWidthLimit : function(a) {
		this.widthLimit = a
	},
	setHeightLimit : function(a) {
		this.heightLimit = a
	},
	showStars : function(a, b, d, e) {
		var c = 0;
		var f = 0;
		var g = ($("#" + e).offset().top) - ($("#pregunta").offset().top + $("#pregunta").outerHeight());
		if (g < 0 || g > parseInt($(".jspContainer").outerHeight())) {
			return
		}
		while (c <= 2) {
			$("body").append("<div id=\"star" + e + "_" + d + c + "\" class=\"stars\"></div>");
			if (c >= 1) {
				f += 5
			}
			$("#star" + e + "_" + d + c).css({
				"top" : b,
				"left" : a + f
			});
			c++
		}
		if (d == "left") {
			$("#star" + e + "_" + "left1").animate({
				marginLeft : "-" + ($(".stars").width() + f / 2) + "px",
				marginTop : "-" + ($(".stars").height() * 1.5) + "px",
				opacity : 0.0,
			}, 1500);
			$("#star" + e + "_" + "left2").animate({
				marginLeft : "-" + ($(".stars").width() + f / 3) + "px",
				marginTop : "-" + ($(".stars").height() * 3) + "px",
				opacity : 0.0,
			}, 1500)
		}
		if (d == "right") {
			$("#star" + e + "_" + "right1").animate({
				marginRight : "-" + ($(".stars").width() + f / 2) + "px",
				marginTop : "-" + ($(".stars").height() * 1.5) + "px",
				opacity : 0.0,
			}, 1500);
			$("#star" + e + "_" + "right2").animate({
				marginRight : "-" + ($(".stars").width() + f / 3) + "px",
				marginTop : "-" + ($(".stars").height() * 3) + "px",
				opacity : 0.0,
			}, 1500)
		}
		if (d == "center") {
			$("#star" + e + "_" + "center1").animate({
				marginRight : "-" + ($(".stars").width() + f / 2) + "px",
				marginTop : "-" + ($(".stars").height() * 1.5) + "px",
				opacity : 0.0,
			}, 1500);
			$("#star" + e + "_" + "center2").animate({
				marginLeft : "-" + ($(".stars").width() + f / 2) + "px",
				marginTop : "-" + ($(".stars").height() * 3) + "px",
				opacity : 0.0,
			}, 1500)
		}
		$("#star" + e + "_" + d + "0").animate({
			marginTop : "-" + ($(".stars").height() * 2.5) + "px",
			opacity : 0.0,
		}, 1500)
	}
};
$(window).resize(function() {
	if(typeof(editable)=="undefined") {
		ims.interfaz.resize();
	}
}); 