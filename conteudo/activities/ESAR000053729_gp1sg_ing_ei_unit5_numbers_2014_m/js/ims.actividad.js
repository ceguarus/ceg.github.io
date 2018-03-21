var checked = 0,
    config_xml = "";
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
var numberItems, collapse = true;
var sonido = 0;
var estado = 'parado';
var tHe = 0;
var count = 0;
if (typeof document != 'undefined' && document.readyState != 'complete' && typeof (window.addEventListener) != "undefined") {
    window.addEventListener('DOMContentLoaded', function (e) {
        init();
        window.addEventListener("scroll", posicionar, false);
        window.addEventListener("resize", posicionar, false);
        window.addEventListener("load", posicionar, false)
    })
} else {
    $(window).ready(function () {
        init()
    });
    $(window).resize(function () {
        posicionar()
    });
    $(window).load(function () {
        posicionar()
    });
    $(window).scroll(function () {
        posicionar()
    })
}

function posicionar() {
    ims.interfaz.resize();
    if (collapse == true) initItem();
    if ($("#intro_text").html() == null) {
        $("#carcasa").not(".pop_up").children().not(".pop_up").height($("#carcasa").height());
        if ($("#box").find("div[class='item']").length != 0)
            if (collapse == true) {
                $("#visor").height($("#content").height() - 60 - boxHeight)
            } else {
                $("#visor").height($("#content").height() - 60 - tHe)
            }
        $('#visor').jScrollPane({
            contentWidth: "0px",
            horizontalGutter: -30,
            verticalGutter: -30
        });
        $('#visor').width($('#content').width());
        $("#box").width($('#content').width())
    } else {
        $('#visor').width($('#content').width() + 100);
        $("#carcasa").height($("#carcasa").height()).children().height($("#carcasa").height());
        $('#visor').height($('#content').height() - 60);
        $('#visor').jScrollPane({
            contentWidth: 0,
            horizontalGutter: -30,
            verticalGutter: -30
        });
        $('#visor').width($('#content').width())
    }
    initItem()
};

function initItem() {
    if ($(".item").length != 0) {
        numberItems = 1;
        var x = 1,
            y = $("#box").offset().top - parseInt($("#limit").offset().top) + 35,
            ancho = 20,
            boxWidth, topItem = 0,
            control = false,
            yStatic = 40;
        $(".item").each(function (c) {
            if ($(this).attr("posicion") != "0") {
                if (c != 0) ancho += $(this).width() + 20;
                if ((ancho + $(this).width() + 20) >= (parseInt($("#box").width()))) {
                    boxWidth = ancho;
                    x = $("#box").offset().left - parseInt($("#limit").offset().left);
                    y += $(this).height() + 20;
                    yStatic += 20;
                    ancho = 30;
                    topItem++
                };
                $(this).css("left", (x + 20) + "px");
                $(this).css("top", (y) + "px");
                $(this).attr("x", (x + 20));
                $(this).attr("y", (y));
                x = x + $(this).width() + 20;
                // if ($(this).css("top") == top) {
                    // control = true;
                    // numberItems++
                // }
            }
        });
        boxHeight = 67 + (topItem * 44);
        if (collapse == true) $("#box").css("height", boxHeight)
    }
}

