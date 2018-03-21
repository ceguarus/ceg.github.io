var checked = 0;
var p = 2;
var dragging = false;
var draggingObj = null;
var soluciones = new Array();
var xMouse = 0;
var yMouse = 0;
var boxHeight = 67;
var imageBck = "sec_";
var url_interfaz = "";
var url_files = "";
var iniWidth = 0,
    iniHeight = 0;
var numberItems, collapse = true,
    tipoAleatorio = "",
    objeto = [];
var count = 0;
var imgRed = new Image();
var imgGreen = new Image();
var imgAzul = new Image();
var imgRemAzul = new Image();
var myDatas = new Array();
if (typeof document != 'undefined' && document.readyState != 'complete' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', function (e) {
        try {
            init();
            imgRemAzul.src = url_interfaz + "css/images/tablet/flecha_remarcada_azul.png";
            imgRemAzul.class = "image";
            imgAzul.src = url_interfaz + "css/images/tablet/flecha_azul.png";
            imgAzul.class = "image";
            imgGreen.src = url_interfaz + "css/images/tablet/flecha_verde.png";
            imgGreen.class = "image";
            imgRed.src = url_interfaz + "css/images/tablet/flecha_roja.png";
            imgRed.class = "image";
            $(".image").hide()
        } catch (err) {
            alert(err)
        };
        window.addEventListener("resize", posicionar, false);
        window.addEventListener("load", posicionar, false)
    })
} else {
    window.attachEvent('DOMContentLoaded', function (e) {
        init();
        window.attachEvent("scroll", posicionar, false);
        window.attachEvent("resize", posicionar, false);
        window.attachEvent("load", posicionar, false)
    })
}
$(window).scroll(function () {
    posicionar()
});
var posicionar = function () {
    ims.interfaz.resize();
    if ($("#intro_text").html() == null) {
        $("#carcasa").not(".pop_up").children().not(".pop_up").height($("#carcasa").height());
        $('#visor').height($("#content").height() - 60);
        $('#visor').width($('#content').width());
        if ($(".jspPane").length == 0 && typeof (canvas) != "undefined") {
            if (($("#colizquierda").outerHeight(true) + $("#header").outerHeight(true) + $("hr").outerHeight(true)) > $("#visor").height() || ($("#colderecha").outerHeight(true) + $("#header").outerHeight(true) + $("hr").outerHeight(true)) > $("#visor").height()) $('#visor').jScrollPane({
                contentWidth: '0px',
                horizontalGutter: -30,
                verticalGutter: -30
            });
            if ($(".jspPane").height() < $("#visor").height()) {
                canvas.height = $("#visor").height()
            } else {
                canvas.height = $(".jspPane").height()
            }
        }
        if (typeof (canvas) != "undefined") canvas.redraw()
    } else {
        $('#visor').width($('#content').width());
        $("#carcasa").height($("#carcasa").height()).children().height($("#carcasa").height());
        $('#visor').height($('#content').height() - 60);
        $('#visor').jScrollPane({
            showArrows: false,
            hideFocus: true,
            contentWidth: '0px',
            autoReinitialise: true
        })
    }
};

function init() {
    if ($("#url_interfaz").text() != "") {
        url_interfaz = $("#url_interfaz").text()
    };
    if ($("#url_files").text() != "") {
        url_files = $("#url_files").text()
    };
    $("#url_interfaz,#url_files,.ui-page,.ui-loader").remove();
    config_xml = $.parseXML(config_xml);
    var a = $(config_xml).find("subTipoInterfaz").text();
    ims.interfaz.setSubSkin(a);
    document.title = "Santillana";
    tipoAleatorio = $(config_xml).find("tipoAleatorio").text();
    ims.interfaz.setSound('good', url_interfaz + 'audio/good.mp3');
    ims.interfaz.setSound('rBad', url_interfaz + 'audio/result_bad.mp3');
    ims.interfaz.setSound('rGood', url_interfaz + 'audio/result_good.mp3');
    ims.interfaz.setSound('beep_select', url_interfaz + 'audio/beep_select.mp3');
    ims.interfaz.init();
    $("#overall").prependTo("#content");
    if (isMobile) {
        $(".notdisabled").bind("touchstart", function () {
            $(this).addClass("active")
        }).bind("touchend", function () {
            $(this).removeClass("active")
        })
    };
    try {
        if (typeof (editable) == "undefined" && $(config_xml).find("introduccion").find("texto1").text().length != 0) {
            inicializar()
        } else {
            cargar_actividad()
        }
    } catch (err) {
        alert(err)
    }
}

