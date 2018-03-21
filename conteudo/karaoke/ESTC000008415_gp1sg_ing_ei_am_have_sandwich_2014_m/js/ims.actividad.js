var laInterfaz = "";
var isiPad = navigator.userAgent.match( /iPad/i ) != null;
var isAndroid = navigator.userAgent.match( /Android/i ) != null;
var sonidos = new Array();
// --------------------
var url_interfaz = "";
var url_files = "";
var isKaraoke = 1;
var indexObj = "#karaoke_mp3";
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
var timeLine = 0;
var timePlayReady1 = 0;
var image_width = 0;
var image_height = 0;
var PosBtn2 = 0;
var tamExtraBarra = 0;
var inicio = false;
var volumen = 1;
var x_volumen = 100;
var click = (('ontouchend' in window)) ? 'touchend' : 'click';
var cont = 0;
var cont_ka = 0;

if ( typeof document != 'undefined' && document.readyState != 'complete' && window.addEventListener ) {
   window.addEventListener( 'DOMContentLoaded', function( e ) {
      init();
      $( "#visor" ).height( ( $( "#carcasa" ).height() - $( "#bottombar" ).height() ) );
      $( "#overall" ).height( ( $( "#carcasa" ).height() - $( "#bottombar" ).height() ) );

      window.addEventListener( "scroll", posicionar, false );
      window.addEventListener( "resize", posicionar, false );
      window.addEventListener( "load",  posicionar, false );

   }
   );
}
else{
   $( window ).ready( function(){
      init();
   }
   );
   $( window ).resize( function(){
      posicionar();
   }
   );
   $( window ).load( function(){
      posicionar();
   }
   );
   $( window ).scroll( function(){
      posicionar();
   }
   );
};


// ----------------------------------------------------
var posicionar = function() {
   ims.interfaz.resize();
   $("#visor").height($("#carcasa").height()-60);
};

$(document).ready(function() {
   ims.interfaz.resize();
});
// ----------------------------------------------------

// $( document ).ready( function() {
var init = function() {
   document.title = 'Santillana';
   if( $( "#url_interfaz" ).text() != "" ) {
      url_interfaz = $( "#url_interfaz" ).text();
   }
   $( "#url_interfaz" ).remove();
   if( $( "#url_files" ).text() != "" ) {
      url_files = $( "#url_files" ).text();
   }
   $( "#url_files" ).remove();

   $( ".ui-loader" ).remove();
   config_xml = $.parseXML( config_xml );

   var Interfaz = $( config_xml ).find( "tipoInterfaz" ).text();
   
 //  ims.interfaz.setWidthLimit( '' );
  // ims.interfaz.setHeightLimit( '' );
   ims.interfaz.init();
   inicializar();

   $( "#overall" ).remove();
   $( "#left2" ).remove();
   $( "#right2" ).remove();
   document.addEventListener( "touchmove", function( e ) {
      //e.preventDefault();
      return false;
   }
   , false );

   if ( isiOS ){
      $( "body" ).css( "margin-top", "-20px" );
   }
   if( $( config_xml ).find( "tipoInterfaz" ).text() == "tablet" ){
      tamExtraBarra = 14;
   }
};
// );

function inicializar() {
   $('#center').remove();
   // compruebo si existe introduccion para lanzar la pagina principal, en caso
   // de que no, cargamos la actividad
   timePlaying = 0;
   readyKaraoke = 0;
   readyCancion = 0;
   timePlayReady1 = 0 ;

   if ($('.positionbar').length == 1){
      $('#left').css('margin','0px');
   }

   if ( $( config_xml ).find( "introduccion" ).find( "texto1" ).text().length != 0 ) {
      $( config_xml ).find( "introduccion" ).each(
      function() {
         var IntTit = $( this ).find( "titulo" ).text();
         var IntTex = $( this ).find( "texto1" ).text();
         ims.interfaz.setTitle( IntTit );
         $( "#visor_content" ).append(
         "<div id=\"respuesta\" style=\" padding : 30px 0px; \">"
         + IntTex + "</div>" );
         var comenzar = $( config_xml ).find( "comenzar" ).text();
         ims.interfaz.addButton( "Siguiente", "right", "siguiente",
         comenzar );
         ims.interfaz.enable( "Siguiente" );
         ims.interfaz.bind( "Siguiente", 'nextPage()' );
      });
   }
   else {
      //cargar_actividad();
       setFirstInterface();
   }
}
;

