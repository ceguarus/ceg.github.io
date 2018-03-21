$tAudio = false;

$(window).resize(function(){
	$h = $(window).height();
	$w = $(window).width();
	var t = ( $h/2 - 768/2 > 0 ) ? $h/2 - 768/2 : 0;
	var l = ( $w/2 - 1024/2 > 0 ) ? $w/2 - 1024/2 : 0;
	$('#tudo').css({
		'top':t,
		'left': l
	})
})

$(window).load(function(){
	$h = $(window).height();
	$w = $(window).width();
	var t = ( $h/2 - 768/2 > 0 ) ? $h/2 - 768/2 : 0;
	var l = ( $w/2 - 1024/2 > 0 ) ? $w/2 - 1024/2 : 0;
	
	$('#tudo').css({
		'top':t,
		'left': l
	})
	
	$('#preHome').fadeIn(300);
	
	if( navigator.userAgent.match(/Chrome/)  ){
		$('#creditos #contCredits').css('letter-spacing','0px');
	} else {
		$('#creditos #contCredits').css('letter-spacing','0.5px');
	}
	
	if( navigator.appName.match(/Internet Explorer/) || navigator.userAgent.match(/MSIE/)  || ( navigator.userAgent.match(/Media Center/) && navigator.appName.match(/Netscape/) ) ){
		$('#lightbox').prepend('<div id="msgmIe"><img src="imagens/alert_IE.png" /></div>');
		$('#lightbox').css({backgroundImage:'none', background:"rgba(0, 0, 0, 0.8)"})
		$('#lightbox').on('click', function(){
		$('#lightbox').off();
			hideLightbox();
			$('#lightbox').css({background:"#fff", backgroundImage:"url(imagens/bg_title_.jpg)"})
			$('#msgmIe').remove();
			init();
		});
		$('#lightbox #msgmIe').show();
		$('#lightbox').show();
	}else{
		init();
	}
})