function inicializar() {
    var a = $(config_xml).find("introduccion").find("titulo").text();
    var b = $(config_xml).find("introduccion").find("texto1").text();
    $("#visor").append('<div id="intro_title">' + a + '</div><div id="intro_text">' + b + '</div>');
    var c = $(config_xml).find("comenzar").text();
    ims.interfaz.setTitle($(config_xml).find("pregunta").find("titulo").text());
    $('#overall').hide();
    ims.interfaz.addButton("Siguiente", "right", "siguiente ", c);
    ims.interfaz.enable("Siguiente");
    ims.interfaz.bind("Siguiente", 'nextPage()');
    posicionar()
};

function cargar_actividad() {
    $("#overall").remove();
    objeto = new drawing;
    objeto.init();
    loadContent();
    loadItems();
    $("canvas").appendTo("#visor");
    var a = 0;
    bindClick();
    posicionar()
};

function loadItems() {
    var l = "";
    $(config_xml).find("pregunta").each(function () {
        l += "<div id=\"colizquierda\">";
        $(this).find("itemizquierda").each(function () {
            l += "<div id=\"" + $(this).attr("id") + "\" class=\"item\">" + $(this).text().replace(/\<p(.*?)\>/g, "").replace(/<\/p>/g, "") + "</div>"
        });
        l += "</div><div id=\"colderecha\">";
        $(this).find("itemderecha").each(function () {
            l += "<div id=\"" + $(this).attr("id") + "\" class=\"target\"><div class='destino' id='destino'></div>" + $(this).text().replace(/\<p(.*?)\>/g, "").replace(/<\/p>/g, "") + "</div>"
        });
        $("#visor").append("" + l + "</div>")
    });
    var m = Math.round(($("#fondo").height() - $("#colderecha").height() - parseInt($("#header").outerHeight()) - parseInt($("#pregunta").outerHeight()) - 40) / 2);
    var n = Math.round(($("#fondo").height() - $("#colizquierda").height() - parseInt($("#header").outerHeight()) - parseInt($("#pregunta").outerHeight()) - 40) / 2);
    if (m < 0 || n < 0) {
        if ($("#colderecha").height() > $("#colizquierda").height()) {
            $("#visor").height($("#colderecha").height());
            m = 0
        } else {
            $("#visor").height($("#colizquierda").height());
            n = 0
        }
    }
    if ((m < 0)) m = ($("#colizquierda").height() - $("#colderecha").height()) / 2;
    if ((n < 0)) n = ($("#colderecha").height() - $("#colizquierda").height()) / 2;
    $("#colderecha").css("margin-top", m + "px");
    $("#colizquierda").css("margin-top", n + "px");
    var o = url_interfaz + "css/images/tablet/target.png";
    $(".target").each(function () {
        var x = $(this).offset().left - $("#visor").offset().left;
        var y = $(this).offset().top - $("#visor").offset().top;
        var a = $(this).outerHeight(true);
        var b = $(this).attr("id");
        var c = $("<img/>").attr({
            "src": o,
            "id": "target_" + b,
            "x": x - 13,
            "y": y + (a / 2) - 17,
            "class": "targets"
        }).css({
            "position": "absolute",
            "top": y + (a / 2) - 17,
            "left": x - 13,
            "z-index": 1
        });
        $("#visor").append(c)
    });
    $("#canvas").css("z-index", 0);
    $(".item").each(function () {
        var x = $(this).offset().left - $("#visor").offset().left;
        var y = $(this).offset().top - $("#visor").offset().top;
        var a = $(this).outerWidth(true);
        var b = $(this).outerHeight(true);
        var d = $(config_xml).find("itemizquierda[id=" + $(this).attr("id") + "]").attr("idi");
        var e = d.split(",");
        var f = e.length;
        var c = 1;
        var g = $("#carcasa").offset().left + $("#carcasa").width() - 20;
        var h = $(this).attr("id");
        while (c <= f) {
            myDatas[h] = e;
            if (isIE == true && version == 8) {
                $("#content").append("<div class=\"paint\" id=\"linerow" + c + "_" + $(this).attr("id") + "\"  style=\"position: absolute;  z-index:2000; top:0; left:0;width:730px;height=\"" + ($("#right").offset().top) + "\"  \" ></div>")
            } else {
                var i = url_interfaz + "css/images/tablet/flecha_azul.png";
                var j = objeto.drawLine(x + a, y + (b / 2) - 2, x + a + 10, y + (b / 2) - 2, d, "#48a9da", "5px", i, h, false);
                var k = $("<img/>").attr({
                    "src": i,
                    "id": "row_" + h,
                    "class": "rows",
                    "x": x + a + 5,
                    "y": y + (b / 2) - 20,
                    "class": "rows",
                    "clicked": "false"
                }).css({
                    "position": "absolute",
                    "top": y + (b / 2) - 20,
                    "left": x + a + 5,
                    "z-index": 1
                });
                k.get(0).myData = d;
                k.get(0).myLine = j;
                $("#visor").append(k)
            }
            c++
        }
    })
}

