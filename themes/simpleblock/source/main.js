if($(".instagram").length) {
        require(['/js/photo.js', '/fancybox/jquery.fancybox.js', '/js/jquery.lazyload.js'], function(obj) {
            obj.init();
        });
    }
