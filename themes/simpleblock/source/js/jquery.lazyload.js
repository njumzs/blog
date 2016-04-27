/**
 * @author littenli
 * @date 2014-03-10 version 0.2
 * @description Í¼Æ¬ÑÓÊ±¼ÓÔØ£¬ÁÑÍ¼Ìæ»»£¬Í¼Æ¬´íÎóÉÏ±¨´¦Àí
 * @update Ôö¼Ó·Ç¿ÉÊÓÇøÓòÑÓÊ±¼ÓÔØ
 * @example $(".container").lazy(options);
 *          ±éÀú$(".container")½ÚµãÄÚµÄimg½Úµã£¬¶¼Ó¦ÓÃlazyload£»Èô´Ë½ÚµãÎªimg½Úµã£¬Ö»Ó¦ÓÃ´Ë½Úµã
 *          options.srcSign {String} ¿ÉÎª¿Õ.img½ÚµãÔ¼¶¨µÄsrc±êÖ¾£¬Ä¬ÈÏÎªlazy-src£»ÏìÓ¦img½ÚµãÎª£º<img lazy-src="img/hello.jpg" />
 *          options.errCallBack {Function} ¿ÉÎª¿Õ.Ìá¹©img¼ÓÔØÊ§°Ü»Øµ÷£¬¹©ÒµÎñ¶îÍâÈ¥´¦Àí¼ÓÔØÊ§°ÜÂß¼­
 *          options.container {Dom} Ìá¹©ÈİÆ÷½ÚµãÄÚ¿ÉÊÓÇøÓòµÄ¼ÓÔØÄÜÁ¦£¬Ä¬ÈÏÎªwindow
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root['jQuery']);
    }
}(this, function ($) {

    $.fn.lazyload = function(options) {
        return this.each(function() {

            options = options || {};
            var defualts = {};

            var opts = $.extend({}, defualts, options);
            var obj = $(this);
            var dom = this;

            var srcSign = options.srcSign || "lazy-src";
            var errCallBack = options.errCallBack || function(){};
            var container = options.container || $(window);

            /**
             * @description srcÕı³£
             */
            var imgload = function (e, target) {
                //todo: ÉÏ±¨
            }

            /**
             * @description srcÊ§Ğ§
             */
            var imgerr = function (e, target, fn, src) {
                if(target[0].src && (target[0].src.indexOf("img-err.png")>0 || target[0].src.indexOf("img-err2.png")>0)){
                    return ;
                }
                var w = target.width();
                var h = target.height();
                target[0].src = "/img/img-err.png";

                fn();
                //todo: ÉÏ±¨
            };

            var tempImg = function(target){
                var w = target.width();
                var h = target.height();
                var t = target.offset().top;
                var l = target.offset().left;
                var tempDom = target.clone().addClass("lazy-loding").insertBefore(target);
                tempDom[0].src = "/img/img-loading.png";
                target.hide();
            }
            /**
             * @description srcÌæ»»£¬loading¹ı³ÌÖĞÌí¼ÓÀàlazy-loading;
             */
            var setSrc = function(target, srcSign, errCallBack){

                if(target.attr("src"))return ;

                if(options.cache == true){
                    console.log(target);
                    //´æ½ølocalstorage
                    var canvas1 = document.getElementById('canvas1');
                    var ctx1 = canvas1.getContext('2d');
                    var imageData;

                    image = new Image();
                    image.src = target.attr(srcSign);
                    image.onload=function(){
                        ctx1.drawImage(image,0,0);
                        imageData = ctx1.getImageData(0,0,500,250);
                        console.log(imageData);
                    }

                }else{
                    tempImg(target);

                    var src = target.attr(srcSign);
                    target[0].onerror = function (e) {
                        imgerr(e, target, errCallBack, src);
                    };
                    target[0].onload = function (e) {
                        target.parent().find(".lazy-loding").remove();
                        target.show();
                        imgload(e, target);
                    }
                    target[0].src = src;
                }
            }

            /**
             * @description ÖØ×é
             */
            opts.cache = [];

            if(dom.tagName == "IMG"){
                var data = {
                    obj: obj,
                    tag: "img",
                    url: obj.attr(srcSign)
                };
                opts.cache.push(data);
            }else{
                var imgArr = obj.find("img");
                imgArr.each(function(index) {
                    var node = this.nodeName.toLowerCase(), url = $(this).attr(srcSign);
                    //ÖØ×é
                    var data = {
                        obj: imgArr.eq(index),
                        tag: node,
                        url: url
                    };
                    opts.cache.push(data);
                });
            }


            //¶¯Ì¬ÏÔÊ¾æ??¾İ
            var scrollHandle = function() {
                var contHeight = container.height();
                var contop;
                if ($(window).get(0) === window) {
                    contop = $(window).scrollTop();
                } else {
                    contop = container.offset().top;
                }
                $.each(opts.cache, function(i, data) {
                    var o = data.obj, tag = data.tag, url = data.url, post, posb;
                    if (o) {
                        post = o.offset().top - contop, post + o.height();

                        if ((post >= 0 && post < contHeight) || (posb > 0 && posb <= contHeight)) {
                            if (url) {
                                //ÔÚä¯ÀÀÆ÷çª????ÄÚ
                                if (tag === "img") {
                                    //¸Ä±äsrc
                                    setSrc(o, srcSign, errCallBack);
                                }
                            }
                            data.obj = null;
                        }
                    }
                });
            }

            //¼ÓÔØÍê±Ï¼´Ö´ĞĞ
            scrollHandle();
            //¹öå??Ö´ĞĞ
            container.bind("scroll", scrollHandle);
            container.bind("resize", scrollHandle);

        });
    };

}));

