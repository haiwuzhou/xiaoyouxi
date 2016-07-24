/**
 * Created by delan on 2015/11/24.
 */
var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    slidesPerView: '2',
    loop: false,
    spaceBetween: 10,

});

window.onload = function() {
    $('.slide-img').show();
    $('.game-tags').html(genTagsHtml(tags));
    /*    acid && ( acid== 5) && storage.setItem('acid', '5');*/
};
recordOrder && recordOrder == 4 && ((function() {
    $('.game-rank').hide();
})());

$('.diy-tab-item').click(function() {
    var index = $(this).index();
    $('.mui-control-content').removeClass('mui-active');
    $('.mui-control-content').eq(index).addClass('mui-active');
    $('.diy-tab-item').removeClass('mui-active');
    $('.diy-tab-item').eq(index).addClass('mui-active');
});

function genTagsHtml(tags) {
    var tagsArr = tags.split(',');
    var tagsHtml = "";
    for (var i = 0; i < tagsArr.length; i++) {
        tagsHtml += tagsArr[i] && ("<span>" + tagsArr[i] + "</span>");
    }
    return tagsHtml;
}

function goback() {
    var back = document.referrer;
    if (back) {
        window.location = back;
    } else {
        window.location = homeUrl
    }
}

/* start game btn click logic */
$('.play-btn').click(function() {
    var charge = $(this).attr('data-charge');
    if (storage.getItem('acid') && +charge) {
        $('.charge-tip').css('-webkit-transform', 'translateX(0)');
        var timer = setInterval(function() {
            $('#count-down').text(countDown);
            if (--countDown <= 0) {
                clearInterval(timer);
                window.location = about_248;
            }
        }, 1000);
        return false;
    }
});

/* game like btn logic*/
$('.like-btn').click(function() {
    var target = $(this).attr('url');
    if (!target) return true;
    var icon_collect = $(this).find('.icon-like');
    var likeCnt = parseInt($('.like-num').html());
    var type = 0;
    if (icon_collect.hasClass('icon-like-no')) {
        icon_collect.removeClass('icon-like-no').addClass('icon-like-yes');
        $('.like-num').html(likeCnt + 1);
        type = 1;
    } else {
        icon_collect.removeClass('icon-like-yes').addClass('icon-like-no');
        $('.like-num').html(likeCnt - 1);
    }
    target = target + type;
    $.get(target, function(data) {});
});