function init(){
	$('#preHome').delay(3000).fadeOut(300,function(){
		$('#home').fadeIn(300);
		$('#logoRichmond').fadeIn(300);
	});
	
	$('#btHome').off();
	$('#btHome').click(function(){
		$('.pagina').fadeOut(300);
		$('#home').delay(300).fadeIn(300);
		$('#btHome').hide();
		$('#btVoltar').hide();
		$('#contPlayer').html('');
		
		$('#activities #btsActivities').delay(200).fadeIn(300);
		$('#contAtvs').fadeOut(300);
	})
	
	$('#logoRichmond').click(function(){
		window.open('http://www.richmond.com.br','_blank');
	})
	
	// $('.btsPrincipais .botao').mouseover(function(){
		// $(this).prev().show();
	// });
	// $('.btsPrincipais .botao').mouseout(function(){
		// $(this).prev().hide();
	// });
	
	$('.btsPrincipais .botao').click(function(){
		$('.pagina').fadeOut(300);
		var pag = $(this).attr('class').replace('botao ','');
		$('#'+pag).delay(300).fadeIn(300);
		$('#btHome').show();
		
		$('.btAudio').removeClass('ativo')
		$('.nomeAudio').html('')
		$('.player .progress .barProgress').width(0);
		$('.player .progress .scrooler').hide();
		$('.player .progress .scrooler').css('left','0px');
		// $('#contPlayer audio')[0].volume = 1;
		$('.player .time').html('0:00s');
	})
		
	$('#lightbox .btFechar').click(function(){
		hideLightbox();
	})
	
	$('#activities .btUnit').click(function(){
		var h1 = '30px';
		var h2 = '30px';
		
		switch ($(this).attr('id')){
			case 'un1':
				tx1 = 'School objects'
				lk1 = 'ESRO000053733_gp1sg_ing_ei_unit1_school_objects_2014_m'
				h1 	= '65px';
				
				tx2 = 'School objects and numbers'
				lk2 = 'ESRO000053732_gp1sg_ing_ei_unit1_objects_numbers_2014_m'
				h2 	= '95px';
            break;
			case 'un2':
				tx1 = 'Colors 1'
				lk1 = 'ESRO000053748_gp1sg_ing_ei_unit2_colors_2014_m'
                
				tx2 = 'Colors 2'
				lk2 = 'ESFL000053755_gp1sg_ing_ei_unit2_colors_2014_m'
            break;
			case 'un3':
				tx1 = 'Family'
				lk1 = 'ESRO000053756_gp1sg_ing_ei_unit3_family_2014_m'
                
				tx2 = 'Pets and family'
				lk2 = 'ESFL000053745_gp1sg_ing_ei_unit3_pets_family_2014_m'
				h2 	= '65px';
            break;
			case 'un4':
				tx1 = 'My face 1'
				lk1 = 'ESRO000053746_gp1sg_ing_ei_unit4_face_2014_m'
                
				tx2 = 'My face 2'
				lk2 = 'ESRO000053757_gp1sg_ing_ei_unit4_face_2014_m'
            break;
			case 'un5':
				tx1 = 'Numbers'
				lk1 = 'ESAR000053729_gp1sg_ing_ei_unit5_numbers_2014_m'
                
				tx2 = 'Food'
				lk2 = 'ESMA000053754_gp1sg_ing_ei_unit5_food_2014_m'
            break;
			case 'un6':
				tx1 = 'Clothes 1'
				lk1 = 'ESMA000053737_gp1sg_ing_ei_unit6_clothes_2014_m'
                
				tx2 = 'Clothes 2'
				lk2 = 'ESMA000053738_gp1sg_ing_ei_unit6_clothes_2014_m'
            break;
			case 'un7':
				tx1 = 'Toys'
				lk1 = 'ESRO000053735_gp1sg_ing_ei_unit7_toys_2014_m'
                
				tx2 = 'On/In/Under'
				lk2 = 'ESRO000053739_gp1sg_ing_ei_unit7_prepositions_2014_m'
            break;
			case 'un8':
				tx1 = 'Pets'
				lk1 = 'ESRO000053740_gp1sg_ing_ei_unit8_pets_2014_m'
                
				tx2 = 'Pets and numbers'
				lk2 = 'ESRO000053741_gp1sg_ing_ei_unit8_pets_numbers_2014_m'
				h2 	= '65px';
			break;
		}
	
		$(this).parent().parent().fadeOut(300);
		$('#activities #contAtvs .circulo').attr('class', 'circulo ' + $(this).attr('id'));
		$('#activities #contAtvs .btAtv:eq(0)').attr('data-atv', lk1);
		$('#activities #contAtvs .btAtv:eq(0) p').html(tx1);
		$('#activities #contAtvs .btAtv:eq(0) p').css('height', h1);
		
		$('#activities #contAtvs .btAtv:eq(1)').attr('data-atv', lk2);
		$('#activities #contAtvs .btAtv:eq(1) p').html(tx2);
		$('#activities #contAtvs .btAtv:eq(1) p').css('height', h2);
		
		$('#activities #contAtvs').delay(200).fadeIn(300);
		$('#btVoltar').delay(200).fadeIn(300);
		$('#activities .titInterno .text').html('Unit ' + $(this).attr('id').substr(2,1))
		
		$('#btVoltar').off();
		$('#btVoltar').on('click tap', function(){
			$('#activities .titInterno .text').html('Activities')
			$('#activities #btsActivities').delay(200).fadeIn(300);
			$('#contAtvs').fadeOut(300);
			$('#btVoltar').fadeOut(300);
		});
	})
	
	$('#contAtvs .btAtv').click(function(){
		$('#lightbox').fadeIn(300);
		var img = 'icon_' + $(this).parent().parent().attr('id') + '.png';
		var atv = $(this).parent().parent().attr('id') + '/' + $(this).attr('data-atv') ;
		
		// console.log(atv)
		$('#lightbox .contAtv').html('<iframe src="conteudo/'+atv+'/index.html" width="1024" height="600" frameborder="0"></iframe>');
		$('#lightbox .ativities').show();
		$('#lightbox img').attr('src',"imagens/"+img);
	})
	
	$('#karaoke .btAtv').click(function(){
		$('#lightbox').fadeIn(300);
		var atv = $(this).attr('data-page') + '/' + $(this).attr('data-atv') ;
		$('#lightbox .contAtv').html('<iframe src="conteudo/'+atv+'/index.html" width="1024" height="600" frameborder="0"></iframe>');
		$('#lightbox .ativities').show();
	})
	
	$('.btCredito').click(function(){
		$('.pagina').fadeOut(300);
		$('#creditos').delay(300).fadeIn(300);
		$('#btHome').show();
	})
	
	$('.menuAudios .contBt').click(function(){
		$('.menuAudios .contBt .subMenu').hide();
		$(this).find('.subMenu').show();
		$('.menuAudios .contBt .bt').removeClass('btAtivoClick');
		$(this).find('.bt').addClass('btAtivoClick');
	})
	
	$('#audios .contAudios .btAudio').click(function(){
		if(!$tAudio){
			$tAudio = true;
			$('#audios .contAudios .btAudio').removeClass('ativo');
			$(this).addClass('ativo');
			
			tocaAudio('Track ' + $(this).find('span:eq(0)').html());
			$('.player .contPlayer  .nomeAudio').html('TRACK: ' + $(this).find('span:eq(0)').html());
		}
	})
	
	$('.video .contVideo').mouseenter(function(){
		$('.video .controls').animate({
			bottom: 0
		},150)
	})
	$('.video').mouseleave(function(){
		$('.video .controls').animate({
			bottom: '-60px'
		},300)
	})
	
}