// -------------------------------------------------------------------------
// Autor RCBL
// crea los conjuntos
function setFirstInterface(){
   // ---------------
   // Variables y propiedades
   // ---------------
   // funciones
   emptyStage();
   cargarCommunStage()        ;

   // ---------------
   // Titulo
   titulos = $( config_xml ).find( "titulo" ).toArray();
   // ---------------
   if( $( config_xml ).find( "tipoInterfaz" ).text() != "tablet" ){
      // ---------------
      // Subtitulo
      $( "#pregunta" ).html( $( config_xml ).find( "enunciado" ).text() );
      pantallas = "<div id=pantallaFondoGris></div>";
      pantallas = pantallas + "<div id=pantallaFondoBlanco>";
      pantallas = pantallas + "";
      pantallas = pantallas + "</div";
   }
   else{
      // ---------------
      // Subtitulo
      subtitulo = '<div class="pregunta">' + $( config_xml ).find( "enunciado" ).text() + '</div>';
      $( "#header" ).append( subtitulo);
      pantallas = "<div id=pantallaFondoBlanco>";
      pantallas = pantallas + "</div>";
      pantallas = pantallas + "<div id=pantallaFondoGris>";
      pantallas = pantallas + "</div";
   }
   $( '#fondo' ).append( pantallas );
   // ---------------
   // Imagen

   objFoto = $( config_xml ).find( "imagen" );

   if( objFoto.text() != "" ){
      if( url_files != "" ){
         img  = url_files + objFoto.text();

      }
      else{
         img  = "archivos/" + objFoto.text();
      }

      $( "<img/>" ).attr( "src", img ).load( function() {
         image_width = this.width;
         image_height = this.height;
         fondo_width = $( "#pantallaFondoBlanco" ).width();
         fondo_height = $( "#pantallaFondoBlanco" ).height();
         posX = ( fondo_width / 2 ) - ( image_width / 2 );
         posY = Math.abs( ( fondo_height / 2 ) - ( image_height / 2 ) );
        // $( "#pantallaFondoBlanco" ).css( "background-image", "url(" + img + ")" );


         // --------------------------------------
         // La posicion de la imagen
         resizeIMG();

      });
   }
   else{
      console.log( "no hay imagen desde el xml" )
   }

   // ---------------
   // Sonido
   if( url_files != "" ){
      snd  = url_files + objFoto.text();
   }
   else{
      snd  = "archivos/" + objFoto.text();
   }
   // ---------------
   // ponemos las canciones segun el listado de canciones

   if( $( config_xml ).find( "sonido2" ).text() == undefined || $( config_xml ).find( "sonido2" ).text() == "" ){
      sonidos[0]         = $( config_xml ).find( "sonido" ).text();
      sonidos[1]         = $( config_xml ).find( "sonido" ).text();
   }
   else if( $( config_xml ).find( "sonido" ).text() == undefined || $( config_xml ).find( "sonido" ).text() == "" ){

      sonidos[0]         = $( config_xml ).find( "sonido" ).text();
      sonidos[1]         = $( config_xml ).find( "sonido" ).text();
   }
   else{
      sonidos[0]         = $( config_xml ).find( "sonido2" ).text();
      sonidos[1]         = $( config_xml ).find( "sonido" ).text();

   }
   // ---------------
   // Audio
   resizeIMG();
   setAudio();
   // ---------------

  //$( "#visor" ).css( "padding-top", 30 + "px" );

   introduccion = $( config_xml ).find( "introduccion" ).text();
  // $( '#visor_content' ).css( "height", "400px" );
//   $( '#visor_content' ).css( "margin-top", "40px" );
   $( '#visor_content' ).css( "padding-bottom", "20px" );
   $( '#visor_content' ).css( "padding-right", "30px" );
   $( "#visor_content" ).append( introduccion );
   //$( '#content' ).height( ($( '#content' ).height() - 40) );
}
;
// -------------------------------------------------------------------------
function resizeIMG(){

   // ----------------------
   fondo_width = $( "#pantallaFondoBlanco" ).width();
   fondo_height = $( "#pantallaFondoGris" ).offset().top - $( "#h" ).height();
   // ------------------
   visor_padding_top = Number( $( "#visor" ).css( "padding-top" ).replace( "px", "" ) );
   cues_margin_top = 0;
   cues_height = $( "#cues" ).height();

   nuevo_fondo_height = fondo_height - $( "#header" ).height() - $( "hr" ).height() - 60;
   proporcion_fondo = nuevo_fondo_height / fondo_width;
   proporcion_image = image_height / image_width;
   image_width2 = ( nuevo_fondo_height * image_width ) / image_height;
   if( proporcion_image <= 1 ){
      if( image_width2 > fondo_width ){
         image_width2 = image_width;
      }
   }

      posX =   ( ( fondo_width ) / 2 ) - ( image_width2 / 2 );
      posY = ( ( fondo_height + $( "#header" ).height() + $( "hr" ).height() ) / 2 ) - ( ( image_width2 * proporcion_image ) / 2 );

   // ------------------
   $( "#pantallaFondoBlanco" ).css( "background-image", "url(" + img + ")" );
   // ----------------------
   //posicionamos los cues
   cuesH = $( "#cues" ).height();
   cuesW = $( "#cues" ).width();
   posX_cue = (( fondo_width ) / 2 ) - ( cuesW / 2 )-30;
   posY_cue =   $( "#fondo" ).height()  - cuesH;
   $( "#cues" ).css("margin-left",posX_cue);
   //$( "#cues" ).css("margin-top",posY_cue);

   posX_msgCarga = ( $( "#fondo" ).width()  / 2 ) - ( $( '#msgCarga' ).outerWidth()/ 2 );
   posY_msgCarga =  $( "#pantallaFondoGris" ).position().top+$( "#pantallaFondoGris" ).height()+45;
   $( '#msgCarga' ).css("left",posX_msgCarga);
   $( '#msgCarga' ).css("top",posY_msgCarga);
}
;
// -------------------------------------------------------------------------
function setAudio(){
   cargando =  silenciar = ( $( config_xml ).find( "cargando" ).text() ) ? $( config_xml ).find( "cargando" ).text() : "Cargando";
   str_msg_carga = "<div id='msgCarga' >Cargando</div>";
   //$( "#content" ).prepend( str_msg_carga );
   
   str_karaoke = '<audio id="karaoke_mp3">';
   str_cancion = '<audio id="cancion_mp3">';

   // ---------------
   // Sonido karaoke
   if( url_files != "" ){
      str_karaoke = str_karaoke + '<source src="'+url_files+sonidos[0]+'">';
   }
   else{
      str_karaoke = str_karaoke + '<source src="archivos/'+sonidos[0]+'">';
   }
   // ---------------
   // Sonido cancion
   if( url_files != "" ){
      str_cancion = str_cancion + '<source src="'+url_files+sonidos[1]+'">';
   }
   else{
      str_cancion = str_cancion + '<source src="archivos/'+sonidos[1]+'">';
   }
   str_karaoke = str_karaoke + '</audio>';
   str_cancion = str_cancion + '</audio>';
   $( "#visor_content" ).append( str_karaoke );

   $( "#visor_content" ).append( str_cancion );
   popcorn1 = Popcorn( "#karaoke_mp3" );
   popcorn2 = Popcorn( "#cancion_mp3" );
   var objPopCorn = [];

   objPopCorn[0] = popcorn1;
   objPopCorn[1] = popcorn2;

   // ---------------

   $( "#play" ).bind(click,function(){
      var tiempoOnPlay_Fecha = new Date();
        tiempoOnPlay = tiempoOnPlay_Fecha.getTime();
        $( this ).css( "display", "none" );
        $( "#pause" ).css( "display", "block" );
        $(indexObj)[0].play();
   });

   $( "#pause" ).bind(click,function(){
      if( readyCancion == 1 && readyKaraoke == 1 ){
         if( isKaraoke == 0 ){
            $( "#play" ).css( "display", "block" );
            $( this ).css( "display", "none" );
         }
         else{
            $( "#play" ).css( "display", "block" );
            $( this ).css( "display", "none" );
         }
         $( indexObj )[0].pause();
      }
   });

   $( "#mute" ).bind(click,function(){
      volumen = 0;
      $('#barra_int-vol').css('width','0%');
      $('#gutter-vol').css('left','0%');
      if( readyCancion == 1 && readyKaraoke == 1 ){
         $( '#karaoke_mp3' )[0].pause();
         $( '#cancion_mp3' )[0].pause();
         $( this ).css( "display", "none" );
         $( "#unmute" ).css( "display", "block" );
      }
   });

   $( "#unmute" ).bind(click,function(){
      volumen = 0.5;
      $('#barra_int-vol').css('width','50%');
      $('#gutter-vol').css('left','50%');
      if( readyCancion == 1 && readyKaraoke == 1 ){
         if( $( "#play" ).css( "display" ) == "none" ){
            suma = convertNumberToDecimals( timePlaying, 1, 10, 100 );
            $( indexObj )[0].play();
            $( indexObj )[0].currentTime = suma;
         }
         $( "#mute" ).css( "display", "block" );
         $( this ).css( "display", "none" );
      }
   });

   $( "#cancion" ).bind(click,function(){
      cont_ka++;
      $( "#radio2" ).addClass( "img_radioBtn_on" );
      $( "#radio2" ).removeClass( "img_radioBtn_off" );
      $( "#radio1" ).removeClass( "img_radioBtn_on" );
      $( "#radio1" ).addClass( "img_radioBtn_off" );

      if( readyCancion == 1 && readyKaraoke == 1 && isKaraoke == 1 ){
         isKaraoke = 0;
         if( $( '#karaoke_mp3' )[0].currentTime >= 0 ){
            $( '#cancion_mp3' )[0].currentTime = $( '#karaoke_mp3' )[0].currentTime;

         }
         if( $( "#play" ).css( "display" ) == "none" ){
            if( $( "#mute" ).css( "display" ) != "none" ){
               $( '#karaoke_mp3' )[0].pause();
               $( '#cancion_mp3' )[0].play();
            }
         }
         else{
            $( '#karaoke_mp3' )[0].pause();
            $( '#cancion_mp3' )[0].pause();
         }
      }
   });

   $( "#karaoke" ).bind(click,function(){
      cont_ka++;
      $( "#radio1" ).addClass( "img_radioBtn_on" );
      $( "#radio1" ).removeClass( "img_radioBtn_off" );
      $( "#radio2" ).removeClass( "img_radioBtn_on" );
      $( "#radio2" ).addClass( "img_radioBtn_off" );

      if( readyCancion == 1 && readyKaraoke == 1){
         isKaraoke = 1;
         if( $( '#cancion_mp3' )[0].currentTime >= 0 ){
            $( '#karaoke_mp3' )[0].currentTime = $( '#cancion_mp3' )[0].currentTime;
         }
         if( $( "#play" ).css( "display" ) == "none" ){
            if( $( "#mute" ).css( "display" ) != "none" ){
               $( '#cancion_mp3' )[0].pause();
               $( '#karaoke_mp3' )[0].play();        
            }
         }
         else{
            $( '#karaoke_mp3' )[0].pause();
            $( '#cancion_mp3' )[0].pause();
         }
      }
   });
   // ---------------
   changeCues();
   // ---------------
   progressbar_margin_left =  Number( $( "#progressbar" ).css( "margin-left" ).replace( "px", "" ) );
   progressbar_border_width = Number( $( "#progressbar" ).css( "border-width" ).replace( "px", "" ) );
   $( "#progressbar" ).live( "mousedown", function( e ) {
      if( (e.which == 1) ) {
            if( readyCancion == 1 && readyKaraoke == 1 ){
               resetCues();
               tmp_x = e.pageX;
               if( checked == 0 ) {
                  dragging = true;
                  draggingObj = $( "#btn_barra" );
               }
               move( draggingObj, tmp_x , e.pageX );

            }
         }
      }
   );

   itemWidth = $( "#btn_barra" ).width();
   mitadItemWidth = ( itemWidth / 2 );
   if( laInterfaz == "tablet" ){
      tamExtraBarra = 14;
   }
   if( laInterfaz == "misletras" ){
      tamExtraBarra = mitadItemWidth;
   }
   posicionInicioBarraSup = $( '#progressbar' ).offset().left;
   posicionFinalBarraSup =  $( '#progressbar' ).offset().left + $( '#progressbar' ).width() - ( Number( $( '#progressbar' ).css( "border-left-width" ).replace( "px", "" ) ) * 2 );
   $( "#barra_int" ).css( "left", $( "#progressbar" ).css( "left" ) );
   $( "#btn_barra" ).css( "left", $( "#progressbar" ).css( "left" ) );
   // ---------------
   timeLine = window.setInterval( funcTimeLine, 100  );
   // Usaremos esta linea de tiempo tambien para los cue point
   $( ".titulo" ).bind(click,function(){
      // alert( "readyCancion = " + readyCancion + " readyKaraoke = " + readyKaraoke + "\nmyVideo1 = " + $( '#karaoke_mp3' )[0].readyState + " myVideo2 = " + $( '#cancion_mp3' )[0].readyState ); //
      // console.log( "karaoke_mp3 = " + $( '#karaoke_mp3' )[indexObj].currentTime + " indexObj = " + indexObj )
      window.clearInterval( timeLine );
      console.log( "//--------Paramos---------//" );
   }
   );
}
// -------------------------------------------------------------------------
function funcTimeLine(  ) {
   // --------------------------------------
   // propiedades de la linea de tiempo
   indexObj = ( isKaraoke == 1 ) ? "#karaoke_mp3" : "#cancion_mp3";
   // --------------------------------------
   // Listener readyState 1
   if( $( '#karaoke_mp3' )[0].readyState >= 2 ){
      readyKaraoke = 1;

   }
   ;
   // --------------------------------------
   // Listener readyState 2
   if( $( '#cancion_mp3' )[0].readyState >= 2 ){
      readyCancion = 1;

   }
  // console.log( "readyKaraoke = " + $( '#karaoke_mp3' )[0].readyState + " " + "readyCancion = " + $( '#cancion_mp3' )[0].readyState );
   // --------------------------------------
   // �apa para que arranquen bien los sonidos y el readyState se ponga en 4
   if( readyCancion == 1 && readyKaraoke == 1 ){

      if( timePlayReady1 == 2 ){
         if (isiOS){
            $( '#karaoke_mp3' )[0].play();
         }
      }
      if( timePlayReady1 == 4 ){
         $( '#karaoke_mp3' )[0].pause();
         $( '#karaoke_mp3' )[0].currentTime = 0;
      }
      if( timePlayReady1 == 6 ){
         if (isiOS){
            $( '#cancion_mp3' )[0].play();
         }
      }
      if( timePlayReady1 == 8 ){
         $( '#cancion_mp3' )[0].pause();
         $( '#cancion_mp3' )[0].currentTime = 0;
      }

      if( timePlayReady1 < 10 ){
         timePlayReady1 ++ ;
         posicionar();
         $( "#barra_int" ).width( 0 );
      }else{
         if ($('#msgCarga').length > 0){
            $( '#msgCarga' ).remove();
            ims.interfaz.disable( "play" );            
         }else{
            ims.interfaz.enable( "play" );            
         }        
      }
      $( '#karaoke_mp3' )[0].volume = volumen;
      $( '#cancion_mp3' )[0].volume = volumen;
   }
   // --------------------------------------
   // La barra de sonido

   if( $( "#play" ).css( "display" ) == "none" ){
      timePlaying ++ ;
   }
   seg = timePlaying / 10;
   if( $( "#mute" ).css( "display" ) == "none" ){
      $( '#karaoke_mp3' )[0].currentTime = seg;
      $( '#cancion_mp3' )[0].currentTime = seg;
   }
   // --------------------------------------
   itemWidth = $( "#btn_barra" ).width();
   mitadItemWidth = ( itemWidth / 2 );
   posicionInicioBarraSup = $( '#progressbar' ).offset().left;
   posicionFinalBarraSup =  $( '#progressbar' ).offset().left + $( '#progressbar' ).width() - ( Number( $( '#progressbar' ).css( "border-left-width" ).replace( "px", "" ) ) * 2 );


   duracion_karaoke = Number( $( '#karaoke_mp3' )[0].duration );
   duracion_cancion = Number( $( '#cancion_mp3' )[0].duration );

   setTimeout(function() {
      if (indexObj == '#karaoke_mp3'){
         var duracion_total = conver_sec(duracion_karaoke);
      }else{
         var duracion_total = conver_sec(duracion_cancion);
      }
      if (duracion_total == '0NaN'){
         $('#timer').text('00:00');
      }else{
         $('#timer').text(duracion_total);
      }
   }, 2000);

   progressbar_width = $( "#progressbar" ).width();
   btn_barra_width = $( "#btn_barra" ).width();

   tam_lapso_barra = $( "#progressbar" ).width() - itemWidth;
   draggingObj = $( "#btn_barra" );

   // PosBtn2 = 0;
   if( ! dragging && $( "#play" ).css( "display" ) == "none" ){
      porcentajeCancion = ( seg * 100 ) / $( indexObj )[0].duration;
      PosBtn = ( porcentajeCancion * tam_lapso_barra ) / 100;
      $( "#barra_int" ).width( PosBtn  + tamExtraBarra );
      // PosBtn2 = posicionInicioBarraSup + mitadItemWidth + PosBtn;
      //$('#header p').text(conver_sec($( '#karaoke_mp3' )[0].currentTime));
      var tiempo_llevado = conver_sec($( '#karaoke_mp3' )[0].currentTime);
      $('#changeTime').text(tiempo_llevado);
      PosBtn2 = PosBtn ;
      draggingObj.css( "left", PosBtn2 + "px" );
   }
   else{
      if( $( "#btn_barra" ).css( "left" ) != "auto" ){
         posicionDragObj = ( Number( $( "#btn_barra" ).css( "left" ).replace( "px", "" ) )  );
      }
      else{
         posicionDragObj = 0;
      }

      tamBarraInterior =   posicionDragObj;

      $( "#barra_int" ).width( tamBarraInterior + tamExtraBarra  );

      if( ( ( tamBarraInterior * 100 ) / tam_lapso_barra ) < 0 ){
         x1 = 0;
      }
      else{
         x1 = ( tamBarraInterior * 100 ) / tam_lapso_barra;
      }
      x2_a = ( x1 * duracion_karaoke ) / 100;
      x2_b = ( x1 * duracion_cancion ) / 100;
      if( $( '#karaoke_mp3' )[0].readyState == 4 ){
         $( '#karaoke_mp3' )[0].currentTime = x2_a;
      }
      if( $( '#cancion_mp3' )[0].readyState == 4 ){
         $( '#cancion_mp3' )[0].currentTime = x2_b;
      }
      
      timePlaying = convertNumberToDecimals( $('#karaoke_mp3')[0].currentTime, 1, 10, 1 );

      // console.log( suma_txt );
      if( dragging ) {
         dragging = false;
      }
   }

   // -----------------------
   // Cuando llegamos al final de la barra basado en karaoke reiniciamos el sistema
   if( convertNumberToDecimals( $( indexObj )[0].duration, 1, 10, 1 ) == timePlaying ){
      location.reload();
   }
   // -----------------------
   // Cuando terminan de ponerse los cues, los sacamos del stage
   if( ( arr[( arr.length - 1 )][0] + 5 ) < ( timePlaying / 10 ) ){
      $( "#contentCues" ).css( "top", $( "#cues" ).height() + "px" );
   }

}

