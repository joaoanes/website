var currentHeader = "#start";
var tinyHeader = false;
var headerMap = {};
var colorMap = {};

var phoneOn = false;

headerMap["#des"] = "#bg2";
headerMap["#eng"] = "#bg1";
headerMap["#photo"] = "#bg3";
headerMap["#human"] = "#bg4";
headerMap["#start"] = "#bg4";



colorMap["#des"] = "rgb(224, 140, 30)";
colorMap["#eng"] = "rgb(140, 45, 25)";
colorMap["#photo"] = "rgb(113, 34, 231)";
colorMap["#human"] = "#b1ff35";



var redirMap = {};

function hideFirst() {
    $('#first').fadeOut(100);
    $.cookie('site_joaoanes', 'hello! thanks for visiting! drop me an email!', {
        expires: 365,
        path: '/'
    });
}

function scrollToTop() {
    $("html, body").velocity({
        "scrollTop": "0"
    }, 500);
}

var side_state = null;

function flip() {


    flipped = !flipped;
    if (flipped) {
        side_state = $("#side_menu").css("display");
        $("#side_menu").css("display", "none");
        $(".back").css("z-index", "2");
        $(".back").css("display", "block");
        $(".front").css("z-index", "1");
        previous = $("#content").css("height");
        $(".cv_right, .cv_left").css("-webkit-backface-visibility", "initial");
        $(".cv_right, .cv_left").css("backface-visibility", "initial");
        $(".cv_right, .cv_left").css("-moz-backface-visibility", "initial");
        $(".cv_right, .cv_left").css("-o-backface-visibility", "initial");
        $(".cv_container").css("display", "block");
        $(".back").css("height", "auto");
        setTimeout(function () {

            $("#content").css("height", "0");
            $(".cv_right, .cv_left").css("-webkit-backface-visibility", "hidden");
            $(".cv_right, .cv_left").css("backface-visibility", "hidden");
            $(".cv_right, .cv_left").css("-moz-backface-visibility", "hidden");
            $(".cv_right, .cv_left").css("-o-backface-visibility", "hidden");


            setTimeout(function () {
                $(".cv_right").toggleClass("hovered");
                setTimeout(function () {
                    $(".cv_right").toggleClass("hovered");
                }, 1200);

            }, 1000);
        }, 600);
    } else {
        $(".back").css("height", "100vh");

        $("#side_menu").css("display", side_state);
        $(".back").css("z-index", "1");
        $(".front").css("z-index", "2");
        if (previous != "0px")
            $("#content").css("height", "auto");
        else
            $("#content").css("height", previous);
        setTimeout(function () {

            $(".back").css("display", "none");
            $(".cv_container").css("display", "none");
            $(".cv_left").removeAttr('style');
            $(".cv_right").removeAttr('style');
        }, 500);
    }

    $(".flip-container").toggleClass("flip");
}

function resetHeader() {
    $(currentHeader + "_div").hide();

    if (currentHeader == "#human")
        currentHeader = "#start";

    if (currentHeader != "#start") {
        $(headerMap[currentHeader]).fadeOut(500);
        $("#bg4").fadeIn(500);
    }

    $("#content").height(0);

    $("#header").height("100%");
    $(".top_button").css("color", "white");
    $("#mainsq").velocity({
        "bottom": "100"
    }, 500);


    currentHeader = "#start";
    $("#side_menu").hide();
    tinyHeader = false;
}