function bindClick(e) {
    var i = 0;
    $("#ayuda").click(function () {
        if (i == 0) {
            $("#content_ayuda").width($("#content_ayuda").width());
            $('#content_ayuda').jScrollPane({
                showArrows: false,
                hideFocus: true
            });
            i++
        }
    });
    if (isMobile) {
        $(".rows").live("click", function (c) {
            c.preventDefault();
            var d = 0;
            if (parseInt($(".jspPane").css("top"))) d = parseInt($(".jspPane").css("top"));
            $(".aspa").remove();
            if (dragging == false) {
                draggingObj = $(this);
                if ($(this).attr("clicked") == "false") {
                    dragging = true;
                    var e = url_interfaz + "css/images/tablet/flecha_remarcada_azul.png";
                    draggingObj.attr("src", e)
                } else {
                    var f = $("<div/>").css({
                        "top": parseInt($(this).position().top) + d,
                        "left": parseInt($(this).position().left) + $(this).width(),
                    }).append("X").addClass("aspa");
                    f.get(0).object = draggingObj;
                    f.bind("click", function (a) {
                        draggingObj = $(this).get(0).object;
                        if (draggingObj.attr("clicked") == "true") {
                            draggingObj.css({
                                top: parseInt(draggingObj.attr("y")),
                                left: parseInt(draggingObj.attr("x"))
                            });
                            var b = url_interfaz + "css/images/tablet/flecha_azul.png";
                            draggingObj.attr("src", b).attr("clicked", "false");
                            draggingObj.get(0).myLine.end.x = parseInt(draggingObj.attr("x")) + 18;
                            draggingObj.get(0).myLine.end.y = parseInt(draggingObj.attr("y")) + 18;
                            draggingObj.get(0).compareData = 0;
                            canvas.redraw();
                            draggingObj = null;
                            dragging = false;
                            $(this).remove()
                        }
                    });
                    $("#visor").append(f)
                }
            } else {
                if (draggingObj != null && dragging == true && $(this).attr("clicked") == "true") {
                    var g = $(this);
                    draggingObj.css({
                        top: g.position().top + 5,
                        left: g.position().left + 5
                    });
                    draggingObj.get(0).myLine.end.x = g.position().left + 18;
                    draggingObj.get(0).myLine.end.y = g.position().top + 18;
                    draggingObj.get(0).compareData = $(this).get(0).compareData;
                    canvas.redraw();
                    var h = url_interfaz + "css/images/tablet/flecha_azul.png";
                    draggingObj.attr("src", h).attr("clicked", "true");
                    rotation(draggingObj);
                    draggingObj = null;
                    dragging = false
                }
            }
        });
        $(".targets").live("click", function (a) {
            a.preventDefault();
            if (draggingObj != null && dragging == true) {
                var b = 0;
                if (parseInt($(".jspPane").css("top"))) b = parseInt($(".jspPane").css("top"));
                var c = $(this);
                draggingObj.css({
                    top: c.position().top - 4,
                    left: c.position().left - 4
                });
                draggingObj.get(0).myLine.end.x = c.position().left + 18 - 4;
                draggingObj.get(0).myLine.end.y = c.position().top + 18 - 4;
                draggingObj.get(0).compareData = $(this).attr("id").replace("target_", "");
                canvas.redraw();
                var d = url_interfaz + "css/images/tablet/flecha_azul.png";
                draggingObj.attr("src", d).attr("clicked", "true");
                rotation(draggingObj);
                draggingObj = null;
                dragging = false
            }
        })
    } else {
        $(".rows").live("mousedown", function (a) {
            a.preventDefault();
            dragging = true;
            draggingObj = $(this);
            if (isMoz == true) {
                var z = ims.interfaz.zoomRatio
            } else {
                var z = ims.interfaz.zoomRatio
            } if (z == 'none' || typeof (z) == 'undefined') z = 1;
            xMouse = a.pageX - (($(this).offset().left) * z);
            yMouse = a.pageY - ($(this).offset().top * z);
            xMouse = xMouse / z;
            yMouse = yMouse / z
        });
        $(document).bind("mousemove", function (a) {
            if (dragging == true) {
                var b = 0;
                if (parseInt($(".jspPane").css("top"))) b = parseInt($(".jspPane").css("top"));
                if (isMoz == true) {
                    var z = ims.interfaz.zoomRatio
                } else {
                    var z = ims.interfaz.zoomRatio
                } if (z == 'none' || typeof (z) == 'undefined') z = 1;
                var c = a.pageX - (($("#visor").offset().left) * z);
                var d = (c / z);
                var e = a.pageY - (($("#visor").offset().top) + b * z);
                var f = (e / z);
                move(draggingObj, d - xMouse, f - yMouse)
            }
        });
        $(document).bind("mouseup", function () {
            if (draggingObj != null) suelta();
            dragging = false, draggingObj = null
        })
    }
}