function hideLightbox(){
	$('#lightbox').hide();
	$('#lightbox>div').hide();
	$('#lightbox .contAtv').html('');
	$('#lightbox .playerVideo').html('');
}


function tocaAudio(nome){
	$('#contPlayer').html('<audio >\
		<source src="tracks/'+nome+'.mp3" type="audio/mpeg">\
	</audio>');
	$iniPlay = true; 
	$('#contPlayer audio').on("canplay", function () {
		$tAudio = false;
		$duration = this.duration;
		$timeAudio = (parseInt(this.duration/60))+':'+parseInt(this.duration%60);
		if($iniPlay){
			$iniPlay = false;
			$('#contPlayer audio')[0].play()
			$('.player .btPlay').addClass('pause');
		}
	});
	$('#contPlayer audio').on('timeupdate', function() {
		$currentTime = this.currentTime;
		var max = $('.player .progress').width();
		var l = ($currentTime/$duration)*max;
		$('.player .progress .scrooler').show();
		if(l >= 4){
			$('.player .progress .barProgress').width(l);
			$('.player .progress .scrooler').css('left',(l-4)+'px');
		}else{
			$('.player .progress .barProgress').width(4);
			$('.player .progress .scrooler').css('left','0px');
		}
		$currentTime = this.currentTime;
		var m = parseInt($currentTime/60);
		var s = parseInt($currentTime%60);
		s = (s.toString().length > 1) ? s : '0'+s;
		$('.player .time').html(m+':'+s);
	});
	
	$('.player .progress .barProgress').width(0);
	$('.player .progress .scrooler').css('left','0px');
	$('#contPlayer audio')[0].volume = 1;
	$('.player .time').html('0:00s');
	
	$('.player .progress').off()
	$('.player .progress').click(function(evt){
		$pos = (evt.clientX - $(this).offset().left) / $(this).width();
		var max = $(this).width();
		var l = $pos*max;
		if(l >= 4){
			$('.player .progress .barProgress').width(l);
			$('.player .progress .scrooler').css('left',(l-4)+'px');
		}else{
			$('.player .progress .barProgress').width(4);
			$('.player .progress .scrooler').css('left','0px');
		}
		$('#contPlayer audio')[0].currentTime = $pos*$duration;
		var m = parseInt($currentTime/60);
		var s = parseInt($currentTime%60);
		s = (s.toString().length > 1) ? s : '0'+s;
		$('.player .time').html(m+':'+s);
	})
	
	$('.player .volume .barVolume').addClass('ativo');
	$('.player .volume').off();
	$('.player .volume').click(function(evt){
		var n  = parseInt( ( (evt.clientX - $(this).offset().left) / $(this).width() ) *5 )+1;
		$('.player .volume .barVolume' ).removeClass('ativo');
		$('.player .volume .barVolume:lt('+ n +')' ).addClass('ativo');
		$('#contPlayer audio')[0].volume = n/5;
	});
	
	$('.player .btPlay').off();
	$('.player .btPlay').click(function(){
		$(this).toggleClass('pause');
		if( $(this).hasClass('pause') ){
			$('#contPlayer audio')[0].play();
		} else {
			$('#contPlayer audio')[0].pause();
			
		}
	})
	
	$('.player .btVoltar').off();
	$('.player .btVoltar').addClass('pause');
	$('.player .btVoltar').click(function(){
		$('.player .btPlay').removeClass('pause');
		$('#contPlayer audio')[0].pause();
		$('#contPlayer audio')[0].currentTime = 0;
	})
}