/* collect game logic */
$('.collect-btn').click(function() {
    var gameId = $(this).attr('data-id');
    var target;
    var icon_collect = $(this).find('.icon-collect');
    if (icon_collect.hasClass('icon-collect-no')) {
        icon_collect.removeClass('icon-collect-no').addClass('icon-collect-yes');
        target = collectUrl;
    } else {
        icon_collect.removeClass('icon-collect-yes').addClass('icon-collect-no');
        target = delCollect;
    }

    $.get(target, function(data) {
        if (data.status == 0 && data.url) {
            window.location = data.url;
        }
    });
});
String.prototype.temp = function(obj) {
    return this.replace(/\##\w+\##/gi, function(matchs) {
        var returns = obj[matchs.replace(/\##/g, "")];
        return (returns + "") == "undefined" ? "" : returns;
    });
};
/* game comments logic */
(function() {
    var commentTpl = $('#comment-tpl').text();
    var replyTpl = $('#comment-reply-tpl').text();
    var replyHideTpl = $('#reply-tpl-hide').text();
    var username = $('.cy-user-name').text();
    //show repply textarea
    $("#action_ul_list").on("click", '.cmt-reply-btn', function() {
        var tmp = $(this).parents(".p3").next(".p4");
        if (tmp.css("display") == "block") {
            tmp.hide();
        } else {
            tmp.show();
            tmp.find("textarea").focus();
            setTimeout(function() {
                var top = tmp.offset().top - 100;
                window.scrollTo(0, top); }, 500);
            $("#action_ul_list").find(".p4").not(tmp).hide();
        }
    })

    //send content
    var isTouched = false;

    function sendContent(content, pid, obj) {
        //avoid post the message repeatly in bad network environment
        if (isTouched) {
            return; }
        content = content.replace(/^\n+|\n+$/g, "");
        var len = content.length
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                if (content.charAt(i) != " ") break;
            }
            content = content.substring(i, content.len);
        }
        if (content == '') {
            $(obj).val('');
            alert('回复内容不允许为空');
            return false;
        }
        //if(!checkTime())return false;
        var query = { 'gid': gameId, 'content': content, 'pid': pid };
        isTouched = true;
        $.post(addCmtServer, query, function(data) {
            isTouched = false;
            if (!data.status) {
                createLoginTip(data.url);
                return;
            }
            $(obj).val('');
            if (pid != 0) {
                console.log("add reply");
                var tmp = replyTpl.temp(data);
                var classname = "." + "action_li_" + data.pid + " .p5";
                $(classname).show();
                $(classname).prev(".p6").show();
                var length = $(classname + " span").length;
                var sub_len = $(classname).find(".shrink").length;
                if (sub_len == 0) {
                    $(classname).append(tmp);
                    if (length > 2) {
                        $(classname).append('<span class="shrink"><i class="iconfont icon-jianhao"> 收起</i></a></span></span>');
                    }
                } else {
                    $(classname + " .shrink").before(tmp);
                }
            } else {
                data['username'] = username;
                var html = commentTpl.temp(data);
                $("#action_ul_list").prepend(html);
                var count = $("#cy-cmt-count").html();
                count++;
                $("#cy-cmt-count").html(count);
            }
        }, 'json');
    }

    //main comments 
    $(".action_fb_a").click(function() {
        if (allCmtCnt == 0) {
            $(".new-cmt").text("最新评论");
            $(".sofa-tip").hide();
        }
        var textarea = $($(this).parents("section")[0]).find("textarea");
        var content = $(textarea).val();
        sendContent(content, 0, textarea);
    })

    //reply comments
    $("#action_ul_list").on("click", '.action_fb', function() {
        console.log("replay");
        var p4 = $(this).parent(".p4");
        var textarea = $(p4).find("textarea")
        var content = $(textarea).val();
        var pid = $(this).parents("li").attr("rel");
        sendContent(content, pid, textarea);
    })

    //load more
    $("#ajax_idx_more").click(function() {
        ajaxidxmore(this);
    })

    function ajaxidxmore(obj) {

        var page = $(obj).attr("rel");
        var html0 = $(obj).html();
        $(obj).html("加载中...");
        $(obj).unbind("click");
        if (!isNaN(page)) {
            var content;
            var query = { 'gid': gameId, "page": page };
            $.post(moreCmtServer, query, function(data) {
                //if there is no comments,just return the function
                if (!data) {
                    $(obj).html("已到最后");
                    return;
                }
                var dataLength = data.length;
                if ((!data) || dataLength < 5) {
                    $(obj).html("已到最后");
                    if ((!data)) return true;
                } else {
                    $(obj).bind("click", function() { ajaxidxmore(this); });
                    $(obj).html(html0);
                }
                for (var i = 0; i < dataLength; i++) {
                    var replayCnt = data[i].reply_cnt;
                    content = '';
                    for (var j = 0; j < replayCnt; j++) {
                        var tplTemp = j < 3 ? replyTpl : replyHideTpl;
                        content += tplTemp.temp(data[i].reply[j]);
                    }
                    if (content && replayCnt > 3) {
                        content += '<span class="shrink"><i class="iconfont icon-jiahao">' + ' 展开</i></a></span></span>';
                    }
                    data[i]['replay'] = content;
                    data[i]['username'] = username;
                    var html = commentTpl.temp(data[i]);
                    if (replayCnt > 0)
                        html = html.replace(/<p class="p5" style="display:none">/img, '<p class="p5" >');
                    $("#action_ul_list").append(html);
                    addLocalLikeNum();
                }
                $(obj).attr("rel", ++page);
                window.scrollTo(0, document.body.scrollHeight);
            }, "json")
        }
    }

    $("#action_ul_list").on("click", ".shrink i", function(e) {
        var spans = $(this).parents(".p5").children("span");
        var txt = $(this).text();
        if (txt == " 收起") {
            for (var i = 3; i <= spans.length - 2; i++) {
                $(spans[i]).hide();
            }
            $(this).removeClass("icon-jianhao");
            $(this).addClass("icon-jiahao");
            $(this).text(" 展开");
        } else {
            spans.show();
            $(this).removeClass("icon-jiahao");
            $(this).addClass("icon-jianhao");
            $(this).text(" 收起");
        }
    })

    //create login tip dialog
    function createLoginTip(loginUrl) {
        $("#ok-btn").text('去登录');
        $("#cancel-btn").css('background-color', '#8f8f94');
        myconfim.show();
        myconfim.setOkCallback(function() {
            location.href = loginUrl;
        });
    }
    //add commentlike
    var cmtLikeArray = new Array();
    $('#action_ul_list').on("click", '.cmt-like-btn', function() {
        var rel = $(this).parents("li").attr("rel")
        var target = addLikeServer + rel + '/type/';
        var cmLike = $(this).find('.cmt-like-num');
        likeCnt = parseInt(cmLike.text());
        var type;
        if ($(this).hasClass('haveliked')) {
            $(this).removeClass('haveliked');
            likeCnt--;
            cmLike.text(likeCnt);
            type = 0;
            cmtLikeArray.pop(rel);
        } else {
            $(this).addClass('haveliked');
            likeCnt++;
            cmLike.text(likeCnt);
            type = 1;
            cmtLikeArray.push(rel);
        }
        localStorage.setItem('cmtLikeArray', cmtLikeArray);
        target = target + type;
        $.get(target, function(data) {});
    });

    //add local storage like num
    addLocalLikeNum();

    function addLocalLikeNum() {
        if (localStorage.getItem('cmtLikeArray') != null) {
            if (localStorage.getItem('cmtLikeArray').length > 0) {
                var str = localStorage.getItem('cmtLikeArray');
                var data = str.split(",");
                cmtLikeArray = data;
                var className = ".action_li_";
                for (var i = cmtLikeArray.length - 1; i >= 0; i--) {
                    $(className + cmtLikeArray[i] + ' .cmt-like-btn').addClass('haveliked');
                };
            }
        }
    }
    //jump to comments smooth scroll
    $('#jump-to-cmt').click(function() {
        gotoAnchor();
        return false;
    });
    //scroll to anchor
    function gotoAnchor(acceleration, stime) {

        var acceleration = acceleration || 0.1;
        var stime = stime || 10;
        var y1 = document.documentElement.scrollTop || 0;
        var y2 = document.body.scrollTop || 0;
        var tmp = $('#cmt').offset().top || 0;
        var height = $('.mui-title').height();
        var y3 = window.scrollY || 0;
        var scrollTop = $(window).scrollTop();　
        var scrollHeight = $(document).height();　
        var windowHeight = $(window).height();

        var y = Math.max(y1, Math.max(y2, y3));
        var target = 5 + y * (1 + acceleration);
        if (target < tmp - height) {
            //add this logic to ensure document dont to scroll when it reach the bottom
            if (scrollTop + windowHeight < scrollHeight) {
                window.scrollTo(0, target);
                window.setTimeout(gotoAnchor, stime);
            }
        }
    }
    //when the playBtn becomes invisible,show the bottomBtn
    var myScrollEl = $($('.ui-btn.play.play-btn')[0]);
    var topScrollEl = $($('.mui-bar.mui-bar-nav')[0]);
    var plyScrollEl = $('#bottomPlyBtn');
    $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();

            if((scrollTop + topScrollEl.offset().height)> (myScrollEl.offset().top + myScrollEl.offset().height) ){
                 if(plyScrollEl.css('display')==='none'){
                    plyScrollEl.show();
                 }
            }else{
                if(plyScrollEl.css('display')==='block'){
                    plyScrollEl.hide();
                 }
            }
    });

    if((myScrollEl.offset().top+myScrollEl.offset().height)> $(window).scrollTop()){
        plyScrollEl.hide();
    }else{
        plyScrollEl.show();
    }
})();
