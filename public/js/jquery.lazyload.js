/**
 * @author littenli
 * @date 2014-03-10 version 0.2
 * @description ͼƬ��ʱ���أ���ͼ�滻��ͼƬ�����ϱ�����
 * @update ���ӷǿ���������ʱ����
 * @example $(".container").lazy(options);
 *          ����$(".container")�ڵ��ڵ�img�ڵ㣬��Ӧ��lazyload�����˽ڵ�Ϊimg�ڵ㣬ֻӦ�ô˽ڵ�
 *          options.srcSign {String} ��Ϊ��.img�ڵ�Լ����src��־��Ĭ��Ϊlazy-src����Ӧimg�ڵ�Ϊ��<img lazy-src="img/hello.jpg" />
 *          options.errCallBack {Function} ��Ϊ��.�ṩimg����ʧ�ܻص󣬹�ҵ������ȥ��������ʧ���߼�
 *          options.container {Dom} �ṩ�����ڵ��ڿ��������ļ���������Ĭ��Ϊwindow
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
             * @description src����
             */
            var imgload = function (e, target) {
                //todo: �ϱ�
            }

            /**
             * @description srcʧЧ
             */
            var imgerr = function (e, target, fn, src) {
                if(target[0].src && (target[0].src.indexOf("img-err.png")>0 || target[0].src.indexOf("img-err2.png")>0)){
                    return ;
                }
                var w = target.width();
                var h = target.height();
                target[0].src = "/img/img-err.png";

                fn();
                //todo: �ϱ�
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
             * @description src�滻��loading������������lazy-loading;
             */
            var setSrc = function(target, srcSign, errCallBack){

                if(target.attr("src"))return ;

                if(options.cache == true){
                    console.log(target);
                    //����localstorage
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
             * @description ����
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
                    //����
                    var data = {
                        obj: imgArr.eq(index),
                        tag: node,
                        url: url
                    };
                    opts.cache.push(data);
                });
            }


            //��̬��ʾ�??��
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
                                //����������????��
                                if (tag === "img") {
                                    //�ı�src
                                    setSrc(o, srcSign, errCallBack);
                                }
                            }
                            data.obj = null;
                        }
                    }
                });
            }

            //�������ϼ�ִ��
            scrollHandle();
            //���??ִ��
            container.bind("scroll", scrollHandle);
            container.bind("resize", scrollHandle);

        });
    };

}));

