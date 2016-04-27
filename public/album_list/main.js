require.config({
　　　　paths: {
　　　　　　"lazy": "/js/jquery.lazyload",
            "fancybox": "/fancybox/jquery.fancybox",
　　　　　　"album": "/js/album",
　　　　},
        waitSeconds: 0
　　});
require(["lazy","fancybox",'album'], function(lazy,fancybox,album) {
            album.init();
        });