function loadContent() {
    var c = $(config_xml).find("pregunta").find("titulo").text();
    var d = $(config_xml).find("enunciado").text().replace("<p>", "").replace("</p>", "");
    ims.interfaz.setTitle(c);
    $("#pregunta").append(d);
    if ($(config_xml).find("pregunta").find("foto").length != 0) {
        var e = $(config_xml).find("pregunta").find("foto");
        var f = e.text();
        var g = e.attr("rotacion");
        var h = e.attr("width");
        var i = e.attr("height");
        var x = e.attr("x");
        var y = parseInt(e.attr("y"));
        if (f != '') {
            if (isIE && version == 8) {
                if (url_files != "") {
                    f = url_files + f
                } else {
                    f = "fotos/" + f
                };
                $("#fondo").append("<div><img style=\"position:absolute;margin-left:" + x + "px;margin-top: " + y + "px;width:" + h + "px; height:" + i + "px; \" src=\"" + f + "\"/></div>");
                if (x == "" && y == "") {
                    i = parseInt($('#fondo div img').height());
                    h = parseInt($('#fondo div img').width());
                    if (h < $("#fondo").width() || i < $("#fondo").height()) {
                        x = $("#fondo").offset().left + $("#fondo").width() - h;
                        y = $("#fondo").offset().top + $("#fondo").height() - i;
                        $('#fondo div img').css({
                            "margin-left": x + "px ",
                            "margin-top": +y + "px"
                        })
                    }
                }
            } else {
                if (url_files != "") {
                    $('#fondo').css("background-image", "url(" + url_files + f + ")")
                } else {
                    $('#fondo').css("background-image", "url(fotos/" + f + ")")
                };
                $('#fondo').css("background-repeat", "no-repeat");
                if (g != '') {
                    $('#fondo').css("rotation", g);
                    if (x != '' || y != '') {
                        $('#fondo').css("background-position", x + "px " + y + "px");
                        if (h != '' && i != '') {
                            $('#fondo').css("background-size", h + "px " + i + "px")
                        } else {
                            if (i != '') {
                                $('#fondo').css("background-size", "auto " + i + "px")
                            } else {
                                if (h != '') {
                                    $('#fondo').css("background-size", h + "px auto")
                                }
                            }
                        }
                    }
                }
            };
            url = $('#fondo').css('background-image').replace('url(', '').replace(')', '').replace("'", '').replace('"', '');
            bgImg = $('<img />');
            bgImg.hide();
            if (x == "" && y == "") {
                bgImg.bind('load', function () {
                    i = parseInt($(this).height());
                    h = parseInt($(this).width());
                    if (h < $("#fondo").width() || i < $("#fondo").height()) {
                        x = $("#fondo").offset().left + $("#fondo").width() - h;
                        y = $("#fondo").offset().top + $("#fondo").height() - i;
                        $('#fondo').css("background-position", x + "px " + y + "px")
                    };
                    bgImg.remove()
                })
            };
            $('#fondo').append(bgImg);
            bgImg.attr('src', url)
        }
    };
    var j = $(config_xml).find("silenciar").text();
    var k = $(config_xml).find("palabras").find("ayuda").text();
    var l = $(config_xml).find("comprobar").text();
    var m = $(config_xml).find("desarrollosolucion").text();
    var n = $(config_xml).find("imprimir").text();
    var o = $(config_xml).find("versolucion").text();
    var p = $(config_xml).find("reiniciar").text();
    var q = $(config_xml).find("volver").text();
    ims.interfaz.addButton("Anterior", "left", "anterior", q);
    if (!isMobile && $(config_xml).find("urlimprimir").text().length > 0) {
        ims.interfaz.addButton("imprimir", "left", "imprimir", n)
    }
    if (!isMobile) ims.interfaz.addButton("silenciar", "left", "silenciar", j);
    ims.interfaz.addButton("reiniciar", "right", "reiniciar", p);
    ims.interfaz.addButton("clave", "right", "clave", m);
    ims.interfaz.addButton("versolucion", "right", "versolucion", o);
    ims.interfaz.addButton("comprobar", "right", "comprobar", l);
    ims.interfaz.addButton("ayuda", "right", "ayuda", k);
    if ($(config_xml).find("introduccion").find("texto1").text().length != 0) {
        ims.interfaz.enable("Anterior");
        ims.interfaz.bind("Anterior", 'prevPage()')
    };
    ims.interfaz.enable("silenciar");
    if (ims.interfaz.sound) {
        ims.interfaz.bind("silenciar", "mute()")
    } else {
        ims.interfaz.bind("silenciar", "play()")
    }; if ($(config_xml).find("ayuda").find("texto1").text().length != 0) {
        ims.interfaz.addPopup("ayuda", "ayuda");
        $(config_xml).find("ayuda").each(function () {
            var a = $(this).find("titulo").text();
            var b = $(this).find("texto1").text();
            $('#pop_ayuda').prepend("<span class='pop_up_title'>" + a + "</span>");
            $('#content_ayuda').append(b)
        });
        ims.interfaz.resize()
    };
    ims.interfaz.bind("reiniciar", 'reload()');
    ims.interfaz.bind("comprobar", 'comprobar()');
    ims.interfaz.bind("imprimir", "imprimir()");
    ims.interfaz.enable("reiniciar");
    ims.interfaz.enable("comprobar");
    ims.interfaz.enable("imprimir")
}