function changeHeader(destination) {

    if (!tinyHeader) {
        $("#header").height(200);
        $("#content").height("auto");
        tinyHeader = true;
    }

    if (destination === "#eng" && !phoneOn)
                            {
                                phoneOn = true;
                                setTimeout(function(){$("#yo").html('<object width="100%" height="100%" data="yestour.php"/>');}, 600) 
                            }

    if (currentHeader == "#start") {
        $(destination + "_div").fadeIn(500, function () {
            if (destination == "#photo") {

                $(".mryholder").masonry({
                    itemSelector: ".photo_item",
                    gutter: 5,
                    isFitWidth: true
                });
                $(".mryholder_reverse").masonry({
                    itemSelector: ".photo_item",
                    gutter: 5,
                    isFitWidth: true
                });
            }
            $(".skills_masonry").masonry('layout');
        });
    } else {
        if (destination != currentHeader) {
            $(currentHeader + "_div").fadeOut(500,
                function () {

                    $(destination + "_div").fadeIn(500,
                        function () {
                            $(".skills_masonry").masonry('layout');
                            if (destination == "#photo") {
                                $(".mryholder").masonry({
                                    itemSelector: ".photo_item",
                                    gutter: 5,
                                    isFitWidth: true
                                });
                            }
                            
                        });
                });

        } else
            return;
    }
    if (!((destination == "#human") && (currentHeader == "#start"))) {
        $(headerMap[currentHeader]).fadeOut(1000);
        $(headerMap[destination]).fadeIn(1000);
    }
    currentHeader = destination;


    $("#content").css("background", colorMap[destination]);
}

var flipped = false;
var previous;
$(document).ready(function () {
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

    var hash = window.location.hash;
    $("#side_menu").fadeOut();
    $(".first_hide").click(hideFirst);

    $(".cv_left, .cv_right").click(function () {
        $(".cv_left").css("-webkit-transform", "rotatey(-180deg)");
        $(".cv_left").css("-o-transform", "rotatey(-180deg)");
        $(".cv_left").css("-moz-transform", "rotatey(-180deg)");
        $(".cv_left").css("transform", "rotatey(-180deg)");
        $(".cv_right").css("-webkit-transform", "rotatey(180deg)");
        $(".cv_right").css("-o-transform", "rotatey(180deg)");
        $(".cv_right").css("-moz-transform", "rotatey(180deg)");
        $(".cv_right").css("transform", "rotatey(180deg)");

    });

    $(".flip_preview").click(flip);

    $(".skills_masonry").data('masonry');

    $(".skills_masonry").masonry({

        itemSelector: '.skill_card_masonry',
        isFitWidth: true

    });

    if ($.cookie('site_joaoanes') == undefined) {
        $("#first").css("display", "block");
        $("#side_menu_tutorial").css("display", "block");
    } else {

        $("#side_menu_tutorial").css("display", "none");
    }
    $('#engineers_are_human_too').click(function () {
        scrollToTop();
        changeHeader("#human");

    });

    $("#name").click(resetHeader);

    $('#side_menu').hover(function () {
        $(this).css("left", "0");
        $("#side_menu_tutorial").fadeOut(500);
    }, function () {

        $(this).css("left", "-50");


    });

    $(".side_menu_element").click(function () {
        $(".side_menu_element.active").toggleClass("active");
        $(this).toggleClass("active");
        scrollToTop();
        changeHeader($(this).text());
    });

    $(".top_button").click(function () {
        $("#mainsq").velocity({
            "bottom": "0"
        }, 500);
        changeHeader("#" + this.id);
    });

    $(".top_button_s").click(function () {
        $("#header").height(200);
    });

    $("#des").click(function () {
        $("#extra_n").hide();
        $("#human").css("color", "white");
        $("#des").css("color", "rgb(224, 140, 30)");
        $("#eng").css("color", "white");
        $("#photo").css("color", "white");
        /*
    $("#header").css("background-image", "url('bg_designer.png')");
    $("#header").css("background-size", "cover");
    */

    });

    $("#eng").click(function () {
        $("#extra_n").show();
        $("#eng").css("color", "rgb(140, 45, 25)");
        $("#des").css("color", "white");
        $("#photo").css("color", "white");
        $("#human").css("color", "white");
        /*
    $("#header").css("background-image", "url('bg_engineer.png')");
    $("#header").css("background-size", "cover");
    $("#header").css("background-position-y", "-400");*/

    });

    $("#photo_work").click(function () {
        updateImageWall();

    });



    $("#photo").click(function () {
        $("#extra_n").hide();
        $("#photo").css("color", "rgb(113, 34, 231)");
        $("#des").css("color", "white");
        $("#eng").css("color", "white");
        $("#human").css("color", "white");
    });

    $("#human").click(function () {
        $("#extra_n").hide();
        $("#eng").css("color", "white");
        $("#des").css("color", "white");
        $("#photo").css("color", "white");
        $("#human").css("color", "rgb(215, 255, 0");

    });

    $(".skill_card").hover(function () {
            $($(this).children()[2]).velocity({
                right: "-170"
            }, 100);
            $($($(this).children()[1]).children()[0]).fadeOut(100);
        },
        function () {
            $($(this).children()[2]).velocity({
                right: "0"
            }, 100);

            $($($(this).children()[1]).children()[0]).fadeIn(100);
        });

    $(".skill_card:last-child").unbind("mouseenter mouseleave");

    $(".skill_card:last-child").hover(function () {
            $($(this).children()[0]).fadeOut(100);
            $($($(this).children()[1]).children()[0]).fadeOut(100);
        },
        function () {

            $($($(this).children()[1]).children()[0]).fadeIn(100);

            $($(this).children()[0]).fadeIn(100);
        });

    if (hash != null) {
        if (hash == "#resume") {
            setTimeout(flip, 1000);
        } else {
            var stuff = (hash.substring(0, hash.lastIndexOf("_")));
            window.setTimeout(function () {
                $(stuff).trigger("click");
            }, 800);
        }
    }

    var global_name = "";

    $('.container_image.cool').hover(function () {
        $(this).css("background-size", "0");
        $($(this).parent().parent().children()[1]).hide("slide", 400); //fadeOut(500);
        $(this).velocity({
            "width": "700px",
            "height": "700px"
        }, 500);
        global_name = this.src;
        this.src = this.src.substring(0, this.src.lastIndexOf('.')) + "_hd" + this.src.substring(this.src.lastIndexOf('.'));
    }, function () {
        $(this).css("background-size", "30px");
        $(this).velocity({
            "width": "350px",
            "height": "350px"
        }, 500, function () {

            $ ($(this).parent().parent().children()[1]).fadeIn(500);
        });
        this.src = global_name;
    });

setTimeout(function(){
$("#top").velocity({left: "10%", opacity: 1}, 1000, "easeOutQuint");
}, 1500);


setTimeout(function(){
$("#bottom").velocity({left: "10%", opacity: 1}, 1000, "easeOutQuint");
}, 1800);



});