function playVideo(nome){
	
	$('#lightbox').show();
	$('#lightbox .video').show();
	
	$('.video .playerVideo').html('<video id="myvideo" width="540" height="360" >\
			<source src="videos/'+nome+'.mp4" type="video/mp4"  />\
		</video>');
	$('.video .playerVideo video').on("canplay", function () {
		$duration = this.duration;
		$timeAudio = (parseInt(this.duration/60))+':'+parseInt(this.duration%60);
		$('.video .playerVideo video')[0].play()
	});
	$('.video .playerVideo video').on('timeupdate', function() {
		$currentTime = this.currentTime;
		var max = $('.video .controls .progress').width();
		var l = ($currentTime/$duration)*max;
		console.log(l);
		$('.video .controls .progress .barProgress').width(l);
		$currentTime = this.currentTime;
		var m = parseInt($currentTime/60);
		var s = parseInt($currentTime%60);
		s = (s.toString().length > 1) ? s : '0'+s;
		$('.video .controls .time').html(m+':'+s);
	});
	
	$('.video .playerVideo video')[0].volume = 1;
	$('.video .controls .time').html('0:00s');
	
	$('.video .controls .progress').off()
	$('.video .controls .progress').click(function(evt){
		$pos = (evt.clientX - $(this).offset().left) / $(this).width();
		var max = $(this).width();
		var l = $pos*max;
		$('.video .controls .progress .barProgress').width(l);
		$('.video .playerVideo video')[0].currentTime = $pos*$duration;
		var m = parseInt($currentTime/60);
		var s = parseInt($currentTime%60);
		s = (s.toString().length > 1) ? s : '0'+s;
		$('.video .controls .time').html(m+':'+s);
	})
	
	$('.video .controls .volume .barVolume').addClass('ativo');
	$('.video .controls .volume').off();
	$('.video .controls .volume').click(function(evt){
		var n  = parseInt( ( (evt.clientX - $(this).offset().left) / $(this).width() ) *5 )+1;
		$('.video .controls .volume .barVolume' ).removeClass('ativo');
		$('.video .controls .volume .barVolume:lt('+ n +')' ).addClass('ativo');
		$('.video .playerVideo video')[0].volume = n/5;
	});
	
	$('.video .controls .btPlay').off();
	$('.video .controls .btPlay').addClass('pause');
	$('.video .controls .btPlay').click(function(){
		$(this).toggleClass('pause');
		if( $(this).hasClass('pause') ){
			$('.video .playerVideo video')[0].play();
		} else {
			$('.video .playerVideo video')[0].pause();
			
		}
	})
	
	$('.video .controls .btVoltar').off();
	$('.video .controls .btVoltar').addClass('pause');
	$('.video .controls .btVoltar').click(function(){
		$('.video .controls .btPlay').addClass('pause');
		$('.video .playerVideo video')[0].currentTime = 0;
	})
	$('.video .controls .btAmpliar').off();
	$('.video .controls .btAmpliar').click(function(){
		var elem = document.getElementById("myvideo");
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	})
}
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

function getMousePos(canvas,evt) {
	var isiPad = navigator.userAgent.match(/iPad|iPhone/i) != null;
	if(isiPad == true){
		var touchPos = $stage.getTouchPosition();
		return {
			x: touchPos.x,
			y: touchPos.y
		};
	} else {
		var rect = canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
	}
}


function randomLetra(){
	var letras = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,Ç'.split(',');
	return letras[randomNumber(0,26)];
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

$player = '';


function resize(){
	var sW = $(window).width();
	$scale = sW/1024;
	$scale = 1;

	$('#tudo').css('transform','scale('+$scale+' , '+$scale+')');
	$('#tudo').css('transform-origin','0 0');

	$(window).resize(function(){
		var sW = $(window).width();
		$scale = sW/1024;
		$scale = 1;

		$('#tudo').css('transform','scale('+$scale+' , '+$scale+')');
	})
}

function hitTest ( obj , obj2 ) {
	var x1 = obj.getAbsolutePosition().x;
	var y1 = obj.getAbsolutePosition().y;
	var w1 = obj.getWidth();
	var h1 = obj.getHeight();
	var x2 = obj2.getAbsolutePosition().x;
	var y2 = obj2.getAbsolutePosition().y;
	var w2 = obj2.getWidth();
	var h2 = obj2.getHeight();
	
	
	if( x1+w1 >= x2 && x1 < x2+w2 && y1+h1 >= y2 && y1 < y2+h2  ){
		return true;
	} else {
		return false;
	}
	
}

function loadImages(sources, callback) {
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	
	for(var src in sources) {
		numImages++;
	}
	for(var src in sources) {
		images[src] = new Image();
		images[src].onload = function() {
			if(++loadedImages >= numImages) {
			  callback(images);
			}
		};
		images[src].src = sources[src];
	}
}

function draw(images) {
	$images = images;
	navegacao.init();
}

var sources = {
	bgGeral: 'imagens/bg_geral.jpg',
};

// loadImages(sources, function(images) {
	// draw(images);
// });