function suelta() {
    var a = draggingObj;
    var b = 0;
    $(".targets").each(function () {
        if (intersects(a, $(this)) && ($(this).attr("id"))) {
            objoff = $(this).offset();
            b++;
            a.attr({
                "posicion": "0"
            }).get(0).compareData = $(this).attr("id").replace("target_", "");
            rotation(a);
            return false
        }
    });
    if (b == 0) resetele(a);
    dragging = false
};

function resetele(a) {
    a.css({
        "left": a.attr("x") + "px",
        "top": a.attr("y") + "px"
    }).attr("posicion", "-1").get(0).compareData = 0;
    a.get(0).myLine.end.x = parseInt(a.attr("x")) + 18;
    a.get(0).myLine.end.y = parseInt(a.attr("y")) + 18;
    canvas.redraw();
    $("#hotspot_" + a.attr("id")).attr("id", "");
    $("#" + a.attr("posicion")).attr("rel", "-1");
    a.css({
        "transform": "rotate(0deg)",
        "-ms-transform": "rotate(0deg)",
        "-moz-transform": "rotate(0deg)",
        "-webkit-transform": "rotate(0deg)"
    })
};

function move(a, x, y) {
    if (dragging) {
        a.css({
            "left": (parseInt(x)) + "px",
            "top": (parseInt(y)) + "px"
        });
        rotation(a);
        a.get(0).myLine.end.x = parseInt(x) + 18;
        a.get(0).myLine.end.y = parseInt(y) + 18;
        canvas.redraw()
    }
};

function intersects(a, b) {
    obj1x = parseInt(a.css("left"));
    obj1y = parseInt(a.css("top"));
    obj2x = parseInt(b.css("left"));
    obj2y = parseInt(b.css("top"));
    obj1width = a.width();
    obj1height = a.height();
    obj2width = b.width();
    obj2height = b.height();
    obj1off = a.offset();
    obj2off = b.offset();
    if (obj1off.left + obj1width < obj2off.left) {
        return false
    };
    if (obj1off.top + obj1height < obj2off.top) {
        return false
    };
    if (obj1off.left > obj2off.left + obj2width) {
        return false
    };
    if (obj1off.top > obj2off.top + obj2height) {
        return false
    };
    return true
};