var photoInit = false;

function updateImageWall() {
    if (!$('.photo_item').hasClass('shown')) {

        $(".mryholder").masonry({
            itemSelector: ".photo_item",
            gutter: 5,
            isFitWidth: true
        });

        $(".mryholder_reverse").masonry({
            itemSelector: ".photo_item",
            gutter: 5,
            isFitWidth: true,
            isOriginTop: false
        });
        $.each($('.mryholder .photo_item').get(), function (index) {
            if (index == 0) index = 1;


            var speed = (0.5 + index * 0.15) + "s";
            var delay = (function () {
                if (index < 5) return 0;
                else return (index * 0.10);
            });
            var sup = this;
            setTimeout(function () {
                $(sup).css('visibility', 'visible');
                $(sup).css('animation', "animatedIntro " + speed + " ease-out forwards");
            }, delay());
        });

        $.each($('.mryholder_reverse .photo_item').get(), function (index) {
            if (index == 0) index = 1;


            var speed = (0.5 + index * 0.15) + "s";
            var delay = (function () {
                if (index < 5) return 0;
                else return (index * 0.10);
            });
            var sup = this;
            setTimeout(function () {
                $(sup).css('visibility', 'visible');
                $(sup).css('animation', "animatedIntroRev " + speed + " ease-out forwards");
            }, delay());
        });

        $('.photo_item').addClass('shown');
        photoInit = true;
    }

}


$(window).scroll(function () {

    $(".mryholder_reverse").masonry('layout');

    if (!flipped) {
        if ($(this).scrollTop() > 400)
            $("#side_menu").fadeIn(200);
        else
            $("#side_menu").fadeOut(200);
    }

    if (currentHeader == "#photo") {
        if ($(document).scrollTop() >= $('#photo_div .bio').offset().top - $(screen)[0].availHeight / 3) {
            if (!photoInit) {
                updateImageWall();
            }
        }
    }

});