// -------------------------------------------------------------------------
function changeCues(){
   numTime1 = 0;
   numTime2 = 0;
   textCue = [];
   timesCue = [];
   str_cues = "<div id='cues'></div'>";
   $( "#visor_content" ).append( str_cues );
   $( "#cues" ).css("margin-top",331);
   str_cues = "<div id='contentCues'></div'>";
   $( "#cues" ).append( str_cues );

   cantidad_renglones = 3;
   ayuda_txt = 0;
   ayuda_top = - 5;
   alto_text_k = 30;


   var times = new Array();
   times = $( config_xml ).find( "elemento" ).toArray();
   pezGordo = 0;
   f1 = 0;

   // -----------------------------------------------------

   for( i = 0; i < times.length; i ++ ){
      arr[i] = [Number( $( times[i] ).attr( 'time' ) ), $( times[i] ).text()];
   }
   // ---------------------------------------------------
   arr.sort( function( a, b )
   {
      if ( a[0] == b[0] ) return 0;
      return a[0] < b[0] ? - 1 : 1;
   }
   );
   // ---------------------------------------------------
   j2_l = $( "#cues" ).height() - $( "#cue_on_karaoke_0"  ).height();
   for( i = 0; i < arr.length; i ++ ){

      // 5
      str_txt = "<span id='cue_on_karaoke_"+i+"' class='cue_in'>" + arr[i][1] + "</span'>";
      $( "#contentCues" ).append( str_txt );


      posicion_inicio = ( $( "#cues" ).height() / cantidad_renglones );

      j2_l = j2_l - alto_text_k;

      arr[i][2] = j2_l - alto_text_k + ayuda_txt;

      // NO BORRAR
      //            arr[i][3] = $( "#cue_on_karaoke_" + i ).height();
      //            arr[i][4] = "#cue_on_karaoke_" + i;
      //            arr[i][4] = "j2_l = " + j2_l;
      //            arr[i][5] = "alto_text_k = " + alto_text_k;
      //      for( j = 0; j < arr[i].length; j ++ ){
      //         console.log( "arr[" + i + "][" + j + "] = " + arr[i][j] );
      //      }
      $( "#cue_on_karaoke_" + i ).height( alto_text_k );
   }
   // -----------------------------------------------------
   for( i = 0; i < arr.length; i ++ ){
      altoCues = 0;
      // posicion_inicio = 0;
      posicion_inicio = ( ( $( "#cues" ).height() / cantidad_renglones ) * 2 ) - ayuda_top;
      posicionCue =  posicion_inicio + altoCues;
      altoCues = altoCues + alto_text_k;
      centroCues  = ( $( "#fondo" ).width() / ( cantidad_renglones - 1 ) ) - ( $( "#contentCues" ).width() / 2 ) -  Number( $( "#visor" ).css( "padding-left" ).replace( "px", "" ) );
      $( "#contentCues" ).css( "top", posicionCue + "px" );
   }
   // -----------------------------------------------------
   for( i = 0; i < arr.length; i ++ ){
      seg = convertNumberToDecimals( arr[i][0], 1000, 100, 100 );
      arr[i][3] = seg;
      altoCues = 0;
      posicion_inicio = 0;
      // -------------------------------
      // str_txt = "<span id='cue_on_karaoke_"+i+"' class='cue_in'>" + textCue[i] + "</span'>";
      // $( "#contentCues" ).append( str_txt );
      alto_text_k = $( "#cue_on_karaoke_" + i ).height();

      posicion_inicio = $( "#cues" ).height() - alto_text_k;
      posicionCue =  posicion_inicio + altoCues;
      altoCues = altoCues + alto_text_k;
      // $( "#contentCues" ).css( "top", posicionCue + "px" );
      var f1 = 0;
      if( seg > 0 ){
         // -------------------------------
         // Cue karaoke
         popcorn1.cue( seg, function( lg, SS ) {

            //                  var tiempoOnInterval = new Date();
            //                  tiempoOnInterval = tiempoOnInterval.getTime();
            //                  stateCan = "-------------------------------";
            //                  stateCan = stateCan + "\n seg f1 = " + f1;
            //                  stateCan = stateCan + "\n seg arr[f1][0] = " + arr[f1][0];
            //                  stateCan = stateCan + "\n seg arr[f1][1] = " + arr[f1][1];
            //                  stateCan = stateCan + "\n seg arr[f1][2] = " + arr[f1][2];
            //                  stateCan = stateCan + "\n seg arr[f1][3] = " + arr[f1][3];
            //                  stateCan = stateCan + "\n seg arr[f1][3]-1 = " + ( arr[f1][3] - 1 );
            //                  stateCan = stateCan + "\n tiempoOnInterval = " + tiempoOnInterval;
            //                  stateCan = stateCan + "\n tiempoOnPlay = " + tiempoOnPlay;
            //                  stateCan = stateCan + "\n diferencia = " + ( tiempoOnInterval - tiempoOnPlay );
            // console.log( stateCan );

            //console.log('f1: '+f1);
            //console.log('arr[f1]: '+arr[f1]);
            if( typeof(arr[f1] )!= 'undefined' ){
            	f1++;

               $( ".cue_in" ).each( function(){
                  $( this ).removeClass( "cue_in_on" );
                  $( this ).height( alto_text_k );
               }
               );

               // buscamos el indice para iluminar

               for ( j = 0; j < arr.length; j ++ )
               {
                  if( SS.start == arr[j][3] ){
                     $( "#cue_on_karaoke_" + j ).addClass( "cue_in_on" );
                     if (!isMobile || window.screen.availWidth > 1800){
                        $( "#contentCues" ).css( "top", ( arr[j][2] + ayuda_top) + "px" );
                     }else{
                        $( "#contentCues" ).css( "top", ( arr[j][2] + ayuda_top + 1.85*j) + "px" );     
                     }

                     if( $( ".cue_in_on" ).css( "padding-top" ) != undefined ){
                        padding_top_cue_in_on = alto_text_k - Number( $( ".cue_in_on" ).css( "padding-top" ).replace( "px", "" ) );
                     }
                     else{
                        padding_top_cue_in_on = alto_text_k;
                     }
                     if ($('#positionbar').length == 0){
                        $( "#cue_on_karaoke_" + j ).height( padding_top_cue_in_on );
                     }else{
                        $( "#cue_on_karaoke_" + j ).height( padding_top_cue_in_on + 5 );
                     }
                  }
               }
            }

         }
         );
         // -------------------------------
         // cue cancion
         popcorn2.cue( seg, function( lg, SS ) {

            //                  var tiempoOnInterval = new Date();
            //                  tiempoOnInterval = tiempoOnInterval.getTime();
            //                  stateCan = "-------------------------------";
            //                  stateCan = stateCan + "\n seg f1 = " + f1;
            //                  stateCan = stateCan + "\n seg arr[f1][0] = " + arr[f1][0];
            //                  stateCan = stateCan + "\n seg arr[f1][1] = " + arr[f1][1];
            //                  stateCan = stateCan + "\n seg arr[f1][2] = " + arr[f1][2];
            //                  stateCan = stateCan + "\n seg arr[f1][3] = " + arr[f1][3];
            //                  stateCan = stateCan + "\n seg arr[f1][3]-1 = " + ( arr[f1][3] - 1 );
            //                  stateCan = stateCan + "\n tiempoOnInterval = " + tiempoOnInterval;
            //                  stateCan = stateCan + "\n tiempoOnPlay = " + tiempoOnPlay;
            //                  stateCan = stateCan + "\n diferencia = " + ( tiempoOnInterval - tiempoOnPlay );
            // console.log( stateCan );

            //                  valCurrentTime = Math.floor( popcorn2.currentTime() ) - 1
            if( typeof (arr[f1]) != "undefined"){

               $( ".cue_in" ).each( function(){
                  $( this ).removeClass( "cue_in_on" );
               }
               );

               // buscamos el indice para iluminar

               for ( j = 0; j < arr.length; j ++ )
               {
                  if( SS.start == arr[j][3] ){
                     $( "#cue_on_karaoke_" + j ).addClass( "cue_in_on" );
                     if (!isMobile || window.screen.availWidth > 1800){
                        $( "#contentCues" ).css( "top", ( arr[j][2] + ayuda_top) + "px" );
                     }else{
                        $( "#contentCues" ).css( "top", ( arr[j][2] + ayuda_top + 1.85*j) + "px" );
                     }

                     if( $( ".cue_in_on" ).css( "padding-top" ) != undefined ){
                        padding_top_cue_in_on = alto_text_k - Number( $( ".cue_in_on" ).css( "padding-top" ).replace( "px", "" ) );
                     }
                     else{
                        padding_top_cue_in_on = alto_text_k;
                     }
                     /*if ($('#positionbar').length == 0){
                        $( "#cue_on_karaoke_" + j ).height( padding_top_cue_in_on );
                     }else{
                        $( "#cue_on_karaoke_" + j ).height( padding_top_cue_in_on + 5 );
                     }*/
                  }
               }
            }
         }
         );
      }
   }
};
// -------------------------------------------------------------------------
function resetCues(){
   $( ".cue_in" ).each( function( i ){
      // $( this ).height( alto_text_k );
      $( this ).removeClass( "cue_in_off" );
      $( this ).removeClass( "cue_in_on" );
      $( this ).css( "top", arr[i][2] );
   }
   );
   $( "#contentCues" ).css( "top", ( posicionCue + alto_text_k ) + "px" );
}
// -------------------------------------------------------------------------
function resetele( obj ) {
   $( "#" + obj.attr( "posicion" ) ).attr( "rel", "-1" );
   obj.attr( "posicion", "-1" );
}
// -------------------------------------------------------------------------
function move( obj, x, e_pageX ) {
   if( dragging ) {
      $( "#contentCues" ).css( "top", $( "#cues" ).height() + "px" );
      obj.css( "position", "relative" );
      mitadItemWidth = ( draggingObj.width() / 2 );
      inicio = $( "#play" ).offset().left - $( "#content" ).offset().left + progressbar_margin_left;
      posicionInicioBarraSup = $( '#progressbar' ).offset().left - Number( $( '#progressbar' ).css( "border-left-width" ).replace( "px", "" ) );
      posicionFinalBarraSup = $( '#progressbar' ).offset().left + $( '#progressbar' ).width();
      a_1 = parseInt( x ) - posicionInicioBarraSup;
      if( e_pageX > posicionInicioBarraSup && e_pageX < posicionFinalBarraSup ){
         obj.css( "left", a_1  + "px" );
      }
   }
}
// -------------------------------------------------------------------------