function init() {
    if ($("#url_interfaz").text() != "") {
        url_interfaz = $("#url_interfaz").text()
    };
    if ($("#url_files").text() != "") {
        url_files = $("#url_files").text()
    };
    $("#url_interfaz,#url_files,.ui-page,.ui-loader").remove();
    config_xml = $.parseXML(config_xml);
    document.title = "Santillana";
    var a = $(config_xml).find("subTipoInterfaz").text();
    ims.interfaz.setSubSkin(a);
    var b = "";
    if (url_files != "") {
        b = url_files
    } else {
        b = "fotos/"
    };
    ims.interfaz.setSound('good', url_interfaz + 'audio/good.mp3');
    ims.interfaz.setSound('rBad', url_interfaz + 'audio/result_bad.mp3');
    ims.interfaz.setSound('rGood', url_interfaz + 'audio/result_good.mp3');
    ims.interfaz.setSound('beep_select', url_interfaz + 'audio/beep_select.mp3');
    if ($(config_xml).find("sonido").text() != '') {
        ims.interfaz.setSound('sonido', b + $(config_xml).find("sonido").text())
    }
    ims.interfaz.init();
    $("#visor").append("<div id='visor_content'></div>");
    if (isMobile) {
        $(".notdisabled").bind("touchstart", function () {
            $(this).addClass("active")
        }).bind("touchend", function () {
            $(this).removeClass("active")
        })
    };
    if (typeof (editable) == "undefined" && $(config_xml).find("introduccion").find("texto1").text().length != 0) {
        inicializar()
    } else {
        cargar_actividad()
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
    loadContent();
    $("<div id='box' ><div id='tab' class='tab-o sprite background'></div></div>").insertAfter("#visor");
    $(config_xml).find("pregunta").each(function () {
        var a = 0;
        var b = $(this).find("texto").text();
        var c = new Array();
        var d = new Array();
        c = palabrasOk(b, 0, c);
        b = Remplazo(b, 0);
        for (i = 0; i <= c.length - 1; i++) {
            d[i] = '<div id="item_' + i + '" class="item" rel="' + i + '" posicion="-1" clicked="false"><span>' + c[i] + '</span></div>'
        }
        if ($(this).find("palabrasfalsas").text().length >= 1) $(this).find("palabrafalsa").each(function () {
            d[i] = '<div id="item_' + i + '" class="item" rel="' + i + '" posicion="-1" clicked="false"><span>' + $(this).text() + '</span></div>';
            i++
        });
        $("#visor_content").append('<div id="respuesta">' + b + '</div>');
        var n = getRandomArray(0, d.length);
        var e = "#box";
        for (i = 0; i <= d.length; i++) {
            $(e).append(d[n[i]])
        }
    });
    $("#content_ayuda").width($("#content_ayuda").width() - 20);
    bindClick();
    posicionar();
    $(".item").each(function () {
        finWidth = parseInt($(this).width());
        if (iniHeight < $(this).height()) iniHeight = $(this).height();
        if (iniWidth < finWidth) iniWidth = finWidth
    });
    $(".target").width(parseInt(iniWidth) + 20).height(parseInt(iniHeight));
    $(".item").width(parseInt(iniWidth) + 20).height(parseInt(iniHeight));
    posicionar()
};

function bindClick() {
    if (isMobile) {
        var f = ims.interfaz.getSkin(),
            idItem = "",
            idTarget = "";
        $(".item").click(function () {
            $(".aspa").remove();
            if (dragging == false) {
                draggingObj = $(this);
                if ($(this).attr("clicked") == "false") {
                    dragging = true;
                    $(".item").removeClass(f + "_selection");
                    $(this).addClass(f + "_selection")
                } else {
                    if (!$("#tab").hasClass("tab-c")) {
                        var b = $("<div/>").css({
                            "top": parseInt($(this).offset().top) - $("#limit").offset().top,
                            "left": parseInt($(this).offset().left) + $(this).width() - $("#limit").offset().left
                        }).append("X").addClass("aspa");
                        b.get(0).object = draggingObj;
                        b.bind("click", function (a) {
                            if (draggingObj.attr("clicked") == "true") {
                                draggingObj.css({
                                    top: parseInt(draggingObj.attr("y")),
                                    left: parseInt(draggingObj.attr("x"))
                                }).attr("clicked", "false").attr("posicion", "-1");
                                $("#box").append(draggingObj.get());
                                draggingObj = null;
                                dragging = false;
                                $(this).remove()
                            }
                        });
                        $("#content").append(b)
                    }
                }
            }
        });
        $(".target").click(function () {
            if (draggingObj != null && dragging == true) {
                if (draggingObj.attr("posicion") != 0) {
                    $(".target").removeClass(f + "_selection");
                    $(this).attr("rel", draggingObj.attr("rel"));
                    draggingObj.css({
                        left: 0,
                        top: 0
                    }).attr("posicion", "0");
                    $(this).append(draggingObj.get()).attr("id", "target_" + draggingObj.attr("id"));
                    draggingObj.attr("clicked", "true");
                    draggingObj = null;
                    dragging = false
                }
            }
        })
    } else {
        $(".item").live("mousedown", function (e) {
            e.preventDefault();
            if (checked == 0) {
                if (isMoz == true) {
                    var z = ims.interfaz.zoomRatio
                } else {
                    var z = ims.interfaz.zoomRatio
                } if (z == 'none' || typeof (z) == 'undefined') z = 1;
                xMouse = e.pageX - (($(this).offset().left) * z);
                yMouse = e.pageY - ($(this).offset().top * z);
                xMouse = xMouse / z;
                yMouse = yMouse / z;
                draggingObj = $(this);
                if ($(this).attr("posicion") == 0) {
                    draggingObj.css({
                        "top": draggingObj.attr("top"),
                        "left": draggingObj.attr("left")
                    });
                    $("#box").append($(this).get());
                    $(this).attr("posicion", "-1")
                }
                dragging = true;
                objoff = $(this).offset()
            }
        });
        $(document).live("mousemove", function (e) {
            if (dragging == true) {
                if (isMoz == true) {
                    var z = ims.interfaz.zoomRatio
                } else {
                    var z = ims.interfaz.zoomRatio
                } if (z == 'none' || typeof (z) == 'undefined') z = 1;
                var a = e.pageX - (($("#limit").offset().left) * z);
                var b = (a / z);
                var c = e.pageY - (($("#limit").offset().top) * z);
                var d = (c / z);
                move(draggingObj, b - xMouse, d - yMouse)
            }
        });
        $(document).live("mouseup", function (e) {
            if (dragging) {
                suelta()
            }
        })
    };
    var g = 0;
    $("#ayuda").click(function () {
        if (g == 0) {
            $('#content_ayuda').width($('#content_ayuda').width());
            $('#content_ayuda').height($('#content_ayuda').height() - 60);
            $('#content_ayuda').jScrollPane({
                contentWidth: "0px",
                horizontalGutter: -30,
                verticalGutter: 30,
            });
            g++
        }
    });
    $("#tab").toggle(function () {
        $(".aspa").remove();
        tHe = $("#tab").outerHeight(true);
        $(this).addClass("tab-c");
        collapse = false;
        $('.item[posicion=-1]').animate({
            "margin-top": boxHeight - tHe
        }, {
            duration: 500,
            step: function () {
                if ((parseInt($("#limit").height()) - 30) < (parseInt($(this).offset().top) - parseInt($("#limit").offset().top) + $(this).height())) $(this).height(0).children().hide()
            }
        });
        $('#visor').children().not("#header, hr").animate({
            "height": $('#visor').height() + boxHeight - tHe
        }, {
            duration: 500
        });
        $('#bottombar').animate({
            "margin-top": -boxHeight + tHe
        }, {
            duration: 500
        });
        $('#visor').animate({
            "height": $('#visor').height() + boxHeight - tHe
        }, {
            duration: 500
        })
    }, function () {
        tHe = $("#tab").outerHeight(true);
        $(this).removeClass("tab-c");
        collapse = true;
        $('.item').animate({
            "margin-top": '0px'
        }, {
            duration: 500,
            step: function () {
                if ((parseInt($("#limit").height()) - 50) > (parseInt($(this).offset().top) - parseInt($("#limit").offset().top) + $(this).height())) $(".item").height(tHe).children().show()
            }
        });
        $('#visor').children().not("#header, hr").animate({
            "height": $('#visor').height() - boxHeight + tHe
        }, {
            duration: 500
        });
        $('#bottombar').animate({
            "margin-top": 0
        }, {
            duration: 500
        });
        $('#visor').animate({
            "height": $('#visor').height() - boxHeight + tHe
        }, {
            duration: 500
        })
    })
}

function loadContent() {
    var c = $(config_xml).find("pregunta").find("titulo").text();
    var d = $(config_xml).find("enunciado").text().replace("<p>", "").replace("</p>", "");
    ims.interfaz.setTitle(c);
    $("#pregunta").append(d);
    if ($(config_xml).find("pregunta").find("foto").length != 0) {
        var e = $(config_xml).find("pregunta").find("foto");
        var f = e.text();
        var g = e.attr("rotation");
        var h = e.attr("width");
        var i = e.attr("height");
        var x = e.attr("x");
        var y = parseInt(e.attr("y"));
        if (f != '') {
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                var j = new Number(RegExp.$1);
                if (j >= 8) {
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
    var k = $(config_xml).find("silenciar").text();
    var l = $(config_xml).find("palabras").find("ayuda").text();
    var m = $(config_xml).find("comprobar").text();
    var n = $(config_xml).find("desarrollosolucion").text();
    var o = $(config_xml).find("imprimir").text();
    var p = $(config_xml).find("versolucion").text();
    var q = $(config_xml).find("reiniciar").text();
    var r = $(config_xml).find("volver").text();
    ims.interfaz.addButton("Anterior", "left", "anterior", r);
    if (!isMobile && $(config_xml).find("urlimprimir").text().length > 0) ims.interfaz.addButton("imprimir", "left", "imprimir", o);
    if ($(config_xml).find("sonido").text() != '') {
        ims.interfaz.addButton("pausar", "left", "pause", $(config_xml).find("pausa").text());
        ims.interfaz.addButton("player", "left", "play", $(config_xml).find("reproducir").text())
    }
    if (!isMobile) ims.interfaz.addButton("silenciar", "left", "silenciar", k);
    ims.interfaz.addButton("reiniciar", "right", "reiniciar", q);
    ims.interfaz.addButton("clave", "right", "clave", n);
    ims.interfaz.addButton("versolucion", "right", "versolucion", p);
    ims.interfaz.addButton("comprobar", "right", "comprobar", m);
    ims.interfaz.addButton("ayuda", "right", "ayuda", l);
    $('#pausar').css('display', 'none');
    if ($(config_xml).find("sonido").text() != '') {
        ims.interfaz.enable("player");
        ims.interfaz.bind("player", 'a_player()');
        ims.interfaz.enable("pausar");
        ims.interfaz.bind("pausar", 'a_pausar()');
        sonido = $("#sonido").get(0)
    }
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
    ims.interfaz.enable("imprimir");
    $("#overall").remove()
}

function suelta() {
    var a = draggingObj;
    var b = 0;
    $(".target").each(function () {
        if ($(this).attr('id') == 'target_' + a.attr("id")) $(this).attr('id', '');
        if (a.attr("id") != "box")
            if (intersects(a, $(this)) && !($(this).attr("id"))) {
                objoff = $(this).offset();
                b++;
                a.attr({
                    "posicion": "0",
                    "left": objoff.left + "px",
                    "top": objoff.top + "px"
                }).css({
                    "top": "0px",
                    "left": "0px"
                });
                $(this).append(a.get()).attr("id", "target_" + a.attr("id"))
            }
    });
    if (b == 0) resetele(a);
    dragging = false
};

function resetele(a) {
    var b = $("#target_" + a.attr("id")).offset();
    if (a.attr("posicion") == "0") {
        $("#box").append(a.get());
        a.css({
            "left": b.left,
            "top": b.top
        });
        a.css({
            "left": a.attr("left"),
            "top": a.attr("top")
        }, 1500).attr("posicion", "-1")
    } else {
        a.css({
            "left": a.attr("x") + "px",
            "top": a.attr("y") + "px"
        }, 1500).attr("posicion", "-1")
    }
    $("#target_" + a.attr("id")).attr("id", "");
    $("#" + a.attr("posicion")).attr("rel", "-1")
};

function move(a, x, y) {
    if (dragging) a.css({
        "left": ((x)) + "px",
        "top": ((y)) + "px"
    })
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

function crearDrag(i) {
    var a = $(config_xml).find("combos").find("combo[id=\'" + i + "\']").text().split("#");
    var b = "<span class=\"target\"  rel=\"-1\">&nbsp;</span>";
    return b
};

function Remplazo(c, i) {
    var d = /\[(.*?)\]/;
    c.replace(d, function (a) {
        if (a != "") {
            var b = crearDrag(i);
            c = c.replace(a, b);
            i++;
            c = Remplazo(c, i)
        }
    });
    return c
};

function palabrasOk(c, i, d) {
    var e = /\[(.*?)\]/;
    c.replace(e, function (a) {
        if (a != "") {
            var b = crearDrag(i);
            c = c.replace(a, b);
            d[i] = a.replace("[", "").replace(/#/g, "").replace("]", "");
            i++;
            c = palabrasOk(c, i, d)
        }
    });
    return d
};

function getRandomArray(a, b) {
    var A = [];
    while (b >= a) A.push(b--);
    A.sort(function () {
        return .5 - Math.random()
    });
    return A
};

function comprobar() {
    if (checked == 0) {
        if ($(config_xml).find("solucion").find("texto1").text().length != 0) {
            ims.interfaz.enable("clave");
            ims.interfaz.addPopup("solucion", "clave");
            var d = 0;
            $("#clave").click(function () {
                if (d == 0) {
                    $("#content_solucion").width($("#content_solucion").width());
                    $("#content_solucion").height($("#content_solucion").height() - 20);
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
        $(this).addClass("tab-c");
        if (collapse == true) {
            collapse = false;
            $('.item[posicion=-1]').css({
                "margin-top": boxHeight
            }, {
                duration: 500
            });
            $('#visor').children().not("#header, hr").css({
                "height": $('#visor').height() + boxHeight
            }, {
                duration: 500
            });
            $('#bottombar').css({
                "margin-top": -boxHeight
            }, {
                duration: 500
            });
            $('#visor').css({
                "height": $('#visor').height() + boxHeight
            }, {
                duration: 500
            })
        } else {
            $('#visor').css({
                "height": $('#visor').height() + tHe
            }, {
                duration: 500
            });
            $('#bottombar').css({
                "margin-top": -boxHeight
            }, {
                duration: 500
            })
        }
        var g = $("#visor_content").find(".target").length;
        var c = 0;
        var h = $(config_xml).find("pregunta").find("texto").text();
        var i = $(config_xml).find("pregunta").find("texto");
        var j = new Array();
        var k = 0;
        j = palabrasOk(h, 0, j);
        $(".tablet_selection").removeClass('tablet_selection');
        $(".target").each(function (c) {
            if ($(this).attr("id")) {
                var a = $(this).attr("id").split("_");
                if ($("#item_" + a[2]).html().indexOf("img") != -1) {
                    testWord = j[a[2]];
                    j[c] = j[c].replace("  ", " ").replace(" />", ">")
                } else {
                    testWord = j[a[2]]
                } if (testWord == j[c]) {
                    $(this).css({
                        "background": "transparent"
                    });
                    $("#item_" + a[2]).addClass("green");
                    $("#item_" + a[2]).css("z-index", "2")
                } else {
                    $("#item_" + a[2]).css("z-index", "2");
                    $("#item_" + a[2]).addClass("red")
                }
            }
        });
        $(".item").each(function () {
            if ($(this).attr("posicion") != 0) $(this).hide()
        });
        $(".green").each(function () {
            ims.interfaz.showStars($(this).offset().left, $(this).offset().top, "center", $(this).attr("id"));
            ims.interfaz.showStars($(this).offset().left + $(this).width(), $(this).offset().top, "right", $(this).attr("id"))
        });
        k = $(".green").length;
        checked++;
        $("#center").css("z-index", "3");
        ims.interfaz.bind("versolucion", 'solucion()');
        if (k === g) {
            var l = "rGood"
        } else {
            var l = "rBad"
        };
        ims.interfaz.showResults("<p>" + k + " / " + g + "</p>");
        ims.interfaz.disable("comprobar");
        ims.interfaz.enable("versolucion");
        if (estado == 'parado') {
            ims.interfaz.playSound(l)
        }
    }
};

function solucion() {
    if ($("#versolucion").hasClass("notdisabled")) {
        $(".stars").remove();
        var i = 0;
        var a = $(config_xml).find("pregunta").find("texto").text();
        var b = new Array();
        b = palabrasOk(a, 0, b);
        $(".target").each(function (c) {
            $(".item").remove();
            $(this).append(b[i]);
            $(this).attr("id", "targ" + c);
            $(this).addClass("green");
            ims.interfaz.showStars($(this).offset().left, $(this).offset().top, "center", $(this).attr("id"));
            ims.interfaz.showStars($(this).offset().left + $(this).width(), $(this).offset().top, "right", $(this).attr("id"));
            i++
        });
        $("#center").hide();
        ims.interfaz.disable("versolucion");
        var d = "good";
        if (estado == 'parado') {
            ims.interfaz.playSound(d)
        }
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
    var a = $("#visor").jScrollPane().data().jsp;
    a.destroy();
    $("#visor").append("<div id='visor_content'></div>");
    $("#overall").hide();
    inicializar();
    posicionar()
};

function nextPage() {
    checked = 0, collapse = true;
    $("#limit,.tooltip,#intro_text").remove("");
    ims.interfaz.init();
    var a = $("#visor").jScrollPane().data().jsp;
    a.destroy();
    $("#visor").append("<div id='visor_content'></div>");
    cargar_actividad();
    if (!ims.interfaz.sound) {
        mute()
    };
    posicionar()
};

function reload() {
    checked = 0, collapse = true;
    $("#limit,.tooltip").remove("");
    ims.interfaz.init();
    var a = $("#visor").jScrollPane().data().jsp;
    a.destroy();
    $("#visor").append("<div id='visor_content'></div>");
    cargar_actividad();
    if (!ims.interfaz.sound) {
        mute()
    };
    ims.interfaz.resize();
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

function a_player() {
    estado = 'sonando';
    $('#player').css('display', 'none');
    $('#pausar').css('display', 'block');
    sonido.play();
    setTimeout(function () {
        if (sonido.currentTime == sonido.duration && $('#pausar').css('display') == 'block') {
            $('#pausar').css('display', 'none');
            $('#player').css('display', 'block');
            estado = 'parado'
        }
    }, sonido.duration * 1100)
}

function a_pausar() {
    sonido.pause();
    estado = 'parado';
    $('#pausar').toggle();
    $('#player').toggle()
}