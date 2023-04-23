$(function () {
    var webcam_container_selector = $("#webcam_container").length === 0 ? "#webcam_img_container" : "#webcam_container";
    function WebcamExtrasViewModel(parameters) {
        this.onStartupComplete = function () {

            var fullscreen_handler = function (e) {
                if (!document.fullscreenElement) {
                    var elem = $(e.currentTarget).parents(webcam_container_selector).get(0);
                    if (!elem) elem = $(e.currentTarget).parents("#IUCWebcamContainer").get(0);
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
            if (!$(webcam_container_selector).find(".UICWebCamClick").length) $(webcam_container_selector).append('<div class="webcam-extras"></div>');
            if (!$("#IUCWebcamContainer").find(".UICWebCamClick").length) $("#IUCWebcamContainer").append('<div class="webcam-extras"></div>');
            $(webcam_container_selector + " .webcam-extras").append($('<button class="btn webcam-extras-floating-window"><i class="fas fa-window-restore fa-flip-horizontal"></i></button>'));
            $(".webcam-extras").append($('<button class="btn btn-primary webcam-extras-fullscreen"><i class="fas fa-expand"></i></button>'));
            $(document).on("click", "#webcam_rotator, .webcam_unrotated, #IUCWebcamContainerInner, #UICWebCamFull", function (e) {
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
                            "scale(3) translate(" + (img.width() / 3 - pos.x / 1.5) + "px, " + (img.height() / 3 - pos.y / 1.5) + "px)"
                        );
                    }
                    zoomHandler(e);

                    img_wrapper.on("mousemove touchmove", zoomHandler);
                    img_wrapper.on("mouseout touchout", function (e) {
                        img.css("transform", "none");
                    });
                } else {
                    img_wrapper.off("mousemove touchmove mouseout touchout");
                    img.css("transform", "none");
                }
                img_wrapper.toggleClass("zoomed-in");
            });
            $('.webcam-extras-fullscreen').on("click", fullscreen_handler);
            if (!$(webcam_container_selector).find(".UICWebCamClick").length) $('#webcam_rotator').on("dblclick", fullscreen_handler);
            if (!$("#IUCWebcamContainer").find(".UICWebCamClick").length) $('#IUCWebcamContainerInner').on("dblclick", fullscreen_handler);
            $('.webcam-extras-floating-window, .webcam-extras-floating-window-placeholder .fa-stack').on("click", function () {
                var relative = $('#control ' + webcam_container_selector);
                var placeholder = $('.webcam-extras-floating-window-placeholder').show();
                if (!$('body > ' + webcam_container_selector).length) {
                    if (document.fullscreenElement) document.exitFullscreen();
                    relative.hide().clone(true, true).appendTo('body')
                        .fadeIn()
                        .on('mousedown', function (e) {
                            //https://www.sanwebe.com/2014/10/draggable-element-with-jquery-no-jquery-ui
                            var dr = $(this).addClass("drag");
                            height = dr.outerHeight();
                            width = dr.outerWidth();
                            max_left = dr.parent().offset().left + dr.parent().width() - dr.width();
                            max_top = dr.parent().offset().top + dr.parent().height() - dr.height();
                            min_left = dr.parent().offset().left;
                            min_top = dr.parent().offset().top;

                            ypos = dr.offset().top + height - e.pageY,
                                xpos = dr.offset().left + width - e.pageX;
                            $(window).on('mousemove', function (e) {
                                var itop = e.pageY + ypos - height;
                                var ileft = e.pageX + xpos - width;

                                if (dr.hasClass("drag")) {
                                    if (itop <= min_top) { itop = min_top; }
                                    if (ileft <= min_left) { ileft = min_left; }
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
                    $('body > ' + webcam_container_selector).remove();

                    relative.fadeIn().next().css('opacity', 1);
                    placeholder.hide();
                }
            });
        };
    }

    if ($("#webcam_container").length === 0) {
        OCTOPRINT_VIEWMODELS.push([
            WebcamExtrasViewModel,
            ["controlViewModel"],
            ["#webcam_container"]
        ]);
    } else {
        OCTOPRINT_VIEWMODELS.push([
            WebcamExtrasViewModel,
            ["controlViewModel"],
            ["#webcam_img_container"]
        ]);
    }
});
