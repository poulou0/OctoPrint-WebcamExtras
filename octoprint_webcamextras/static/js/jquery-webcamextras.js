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
	        $('.webcam-extras-fullscreen').on("click", fullscreen_handler);
	        $('#webcam_container').on("dblclick", fullscreen_handler);
	        $('.webcam-extras-floating-window, .webcam-extras-floating-window-placeholder .fa-stack').on("click", function() {
	            var relative = $('#control #webcam_container');
	            var placeholder = $('.webcam-extras-floating-window-placeholder').show();
	            if (!$('body > #webcam_container').length) {
	                if (document.exitFullscreen) document.exitFullscreen();
	                relative.hide().clone(true, true).appendTo('body')
	                    .fadeIn()
	                    .draggable({ containment: "window" })
	                    .resizable({aspectRatio: 16 / 9, handles: "n, e, s, w", minHeight: 150, maxHeight: $( window ).height() - 100});
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