function getRandomArray(a, b) {
    var A = [];
    while (b >= a) A.push(b--);
    A.sort(function () {
        return .5 - Math.random()
    });
    return A[0]
};

function comprobar() {
    if (checked == 0 && $("#comprobar").hasClass("notdisabled")) {
        if (isMobile) $(".rows").die("click");
        $(".rows").die("mousedown");
        if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
            ims.interfaz.enable("clave");
            ims.interfaz.addPopup("solucion", "clave");
            $("#content_solucion").height($("#content_solucion").height() - 20);
            var d = 0;
            $("#clave").click(function () {
                if (d == 0) {
                    $("#content_solucion").width($("#content_solucion").width());
                    $('#content_solucion').jScrollPane({
                        showArrows: false,
                        hideFocus: true
                    });
                    d++
                }
                ims.interfaz.resize()
            });
            $(config_xml).find("solucion").each(function () {
                var a = $(this).find("titulo").text();
                var b = $(this).find("texto1").text();
                $('#pop_solucion').prepend("<span class='pop_up_title'>" + a + "</span>");
                $('#content_solucion').append(b)
            })
        };
        var e = 4;
        var f = 2;
        var g = 0;
        var h = 0,
            hots, removeData = false,
            data = "";
        var c = 0;
        for (var n = 0; n <= $(".rows").length - 1; n++) {
            var j = "";
            j = $(".rows")[n];
            if (typeof (j.myLine) != "undefined") {
                g++
            }
            var k = j.myLine;
            if (typeof j.myData != "undefined")
                if (j.myData.indexOf(",") != -1) {
                    data = j.myData.split(",");
                    for (var i = 0; i <= data.length - 1; i++) {
                        if (data[i] == j.compareData) {
                            h++;
                            var l = url_interfaz + "css/images/tablet/flecha_verde.png";
                            $(j).attr("src", l);
                            k.stroke = "5px #39B54A";
                            canvas.redraw();
                            data = jQuery.grep(data, function (a) {
                                return a != data[i]
                            });
                            removeData = true;
                            i = data.length;
                            rotation($(j))
                        } else {
                            if (typeof (k) != "undefined") {
                                var l = url_interfaz + "css/images/tablet/flecha_roja.png";
                                $(j).attr("src", l);
                                k.stroke = "5px #FF0000"
                            } else {
                                var l = url_interfaz + "css/images/tablet/flecha_roja.png";
                                $(j).attr("src", l);
                                k.stroke = "5px #FF0000"
                            }
                        }
                    }
                } else {
                    if (j.myData == j.compareData) {
                        h++;
                        var l = url_interfaz + "css/images/tablet/flecha_verde.png";
                        $(j).attr("src", l);
                        k.stroke = "5px #39B54A";
                        rotation($(j))
                    } else {
                        if (typeof (k) != "undefined") {
                            var l = url_interfaz + "css/images/tablet/flecha_roja.png";
                            $(j).attr("src", l);
                            k.stroke = "5px #FF0000";
                            canvas.redraw()
                        }
                    }
                }
        }
        canvas.redraw();
        $(".green").each(function () {
            ims.interfaz.showStars($(this).offset().left, $(this).offset().top, "center", $(this).attr("id"));
            ims.interfaz.showStars($(this).offset().left + $(this).width(), $(this).offset().top, "right", $(this).attr("id"))
        });
        ims.interfaz.bind("versolucion", 'solucion()');
        if (h === g) {
            var m = "rGood"
        } else {
            var m = "rBad"
        };
        ims.interfaz.showResults("<p>" + h + " / " + g + "</p>");
        ims.interfaz.disable("comprobar");
        ims.interfaz.enable("versolucion");
        ims.interfaz.playSound(m)
    }
};