function convertNumberToDecimals( numberToConvert, question, numberEnters, numberDecimals ){
   seg2 = numberToConvert / question;
   seg2 = seg2 * numberEnters;
   seg2 = Math.floor( seg2 );
   seg2 = seg2 / numberDecimals;
   return seg2;
}

// -------------------------------------------------------------------------
function emptyStage(){
   window.clearInterval( timeLine );
   $( "#center" ).height( 0 );
   $( "#center" ).empty();
   $( "#fondo" ).css( "background", "" );
   $('#msgCarga').remove();
   $('#contentCues');
   $( "#visor_content" ).remove();
   $( "#respuesta" ).empty();
   $( "#right" ).empty();
   $( "#left" ).empty();
   $( "#fondo" ).empty();

   $('#header p').remove();
   $('#pregunta p').remove();

   $( '.tooltip' ).remove();
   $( "#visor" ).append( '<div id="visor_content"></div>' );
}
// --------------------------------------------------------------
function cargarCommunStage(){
   // ------------------------
   ims.interfaz.setTitle( $( config_xml ).find( "titulo" ).text() );

   volver = ( $( config_xml ).find( "volver" ).text() ) ? $( config_xml ).find( "volver" ).text() : "Volver a empezar";
   play = ( $( config_xml ).find( "btn_play" ).text() ) ? $( config_xml ).find( "btn_play" ).text() : "Reproducir";
   pausar = ( $( config_xml ).find( "pausar" ).text() ) ? $( config_xml ).find( "pausar" ).text() : "Pausar";

   cancion = ( $( config_xml ).find( "song_label" ).text() ) ? $( config_xml ).find( "song_label" ).text() : "Cancion";
   karaoke = ( $( config_xml ).find( "karaoke_label" ).text() ) ? $( config_xml ).find( "karaoke_label" ).text() : "Karaoke";


   // ---------------
   // barra de sonido

   ims.interfaz.addButton( "play", "left", "play", play );
   ims.interfaz.addButton( "pause", "left", "pause",  pausar );

   barra_str = "<div id='barra_sup'><span id='changeTime'>00:00</span><div id='progressbar'>";
   barra_str = barra_str + "<div id='barra_int'></div>";
   barra_str = barra_str + "<div id='btn_barra'><div id='punto'></div></div>";
   barra_str = barra_str + "</div><span id='timer'></span>";
   if ($('.positionbar').length > 0){
      $('#visor').append('<div id="pbr"></div>');
      $('#pbr').css({"position":"absolute","height":"20px","bottom":"65px","width":"100%","left":"35px","opacity":"0","filter":"alpha(opacity = 0)"});
      $("#pbr").append(barra_str);
      $('#barra_sup').css('width','91%')
   }else{
      $("#left").append(barra_str);
   }

   if (!isMobile){
      ims.interfaz.addButton( "mute", "left", "silenciar",  ( $( config_xml ).find( "silenciar" ).text() ) ? $( config_xml ).find( "silenciar" ).text() : "Silenciar" );
      ims.interfaz.addButton( "unmute", "left", "silenciar_on",   ( $( config_xml ).find( "silenciar" ).text() ) ? $( config_xml ).find( "silenciar" ).text() : "Silenciar" );
      ims.interfaz.enable( "mute" );
      ims.interfaz.enable( "unmute" );
   }

   btnKaraoke = "<div id='karaoke' class='radioGraper'><div id='radio1' class='img_radioBtn_on'></div><span class='karaoke'>" + karaoke + "</span></div>";
   $( "#right" ).append( btnKaraoke );

   btnCancion = "<div id='cancion' class='radioGraper'><div id='radio2' class='img_radioBtn_off'></div><span class='cancion'>" + cancion + "</span></div>";
   $( "#right" ).append( btnCancion );

   $( "#visor" ).click( function(){
        if ($('.positionbar').length > 0){
          $('#pbr').css('opacity','1');
          setTimeout(function() {
             $('#pbr').css('opacity','0');
          }, 5000);
        }
    });
   $('#changeTime').css('display','none');
   $('#timer').css('display','none');

   var volum = $("<div/>").attr("id","volumen");
   var conVol = $("<div/>").attr("id","control");
   var growVol = $("<div/>").attr("id","barra_int-vol").css("width","90%");
   var gutVol = $("<div/>").attr("id","gutter-vol").css("left","90%");
   conVol.append(growVol,gutVol);
   volum.append(conVol);

   $(volum).insertAfter('#mute');
   $(volum).insertAfter('#unmute');

   $("#gutter-vol").live({
      mousedown:function(){
         volDrag = true;
      }
   });

   $(document).bind({
     mousemove:function(event){
      if (!isMobile){
      x_volumen = event.pageX-$("#control").offset().left;
      if(volDrag==true)
       if(parseInt($("#control").offset().left)>event.pageX){
        $("#muted").trigger("click");
        volDrag = false;

       }else{
        
        if($("#muted").hasClass("silenciar_on") && x>0){
         $("#muted").trigger("click");

        }
       }
       if((parseInt($("#control").offset().left)+parseInt($("#control").outerWidth(true)))<event.pageX)
        volDrag=false;

       
      if(volDrag==true){

       $("#gutter-vol").css({
        left: x_volumen+"%"
       }).prev().css({
        width:x_volumen+"%"
       });
         indexObj = ( isKaraoke == 1 ) ? "karaoke_mp3" : "cancion_mp3";
        //audio = document.getElementById("karaoke");
        if (x_volumen < 1){
         $('#unmute').css('display','block');
         $('#mute').css('display','none');
         volumen = 0;
         document.getElementById(indexObj).volume = 0;
        }else{
         $('#unmute').css('display','none');
         $('#mute').css('display','block');
         document.getElementById(indexObj).volume = x_volumen/100;
         volumen = document.getElementById(indexObj).volume;
        }
        if (x_volumen > 0){
         document.getElementById(indexObj).volume = x_volumen/100;
         volumen = document.getElementById(indexObj).volume;
         if ($('#play').css('display') != 'block'){
            $('#karaoke_mp3')[0].play();
         }
         
        }
        
         $( '#cancion_mp3' )[0].volume = volumen;
         $( '#karaoke_mp3' )[0].volume = volumen;

         if (document.getElementById(indexObj).readyState == 1 && $('#pause').css('display') == 'block'){
            //document.getElementById(indexObj).play();
            $('#karaoke_mp3')[0].play();
         }
      }
      }
     },
     mouseup:function(){
      volDrag=false;
     },
    });
   var volTime = [];
   var volDrag = false;

   //btnKaraoke = "<div id='karaoke' class='radioGraper'><div id='radio1' class='img_radioBtn_on'></div><span class='karaoke'>" + karaoke + "</span></div>";
   //$( "#right" ).append( btnKaraoke );

   //btnCancion = "<div id='cancion' class='radioGraper'><div id='radio2' class='img_radioBtn_off'></div><span class='cancion'>" + cancion + "</span></div>";
   //$( "#right" ).append( btnCancion );

   if( $( config_xml ).find( "tipoInterfaz" ).text() != "secundaria" ){
      ims.interfaz.addButton( "reload2", "right", "reiniciar",    volver );
   }

   ims.interfaz.enable( "karaoke" );
   ims.interfaz.enable( "cancion" );

   ims.interfaz.enable( "pause" );
   ims.interfaz.enable( "reload2" );
   $( "#unmute" ).css( "display", "none" );
   $( "#pause" ).css( "display", "none" );
   ims.interfaz.bind( "reload2", "inicializar()" );
   
   //ims.interfaz.resize();
}

function karaoke2(){
   $('#karaoke').css('display','none');
   $('#cancion').css('display','block');
}

function cancion2(){
   $('#karaoke').css('display','block');
   $('#cancion').css('display','none');
}

function conver_sec(seconds) {
   sec = Math.floor( seconds );    
   min = Math.floor( sec / 60 );
   min = min >= 10 ? min : '0' + min;    
   sec = Math.floor( sec % 60 );
   sec = sec >= 10 ? sec : '0' + sec;    
   return min + ':' + sec;
}