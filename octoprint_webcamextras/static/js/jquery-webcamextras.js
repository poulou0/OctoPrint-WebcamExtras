$(function () {
    if ($(".touchui").length) return;
    var webcam_container_selector = "#webcam_plugins_container, #dashboard_webcam_container";
    var webcam_container_selector_control_tab = "#webcam_plugins_container";
    function WebcamExtrasViewModel(parameters) {
        this.onStartupComplete = function () {

            var fullscreen_handler = function (e) {
                if (!document.fullscreenElement) {
                    var elem = $(e.currentTarget).parents(webcam_container_selector).get(0);
                    var req = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen;
                    req.call(elem);
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            };

            $(webcam_container_selector).before($('<div class="webcam-extras-floating-window-placeholder">' +
                '<span class="fa-stack fa-4x"><i class="fas fa-expand fa-stack-2x"></i><i class="fas fa-window-restore fa-stack-1x"></i></span></div>'));
            $(webcam_container_selector).append('<div class="webcam-extras"></div>');
            $(webcam_container_selector).find(".webcam-extras").append($('<a class="webcam-extras-floating-window-button"><i class="fas fa-window-restore fa-flip-horizontal"></i></a>'));
            $(".webcam-extras").append($('<a class="webcam-extras-fullscreen"><i class="fas fa-expand"></i></a>'));

            $(document).on("click", "#webcam_rotator, .webcam_unrotated, #dashboard_webcam_toggle", function (e) {
                var img_wrapper = $(this);
                var img = img_wrapper.find("img");
                if (!img_wrapper.hasClass("zoomed-in")) {
                    var zoomHandler = function (e) {
                        function getCursorPos(e) {
                            var a, x = 0, y = 0;
                            e = e || window.event;
                            /*get the x and y positions of the image:*/
                            a = img_wrapper[0].getBoundingClientRect();
                            /*calculate the cursor's x and y coordinates, relative to the image:*/
                            x = e.pageX - a.left;
                            y = e.pageY - a.top;
                            /*consider any page scrolling:*/
                            x = x - window.pageXOffset;
                            y = y - window.pageYOffset;
                            return { x: x, y: y };
                        }
                        var pos = getCursorPos(e);
                        img.css(
                            "transform",
                            (img.hasClass("flipH") && img.hasClass("flipV") ? "scaleX(-1) scaleY(-1)" : (img.hasClass("flipH") ? "scaleX(-1)" : (img.hasClass("flipV") ? "scaleY(-1)" : ""))) +
                            " scale(3) translate(" + (img.width() / 3 - pos.x / 1.5) * (img.hasClass("flipH") ? -1 : 1) + "px, " + (img.height() / 3 - pos.y / 1.5) * (img.hasClass("flipV") ? -1 : 1) + "px)"
                        );
                    }
                    zoomHandler(e);

                    img_wrapper.on("mousemove touchmove", zoomHandler);
                    img_wrapper.on("mouseout touchout", function (e) {
                        img.css("transform", img.hasClass("flipH") && img.hasClass("flipV") ? "scaleX(-1) scaleY(-1)" : (img.hasClass("flipH") ? "scaleX(-1)" : (img.hasClass("flipV") ? "scaleY(-1)" : "none")));
                    });
                } else {
                    img_wrapper.off("mousemove touchmove mouseout touchout");
                    img.css("transform", img.hasClass("flipH") && img.hasClass("flipV") ? "scaleX(-1) scaleY(-1)" : (img.hasClass("flipH") ? "scaleX(-1)" : (img.hasClass("flipV") ? "scaleY(-1)" : "none")));
                }
                img_wrapper.toggleClass("zoomed-in");
            });
            $(document).on("dblclick", "#webcam_rotator, .webcam_unrotated, #dashboard_webcam_toggle", fullscreen_handler);

            $(document).on("click", ".webcam-extras-fullscreen", fullscreen_handler);
            $(document).on("click", ".webcam-extras-floating-window-button, .webcam-extras-floating-window-placeholder .fa-stack", function () {
                var relative = $('#control ' + webcam_container_selector_control_tab);
                var placeholder = $('.webcam-extras-floating-window-placeholder').show();
                if (!$('body > .webcam-extras-floating-window').length) {
                    if (document.fullscreenElement) document.exitFullscreen();
                    relative.hide().clone(true, true).appendTo('body')
                        .fadeIn()
                        .addClass("webcam-extras-floating-window")
                        .on('mousedown', function (e) {
                            //https://www.sanwebe.com/2014/10/draggable-element-with-jquery-no-jquery-ui
                            var dr = $(this).addClass("drag");
                            height = dr.outerHeight();
                            width = dr.outerWidth();
                            
                            max_left = window.innerWidth - dr.width();
                            max_top = window.innerHeight - dr.height();

                            ypos = dr.offset().top + height - e.pageY,
                                xpos = dr.offset().left + width - e.pageX;
                            $(window).on('mousemove', function (e) {
                                var itop = e.pageY + ypos - height;
                                var ileft = e.pageX + xpos - width;

                                if (dr.hasClass("drag")) {
                                    if (itop <= 0) { itop = 0; }
                                    if (ileft <= 0) { ileft = 0; }
                                    if (itop >= max_top) { itop = max_top; }
                                    if (ileft >= max_left) { ileft = max_left; }
                                    dr.offset({ top: itop, left: ileft });
                                }
                            }).on('mouseup', function (e) {
                                dr.removeClass("drag");
                            });
                        });
                    //.draggable({ containment: "window" })
                    //.resizable({aspectRatio: 16 / 9, handles: "n, e, s, w", minHeight: 150, maxHeight: $( window ).height() - 100});
                    relative.next().css('opacity', 0);
                    placeholder.show();
                } else {
                    $('body > .webcam-extras-floating-window').remove();

                    relative.fadeIn().next().css('opacity', 1);
                    placeholder.hide();
                }
            });
            $(window).on("resize", function() {
                var floatingWindow = $('body > .webcam-extras-floating-window');
                if (floatingWindow.length) {
                    var max_top = window.innerHeight - floatingWindow.height();
                    var max_left = window.innerWidth - floatingWindow.width();
                    var itop = floatingWindow.offset().top;
                    var ileft = floatingWindow.offset().left;
                    if (itop >= max_top) { floatingWindow.offset({ top: max_top }); }
                    if (ileft >= max_left) { floatingWindow.offset({ left: max_left }); }
                }
            })
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        WebcamExtrasViewModel,
    ]);
});