function solucion() {
    if ($("#versolucion").hasClass("notdisabled")) {
        $(".stars").remove();
        var i = 0;
        var a = new Array(),
            _rows = new Array(),
            nz_rows = 0,
            removeData = false,
            data = "";
        var b = new Array(),
            c = 0;
        for (var n = 0; n <= $(".rows").length - 1; n++) {
            var d = $(".rows").get(n);
            var e = d.myLine;
            var f = d.myData;
            var g = $(".rows").eq(n).attr("id").replace("row_", "");
            if (f != "")
                if (f.indexOf(",") != -1) {
                    f = f.split(",");
                    var h = f.length;
                    for (var i = 0; i <= h - 1; i++) {
                        var j = f[i];
                        if (b[g] == j) {
                            var k = f.indexOf(j)
                        }
                        if ((typeof (d.myLine) != "undefined") && myDatas[g].indexOf(j) != -1) {
                            var l = d.myLine;
                            var m = url_interfaz + "css/images/tablet/flecha_verde.png";
                            $(d).attr("src", m);
                            b[g] = j;
                            l.stroke = "5px #39B54A";
                            $(d).css({
                                top: parseInt($("#target_" + j).position().top) - 3,
                                left: parseInt($("#target_" + j).position().left) - 3
                            });
                            l.end.x = parseInt($("#target_" + j).position().left) + 18;
                            l.end.y = parseInt($("#target_" + j).position().top) + 18;
                            var k = myDatas[g].indexOf(j);
                            myDatas[g].splice(k, 1);
                            i = f.length - 1;
                            canvas.redraw();
                            rotation($(d))
                        }
                    }
                } else {
                    if ((typeof (d.myLine) != "undefined")) {
                        var l = d.myLine;
                        l.stroke = "5px #39B54A";
                        var m = url_interfaz + "css/images/tablet/flecha_verde.png";
                        $(d).attr("src", m);
                        $(d).css({
                            top: parseInt($("#target_" + f).position().top) - 3,
                            left: parseInt($("#target_" + f).position().left) - 3
                        });
                        l.end.x = parseInt($("#target_" + f).position().left) + 18;
                        l.end.y = parseInt($("#target_" + f).position().top) + 18;
                        canvas.redraw();
                        rotation($(d))
                    }
                }
        };
        $("#center").hide();
        ims.interfaz.disable("versolucion");
        var o = "good";
        ims.interfaz.playSound(o);
        return false
    }
};

function imprimir() {
    window.open($(config_xml).find("urlimprimir").text())
};

function prevPage() {
    $(".stars").remove();
    $(".tooltip").remove("");
    $("#limit").remove("");
    ims.interfaz.init();
    $("#overall").hide();
    inicializar()
};

function nextPage() {
    checked = 0, collapse = true;
    $("#limit,.tooltip,#intro_text").remove("");
    ims.interfaz.init();
    cargar_actividad();
    if (!ims.interfaz.sound) {
        mute()
    };
    posicionar()
};

function reload() {
    for (var n = 0; n <= canvas.children.length - 1; n++) {
        var a = canvas.children[n];
        if (a.type == "image") {
            a.img.src = url_interfaz + "css/images/tablet/flecha_azul.png"
        }
    }
    checked = 0, collapse = true;
    $("#limit,.tooltip").remove("");
    ims.interfaz.init();
    $("#overall").prependTo("#content");
    $(".item-arrastrar").die("mousedown");
    $(".hotspot").die("click");
    cargar_actividad();
    if (!ims.interfaz.sound) {
        mute()
    };
    posicionar()
};

function mute() {
    $('.tooltip').hide();
    $('#silenciar').attr('title', $(config_xml).find("silenciar").text());
    $('#silenciar').removeClass('silenciar');
    $('#silenciar').addClass('silenciar_on');
    $('#silenciar').tooltip();
    ims.interfaz.bind("silenciar", "play()");
    ims.interfaz.disableSound()
};

function play() {
    $('.tooltip').hide();
    $('#silenciar').attr('title', $(config_xml).find("silenciar").text());
    $('#silenciar').removeClass('silenciar_on');
    $('#silenciar').addClass('silenciar');
    $('#silenciar').tooltip();
    ims.interfaz.bind("silenciar", "mute()");
    ims.interfaz.enableSound()
};
var rotation = function (e) {
    var a = e;
    var b = a.position().top;
    var c = parseInt(a.attr("y"));
    var d = a.position().left + 18;
    var f = parseInt(a.attr("x")) - 20;
    Y = b - c;
    X = d - f;
    angulo = (Math.atan2(Y, X) * 180 / Math.PI);
    a.css({
        "transform": "rotate(" + angulo + "deg)",
        "-ms-transform": "rotate(" + angulo + "deg)",
        "-moz-transform": "rotate(" + angulo + "deg)",
        "-webkit-transform": "rotate(" + angulo + "deg)"
    })
};