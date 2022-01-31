$(function() {
    function WebcamExtrasViewModel(parameters) {
        this.onStartupComplete = function() {

			var fullscreen_handler = function() {
                if (!document.fullscreenElement) {
                    var elem = $("body > #webcam_container")[0] || $("#control #webcam_container")[0];
                    var req = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen;
                    req.call(elem);
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
	        };
	  
	        $("#webcam_container").before($('<div class="webcam-extras-floating-window-placeholder">' +
	            '<span class="fa-stack fa-4x"><i class="fas fa-expand fa-stack-2x"></i><i class="fas fa-window-restore fa-stack-1x"></i></span></div>'));
	        $("#webcam_container").append('<div class="webcam-extras"></div>');
			$(".webcam-extras").append($('<button class="btn webcam-extras-floating-window"><i class="fas fa-window-restore fa-flip-horizontal"></i></button>'));
            $(".webcam-extras").append($('<button class="btn btn-primary webcam-extras-fullscreen"><i class="fas fa-expand"></i></button>'));
	        $("#webcam_rotator").on("click", function(e) {
				if(!$("#webcam_rotator").hasClass("zoomed-in")) {
					var zoomHandler = function(e) {
						function getCursorPos(e) {
							var a, x = 0, y = 0;
							e = e || window.event;
							/*get the x and y positions of the image:*/
							a = document.getElementById("webcam_rotator").getBoundingClientRect();
							/*calculate the cursor's x and y coordinates, relative to the image:*/
							x = e.pageX - a.left;
							y = e.pageY - a.top;
							/*consider any page scrolling:*/
							x = x - window.pageXOffset;
							y = y - window.pageYOffset;
							return {x : x, y : y};
						}
						var pos = getCursorPos(e);
						$("#webcam_image").css(
							"transform",
							"scale(3) translate(" + ($("#webcam_image").width()/3 - pos.x/1.5) + "px, " + ($("#webcam_image").height()/3 - pos.y / 1.5) + "px)"
						);
					}
					zoomHandler(e);
					
					$("#webcam_rotator").on("mousemove touchmove", zoomHandler);
					$("#webcam_rotator").on("mouseout touchout", function(e) {
						$("#webcam_image").css("transform", "none");
					});
				} else {
					$("#webcam_rotator").off("mousemove touchmove mouseout touchout");
					$("#webcam_image").css("transform", "none");
				}
				$("#webcam_rotator").toggleClass("zoomed-in");
			});
			$('.webcam-extras-fullscreen').on("click", fullscreen_handler);
	        $('#webcam_container').on("dblclick", fullscreen_handler);
	        $('.webcam-extras-floating-window, .webcam-extras-floating-window-placeholder .fa-stack').on("click", function() {
	            var relative = $('#control #webcam_container');
	            var placeholder = $('.webcam-extras-floating-window-placeholder').show();
	            if (!$('body > #webcam_container').length) {
	                if (document.fullscreenElement) document.exitFullscreen();
	                relative.hide().clone(true, true).appendTo('body')
	                    .fadeIn()
	                    .on('mousedown', function(e){
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
	                        $(window).on('mousemove', function(e){
		                        var itop = e.pageY + ypos - height;
		                        var ileft = e.pageX + xpos - width;
		                        
		                        if(dr.hasClass("drag")){
			                        if(itop <= min_top ) { itop = min_top; }
			                        if(ileft <= min_left ) { ileft = min_left; }
			                        if(itop >= max_top ) { itop = max_top; }
			                        if(ileft >= max_left ) { ileft = max_left; }
			                        dr.offset({ top: itop,left: ileft});
		                        }
	                        }).on('mouseup', function(e){
			                        dr.removeClass("drag");
	                        });
                        });
	                    //.draggable({ containment: "window" })
	                    //.resizable({aspectRatio: 16 / 9, handles: "n, e, s, w", minHeight: 150, maxHeight: $( window ).height() - 100});
	                relative.next().css('opacity', 0);
	                placeholder.show();
	            } else {
	                $('body > #webcam_container').remove();
	                
	                relative.fadeIn().next().css('opacity', 1);
	                placeholder.hide();
	            }
	        });
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        WebcamExtrasViewModel,
        ["controlViewModel"],
        ["#webcam_container"]
    ]);
});
