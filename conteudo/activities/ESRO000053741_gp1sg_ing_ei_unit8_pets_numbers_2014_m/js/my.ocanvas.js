/*!
 * my.oCanvas v0.0.1
 *
 * Borja Pérez González.
 */



var move = false,drag="",row=[],target=[],magnetismo=false,canvas;

		var drawing = function(){
			
			objCanvas = new Array();
			objCanvasHots = new Array();
			objeto = this;
			options= {
				"color":"#f00",
				"stroke" : "10px"
			}

			this.init = function(){
				$("body").append('<canvas id="canvas" width="'+$("#limit").width()+'" height="'+$("#limit").height()+'">This text is displayed if your browser does not support HTML5 Canvas.</canvas>');
				oCanvas.domReady(function(){
					canvas = oCanvas.create({
						canvas: "#canvas"
					});
				});
			},

			this.drawLine = function(iniX,iniY,endX,endY,myData,myColor,myStroke,myImage,myId,setLine){
				var linea = canvas.display.line({
					start: { x: iniX, y: iniY },
					end: { x: endX, y: endY },
					stroke: myStroke+" "+myColor,
					cap: "round"
				});
				row = linea;
				var objects = new Array();
				if(setLine==true){
					if(typeof(myImage) != "undefined"){
						var triangle = this.drawImage(endX,endY,"center","center",myImage,false,true,true,myData);
					}else{
						var triangle = this.drawPolygon(endX,endY,3,10,(this.getAngle(iniX,iniY,endX,endY)),myColor,false,true,true,myData);
					}
				
					triangle.lines = linea;
					triangle.staticX=endX;
					triangle.staticY=endY;
					triangle.id=myId;
					objects[1] = triangle;
				}
				
				objects[0] = linea;
				

				objCanvas[linea.id] = objects;
				if(setLine==true){
					canvas.addChild(linea);
					canvas.addChild(triangle);
				}else{
					canvas.addChild(linea);
					return linea;
				}
			},
			/* Propiedades del polígono
			 * myX : posición X.
			 * myY : posición Y.
			 * myOriginX : posición eje X.
			 * myOriginY : posición eje Y.
			 * myImage : número de lados.
			 * setImage : dibujar polígono.
			 * dragging : habilitar "dragAndDrop"
			 */
			this.drawImage = function(myX,myY,myOriginX,myOriginY,myImage,setImage,dragging,unbind,myData){
				var imagen = canvas.display.image({
					x: myX,
					y: myY,
					origin: { x: myOriginX, y: myOriginY },
					image: myImage
				});
				
				imagen.check = false;
				imagen.putTarget = false;
				imagen.myData=myData;
				if(dragging && dragging==true){

					if(isMobile){
						imagen.bind("tap",function(){
							console.log(this.putTarget)
							if(drag==""){
								if(typeof(this.compareData)!="undefined"||this.compareData!=""){
									this.img = imgRemAzul;

									drag = this;
									canvas.redraw();
								}
							}else{
								if(this.putTarget==false)
									return;
									drag.img = imgAzul;
									drag.compareData = imagen.myData;
									var myLines = drag.lines;
									myLines.end.x = this.x;
									myLines.end.y = this.y;
									drag.y = this.y;
									drag.x = this.x;
									canvas.redraw();

									drag.putTarget=true;
									drag = "";
								
							}
							canvas.redraw();
						});
						imagen.bind("dbltap",function(){
							imagen.img = imgAzul;
							imagen.compareData = "",imagen.intersect = false;
							this.putTarget = false;
							var myLines = imagen.lines;
							myLines.end.x = imagen.staticX;
							myLines.end.y = imagen.staticY;
							imagen.y = imagen.staticY;
							imagen.x = imagen.staticX;

							drag = "";
							canvas.redraw();
						});
					}else{
						imagen.dragAndDrop({
							changeZindex:true,
							start:function(){
								drag = this,target.rowHover = false;
								row = this.lines;
							},
							move:function(){
								row.end.x = imagen.x;
								row.end.y = imagen.y;
								objeto.setAngle( imagen.x, imagen.y)
								canvas.redraw();
							},
							end:function(){
								imagen.compareData = target.myData;
								
								if(magnetismo==false)
									target.rowHover = true;

								if(target.rowHover==false)
									objeto.reset();
						
								target.rowHover = false, move = false,drag = [], row = [],target = [];
							}
						});
					}
					
				}else{
					if(!unbind || unbind==false){
						console.log(myData)
						objCanvasHots[myData] = imagen;
						if(isMobile){
							imagen.bind("tap",function(){
								if(drag!=""){
									drag.img = imgAzul;
									drag.putTarget=true;
									drag.compareData = imagen.myData;

									var myLines = drag.lines;
									myLines.end.x = this.x;
									myLines.end.y = this.y;
									drag.y = this.y;
									drag.x = this.x;
									canvas.redraw();

									drag = "";
								}

								if($(".jspPane").length==0 && typeof(canvas)!="undefined"){
									if($(".jspPane").height()<$("#visor").height()){
										canvas.height = $("#visor").height();
									}else{
										canvas.height = $(".jspPane").height();
									}
								}
								if(typeof(canvas)!="undefined")
									canvas.redraw();
							});
							imagen.bind("touchend",function(){
									canvas.redraw();
							});
						}else{

							document.addEventListener("mousemove",function(){
								if(imagen.isPointerInside()==true){
									imagen.rowHover = true;
									target = imagen;
								}else{
									imagen.rowHover = false;
								}
							});
						}
					}
				}
				if(setImage && setImage==true){
					canvas.addChild(imagen);
				}else{
					return imagen;
				}
			},
			/* Propiedades del polígono
			 * myX : posición eje X.
			 * myY : posición eje Y.
			 * mySides : número de lados.
			 * myRadius : radio.
			 * myRotation : ángulo de rotación [this.getAngle(iniX,iniY,endX,endY)].
			 * myColor : color de fondo [hexadecimal].
			 * setPolygon : dibujar polígono.
			 * dragging : habilitar "dragAndDrop"
			 */
			this.drawPolygon = function(myX,myY,mySides,myRadius,myRotation,myColor,setPolygon,dragging,unbind,myData){
				var polygon = canvas.display.polygon({
					x: myX,
					y: myY,
					sides: mySides,
					radius: myRadius,
					rotation: myRotation,
					fill: myColor,cap: "round"
				});
				
				polygon.myData=myData;
				if(dragging && dragging==true){
					if(isMobile){
						polygon.addEventListener("")
					}else{
						polygon.dragAndDrop({
							changeZindex:true,
							start:function(){

								drag = this,target.rowHover = false;
							},
							move:function(){
								row.end.x = polygon.x;
								row.end.y = polygon.y;
								objeto.setAngle( polygon.x, polygon.y)
								canvas.redraw();
							},
							end:function(){
								polygon.compareData = target.myData;
								
								if(magnetismo==false)
									target.rowHover = true;

								if(target.rowHover==false)
									objeto.reset();
						
								target.rowHover = false, move = false,drag = [], row = [],target = [];
							}
						});
					}
					
				}else{
					if(!unbind || unbind==false){
						document.addEventListener("mousemove",function(){
							
							if(polygon.isPointerInside()==true){
								polygon.rowHover = true;
								target = polygon;
							}else{
								polygon.rowHover = false;
							}
						});
					}
				}

				if(setPolygon && setPolygon==true){
					canvas.addChild(polygon);
				}else{
					return polygon;
				}
			},
			/* Propiedades del rectángulo
			 * myX : posición eje X.
			 * myY : posición eje Y.
			 * myWidth : ancho.
			 * myHeight : alto.
			 * myRotation : ángulo de rotación [this.getAngle(iniX,iniY,endX,endY)].
			 * myColor : color de fondo [hexadecimal].
			 * setRectangle : dibujar rectángulo.
			 * dragging : habilitar "dragAndDrop"
			 */
			this.drawRectangle = function(myX,myY,myWidth,myHeight,myRotation,myColor,setRectangle,dragging,unbind,myData){
				var rectangle = canvas.display.rectangle({
					x: myX,
					y: myY,
					width: myWidth,
					height: myHeight,
					rotation: myRotation,
					fill: myColor
				});
				rectangle.myData=myData;
				if(dragging && dragging==true){
					rectangle.dragAndDrop({
						changeZindex:true,
						start:function(){
							drag = this;
						},
						move:function(){
							row.end.x = polygon.x;
							row.end.y = polygon.y;
							objeto.setAngle( polygon.x, polygon.y)
							canvas.redraw();
						},
						end:function(){
							if(magnetismo==false)
								target.rowHover = true;

							if(target.rowHover==false)
								objeto.reset();
					
							target.rowHover = false, move = false,drag = [], row = [],target = [];
						}
					});
					
				}else{
					if(!unbind || unbind==false){

						document.addEventListener("mousemove",function(){
							if(rectangle.isPointerInside()==true){
								rectangle.rowHover = true;
								target = rectangle;
							}else{
								rectangle.rowHover = false;
							}
						});
					}
				}
console.log(myData)
				objCanvasHots[myData] = rectangle;

				if(setRectangle && setRectangle==true){
					canvas.addChild(rectangle);
				}else{
					return rectangle;
				}
			},
			this.erase = function(id){
				objCanvas[id][0].remove();
				objCanvas[id][1].remove()
			},
			this.getAngle = function(iniX,iniY,endX,endY){

				var Y = endY- iniY;
				var X = endX - iniX;
				var angle = (Math.atan2(Y, X) * 180 / Math.PI);
				return angle;
			},
			this.setAngle = function(endX,endY){
				
				var iniX = row.start.x;
				var iniY = row.start.y;
				var Y = endY- iniY;
				var X = endX - iniX;
				var angle = (Math.atan2(Y, X) * 180 / Math.PI);
				drag.rotation = angle;
			},
			this.reset = function(){
				row.end.x = drag.staticX;
				row.end.y = drag.staticY;

				drag.x = drag.staticX;
				drag.y = drag.staticY;

				this.setAngle( drag.staticX, drag.staticY)
				canvas.redraw();
			},
			this.changeColor = function(myColor){
				
				if(myColor.indexOf("#")==-1){
					myColor = "#"+myColor;
				};
				options.color = myColor;
				canvas.redraw()
			}
		}