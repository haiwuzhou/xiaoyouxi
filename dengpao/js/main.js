/* common function */
function hasClass(elements, cName) {
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};

function addClass(elements, cName) {
    if (!hasClass(elements, cName)) {
        elements.className += " " + cName;
    };
};

function removeClass(elements, cName) {
    if (hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
    };
};

function toogleClass(elements, cName) {
    if (hasClass(elements, cName)) {
        removeClass(elements, cName);
    } else {
        addClass(elements, cName);
    }
}

function Selector(selector) {
    var tmp = selector.slice(1);
    if (selector.charAt(0) === '.') {
        return document.getElementsByClassName(tmp)[0];
    } else {
        return document.getElementById(tmp);
    }
}

var firstClick = true;
var commentFlag = true;
var timer;
var FunnyCommentCount = 1;

// get localstroge
var historycount = localStorage.getItem('xyx_comment_count_' + gid);

if (!historycount) {
    historycount = 0;
    localStorage.setItem('xyx_comment_count_' + gid, 0);
}
if (historycount >= comment_count) {
    localStorage.setItem('xyx_comment_count_' + gid, comment_count);
    Selector('.UnreadMessage').style.display = "none";
} else {
    var unread = comment_count - historycount;
    Selector('.UnreadMessage').innerHTML = unread;
    Selector('.UnreadMessage').style.display = "inline-block";
}

//获取用户信息
var user_icon = document.getElementById('xyx-user-icon').getAttribute('src');
var user_name = document.getElementById('xyx-user-name').innerHTML;
var uid = document.getElementById('xyx-user-icon').getAttribute('alt');
if (!user_icon && !user_name && !uid) {
    user_icon = "http://game248.cdn.itwlw.com/common/menu/img/unknown-icon.png?v=1.2";
    user_name = "匿名用户";
    uid = 0;
}
var woquTouch = "ontouchstart" in document.documentElement ? "touchend" : "click";

Selector('.xyx-menu-openbtn').addEventListener(woquTouch, function(event) {
    Selector('.xyx-Main-box').style.display = "block";
    TweenLite.to("#xyx-btn-box", 0.5, { left: "0" });
    if (firstClick) {
        var a = document.getElementById('xyx-scroll-box').scrollHeight + 17;
        var b = document.getElementById('xyx-btn-box').offsetHeight;
        if (a > b) {
            addClass(Selector('.xyx-bottom-tips'), 'xyx-bottom-tips-scroll');
        }
    }
    event.preventDefault();
    return true;
})
Selector('.xyx-fullscreen').addEventListener(woquTouch, function(event) {
    // Selector('#inputbox').style.overflow = "visible";
    TweenLite.to("#xyx-btn-box", 0.5, { left: "-300", onComplete: function() { Selector('.xyx-Main-box').style.display = "none"; } });
    event.preventDefault();
    return true;
})

Selector('.xyx-menu-btnbox0').addEventListener(woquTouch, function(event) {
    localStorage.setItem('xyx_comment_count_' + gid, comment_count);
    Selector('.UnreadMessage').style.display = "none";
    Selector('.xyx-comment-box').style.display = "block";
    TweenLite.to("#xyx-comment-box", 0.5, { left: "0" });
    if (commentFlag) {
        var data = [];
        data['gid'] = gid;
        ajaxPost(FirstComment, data, function(result) {
            if (result != "null") {
                var json = JSON.parse(result);
                var html = "";
                var time;
                var nowtime = Math.round(new Date().getTime() / 1000);
                for (var i = 0; i < json.length; i++) {
                    time = Jetlag(json[i]['time'], nowtime);
                    if (uid == json[i]['uid'] && uid != 0) {
                        html += '<li class="xyx-user-comment xyx-user-send"><div class="usericon"><img src="' + json[i]['head_img'] + '" alt=""></div><div class="username"><span class="changefont">' + json[i]['nickname'] + '</span></div><div class="content"><span class="changefont">' + json[i]['content'] + '</span></div><div class="time"><span class="changefont">' + time + '</span></div></li>';
                    } else {
                        html += '<li class="xyx-user-comment"><div class="usericon"><img src="' + json[i]['head_img'] + '" alt=""></div><div class="username"><span class="changefont">' + json[i]['nickname'] + '</span></div><div class="content"><span class="changefont">' + json[i]['content'] + '</span></div><div class="time"><span class="changefont">' + time + '</span></div></li>';
                    }
                }
                document.getElementById("xyx-comment-list").innerHTML = html;
            } else {
                var html = '<li class="xyx-user-comment"><div class="usericon"><img src="http://7xlmq0.com1.z0.glb.clouddn.com/index/img/user.png" alt=""></div><div class="username"><span class="changefont">248游戏</span></div><div class="content"><span class="changefont">有问题请给我们反馈哦，微信号：ssxyxgg</span></div><div class="time"> </div></li>';
                document.getElementById("xyx-comment-list").innerHTML = html;
            }
        });
        commentFlag = false;
    }
})
Selector('.xyx-comment-back').addEventListener('click', function() {
    TweenLite.to("#xyx-comment-box", 0.5, { left: "300", onComplete: function() { Selector('.xyx-comment-box').style.display = "none"; } });
})



Selector('.xyx-menu-btnbox1').addEventListener(woquTouch, function(event) {
    location.href = rankUrl;
    return false;
    event.preventDefault();
    return true;
})
Selector('.xyx-showshareinfo').addEventListener(woquTouch, function(event) {
    if (hasClass(Selector('.xyx-menu-btnbox2'), "xyx-btnbox-open")) {
        removeClass(Selector('.xyx-menu-btnbox2'), "xyx-btnbox-open");
        var a = document.getElementById('xyx-scroll-box').scrollHeight + 17;
        var b = document.getElementById('xyx-btn-box').offsetHeight;
        if (a <= b) {
            removeClass(Selector('.xyx-bottom-tips'), 'xyx-bottom-tips-scroll');
        }
    } else {
        addClass(Selector('.xyx-menu-btnbox2'), "xyx-btnbox-open");
        var a = document.getElementById('xyx-scroll-box').scrollHeight + 17;
        var b = document.getElementById('xyx-btn-box').offsetHeight;
        if (a > b) {
            addClass(Selector('.xyx-bottom-tips'), 'xyx-bottom-tips-scroll');
        }
    }
    event.preventDefault();
    return true;
})

Selector('.xyx-share-a').addEventListener(woquTouch, function(event) {
    Selector('.xyx-share-wx').style.display = "block";
    event.preventDefault();
    return true;
})
Selector('.xyx-share-wx').addEventListener(woquTouch, function(event) {
    Selector('.xyx-share-wx').style.display = "none";
    event.preventDefault();
    return true;
})
Selector('.xyx-share-b').addEventListener(woquTouch, function(event) {
    shareToWeibo();
    event.preventDefault();
    return true;
})
Selector('.xyx-share-c').addEventListener(woquTouch, function(event) {
    shareToQQ();
    event.preventDefault();
    return true;
})
Selector('.xyx-menu-btnbox3').addEventListener(woquTouch, function(event) {
    location.href = moreUrl;
    return false;
    event.preventDefault();
    return true;
})
Selector('.xyx-menu-btnbox4').addEventListener(woquTouch, function(event) {
    location.href = playedUrl;
    return false;
    event.preventDefault();
    return true;
})
Selector('.xyx-menu-btnbox5').addEventListener(woquTouch, function(event) {
    location.href = window.location + "/time/" + new Date().getTime();
    event.preventDefault();
    return true;
})



Selector('.xyx-comment-submit').addEventListener('click', function() {
    if (commentFlag) {
        return true;
    }
    //验证输入框内容
    var str = document.getElementById('xyx-comment-input').value;
    if (!str) {
        Selector('.xyx-input-error').style.display = "block";
        hideinouttip(Selector('.xyx-input-error'));
        return true;
    }
    //将输入框内容append到页面最上方<span class="changefont">
    var html = '<li class="xyx-user-comment xyx-user-send"><div class="usericon"><img src="' + user_icon + '" alt=""></div><div class="username"><span class="changefont">' + user_name + '</span></div><div class="content"><span class="changefont">' + str + '</span></div><div class="time"><span class="changefont">刚刚</span></div></li>';
    document.getElementById("xyx-comment-list").innerHTML = html + document.getElementById("xyx-comment-list").innerHTML;
    // 清空输入框内容
    document.getElementById('xyx-comment-input').value = "";
    //ajax 提交内容
    var data = [];
    data['gid'] = gid;
    data['uid'] = uid;
    data['user_icon'] = user_icon;
    data['user_name'] = user_name;
    data['str'] = str;
    if (FunnyCommentCount < 6) {
        ajaxPost(addComment, data);
        comment_count++;
        localStorage.setItem('xyx_comment_count_' + gid, comment_count);
    }
    FunnyCommentCount++;
    Selector('.xyx-input-success').style.display = "block";
    hideinouttip(Selector('.xyx-input-success'));
})

function Jetlag(oldtime, newtime) {
    var time = newtime - oldtime;
    if (time >= 60) {
        time = Math.round(time / 60);
        if (time >= 60) {
            time = Math.round(time / 60);
            if (time >= 24) {
                time = Math.round(time / 24);
                if (time >= 30) {
                    time = Math.round(time / 30);
                    return time + "月前";
                } else {
                    return time + "天前";
                }
            } else {
                return time + "小时前";
            }
        } else {
            return time + "分钟前";
        }
    } else {
        return "刚刚"
    }
}

function hideinouttip(dom) {
    clearTimeout(timer);
    timer = setTimeout(function() {
        dom.style.display = "none";
    }, 1000);
}

function initfunnyMainbox() {
    Selector('.xyx-Main-box').style.height = window.innerHeight + "px";
}
initfunnyMainbox();

// 判断是否为苹果，并在input元素失去焦点隐藏iphone的软键盘
var isIPHONE = navigator.userAgent.toUpperCase().indexOf('IPHONE') != -1;

function objBlur(id, time) {
    if (typeof id != 'string') throw new Error('objBlur()参数错误');
    var obj = document.getElementById(id),
        time = time || 300,
        docTouchend = function(event) {
            if (event.target != obj) {
                setTimeout(function() {
                    obj.blur();
                    document.removeEventListener('touchend', docTouchend, false);
                }, time);
            }
        };
    if (obj) {
        obj.addEventListener('focus', function() {
            document.addEventListener('touchend', docTouchend, false);
        }, false);
    } else {
        throw new Error('objBlur()没有找到元素');
    }
}
if (isIPHONE) {
    var input = new objBlur('xyx-comment-input', 20);
    input = null;
}

//上拉加载更多评论
var getFlag = true,
    endFlag = false,
    pullDataFlag = true;

function changeFlag(flag) {
    pullDataFlag = flag;
}
document.getElementById('xyx-comment-body').onscroll = function() {
    var top = document.getElementById('xyx-comment-body').scrollTop || document.getElementById('xyx-comment-body').scrollTop;
    if (top + document.getElementById('xyx-comment-body').clientHeight >= document.getElementById('xyx-comment-body').scrollHeight - 40) {
        if (pullDataFlag)
            pulldownRefresh(true);
    }
}
String.prototype.temp = function(obj) {
    return this.replace(/\##\w+\##/gi, function(matchs) {
        var returns = obj[matchs.replace(/\##/g, "")];
        return (returns + "") == "undefined" ? "" : returns;
    });
};

function appendListItem(content, append) {
    var length = content && content.length;
    var htmlTemp, htmlList = "";
    if (!length) {
        endFlag = true;
        document.getElementById('Refresh-tip').innerHTML = "没有更多评论了";
        setTimeout(function() {
            document.getElementById('Refresh-tip').style.display = "none";
        }, 1000)
        return true;
    }
    var nowtime = Math.round(new Date().getTime() / 1000);
    var time;
    var html = "";
    for (var i = 0; i < length; i++) {
        time = Jetlag(content[i]['time'], nowtime);
        if (uid == content[i]['uid'] && uid != 0) {
            html += '<li class="xyx-user-comment xyx-user-send"><div class="usericon"><img src="' + content[i]['head_img'] + '" alt=""></div><div class="username"><span class="changefont">' + content[i]['nickname'] + '</span></div><div class="content"><span class="changefont">' + content[i]['content'] + '</span></div><div class="time"><span class="changefont">' + time + '</span></div></li>';
        } else {
            html += '<li class="xyx-user-comment"><div class="usericon"><img src="' + content[i]['head_img'] + '" alt=""></div><div class="username"><span class="changefont">' + content[i]['nickname'] + '</span></div><div class="content"><span class="changefont">' + content[i]['content'] + '</span></div><div class="time"><span class="changefont">' + time + '</span></div></li>';
        }
    }
    document.getElementById("xyx-comment-list").innerHTML += html;
    document.getElementById('Refresh-tip').style.display = "none";
}

function ajaxGetdata(url, callback) {
    ajaxGet(url, function(result) {
        $result = JSON.parse(result);
        callback && callback($result);
    });
}

function pulldownRefresh(append) {
    var url = MoreComment + pageIndex;
    document.getElementById('Refresh-tip').style.display = "block";
    if (endFlag) {
        document.getElementById('Refresh-tip').innerHTML = "没有更多评论了";
        setTimeout(function() {
            document.getElementById('Refresh-tip').style.display = "none";
        }, 1000)
        return true;
    }
    if (!getFlag) return true; /*is getting data now */
    getFlag = false;

    ajaxGetdata(url, function(content) {
        getFlag = true; /*get data finished */
        pageIndex = pageIndex + 1;
        appendListItem(content, append);
    });
}


//if there is a low version mobile,remove the complex style
var isLowVersionMobile = false;
(function() {
    var u = window.navigator.userAgent;
    var androidVersion = u.substr(u.indexOf('Android') + 8, 1);
    if (+androidVersion < 4) {
        isLowVersionMobile = true;
        document.getElementById("xyx-menu-openbtn").style.display = 'none';
        document.getElementById("xyx-Main-box").style.display = 'none';
    }
}());

function attention_wx() {}
var shareConfig = {
    url: shareUrl || document.location.href,
    title: share.title || document.title,
    desc: '',
    pic: shareThumb,
    pics: shareThumb,
    summary: '',
    site: ''
};

function diySerialize(obj) {
    var str = "";
    for (var prop in obj) {
        var temp = encodeURIComponent(obj[prop]);
        str += prop + "=" + temp + "&"
    }
    return str;
}

var myToggle = document.getElementById("xyx-menu-openbtn");
var panel = document.getElementById("xyx-menu-box");

setTogglePos(1);

function setTogglePos(type) {
    switch (type) {
        case 1:
            if (!isLowVersionMobile) {
                myToggle.classList.add('upper-left');
            }
            break;
        case 2:
            if (!isLowVersionMobile) {
                myToggle.classList.remove('upper-left');
                myToggle.classList.add('upper-right');
            }
            break;
    }
}

nodes = document.getElementsByClassName("red-dot");

function setRedDot(i) {
    nodes[i].style.display = "block";
}

function clearRedDot(i) {
    nodes[i].style.display = "none";
}

function light(boolen) {
    if (boolen) {
        myToggle.style.opacity = "1";
    } else {
        myToggle.style.opacity = "0.5";
    }
}

var flag = false

function toggle() {
    if (!flag) {
        trigger();
    } else {
        cancel(event);
    }
}

function trigger() {

    light(true);
    flag = true;
    shareFlag = 0;

    if (isLowVersionMobile) {
        // document.getElementById("xyx-menu-openbtn").style.display = 'none';
        // document.getElementById("xyx-Main-box").style.display = 'none';
        // document.getElementById("panel").style.display = 'block';
        // document.getElementById("mask").style.display = 'block';
    } else {
        // document.getElementById("hwtb-root").setAttribute("data-ui", "open");
        // document.getElementById("panel").style.webkitTransform = "scale(1,1)";
    }

}

function cancel(event) {

    light(false);
    flag = false;

    if (isLowVersionMobile) {
        // document.getElementById("panel").style.display = 'none';
        // document.getElementById("mask").style.display = 'none';
    } else {
        // document.getElementById("hwtb-root").setAttribute("data-ui", "");
        // document.getElementById("panel").style.webkitTransform = "scale(0,0)";
    }
    setTimeout(function() {
        shareFlag = 1;
    }, 1000);
    event.preventDefault();
    return true;
}

function makeQrcode() {
    if (!qrCodeFlag) return false;
    qrCodeFlag = 0;
    var qrcode = document.createElement("img");
    qrcode.src = "http://qr.liantu.com/api.php?bg=ffffff&fg=000000&el=l&w=170&m=0&text=" + shareUrl;
    qrcode.style.margin = "auto";
    document.getElementById("final").appendChild(qrcode);
    document.getElementById("qrcode").style.display = "table";
}

function hideQrcode() {
    document.getElementById("qrcode").style.display = "none";
    var tmp = document.getElementById("final").getElementsByTagName("img");
    document.getElementById("final").removeChild(tmp[0]);
    setTimeout(function() {
        qrCodeFlag = 1;
    }, 1000)
    return false;
}

function changeShare() {
    shareConfig.title = arguments[0];
    shareData.title = arguments[0];
}

/*  common function */
function ajaxGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback && callback(xmlHttp.responseText);
        }
    }
    xmlHttp.send();
}

function ajaxPost(url, data, callback) {
    var postData = data;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if (typeof(postData) === 'object') {
        postData = (function(obj) { // 转成post需要的字符串.
            var str = "";
            for (var prop in obj) {
                str += prop + "=" + obj[prop] + "&"
            }
            return str;
        })(postData);
    }
    xhr.onreadystatechange = function() {
        var XMLHttpReq = xhr;
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                callback && callback(text);
            }
        }
    };
    xhr.send(postData);
}

var letter = document.getElementById("xyx-menu-letter");

function setTip() {
    letter.classList.remove("letter-red-dot");
    letter.classList.add("letter-red-dot-2");
    setRedDot(0);
}

function clearTip() {
    letter.classList.remove("letter-red-dot-2");
    letter.classList.add("letter-red-dot");
    setRedDot(0);
}

function updateRecord(score, data, fn) {

    var record = { "record": score, "record_data": data };
    if ((recordOrder === 1) && (+score >= +reScore)) {
        updateStorage(data);
        ajaxPost(recordServer, record, function() {
            reScore = score;
            setTip();
        })
    } else if (recordOrder === 2) {
        if (!(+reScore) || +score <= +reScore) {
            updateStorage(data);
            ajaxPost(recordServer, record, function() {
                reScore = score;
                setTip();
            })
        }
    }

    if(isLevelGame == '0'){
        game248.checkShowMedal(score, recordOrder, fn);
    }
}

function updateStorage(data) {
    if (data) {
        var query = { "gid": gameId, "record_data": data };
        ajaxPost(storageServer, query, function() {});
    }
}

function commonGameOver(score, propor, data, fn) {

    updateRecord(score, data, fn);
    createShare(score, propor);
    letter.classList.add("letter-red-dot");
    setRedDot(1);
    //animate the share panel
    myToggle.classList.add("shake-toggle");
    light(true);
    setTimeout(function() {
        myToggle.classList.remove("shake-toggle");
    }, 2000);
    
}

function commonMoreGame() {
    location.href = moreUrl;
}

function commonRank() {
    location.href = rankUrl;
}

function createShare(score, propor) {
    var title;
    if (shareType === 1) {
        if (recordOrder === 1) {
            for (index in shareLevel) {
                if (shareLevel[index]['level'] && score > shareLevel[index]['level']) {
                    title = shareLevel[index]['title'].replace(/##score##/g, score);
                    title = title.replace(/##propor##/g, propor);
                    break;
                }
            }
        } else if (recordOrder === 2) {
            shareLevel = shareLevel.reverse();
            for (index in shareLevel) {
                if (shareLevel[index]['level'] && score < shareLevel[index]['level']) {
                    title = shareLevel[index]['title'].replace(/##score##/g, score);
                    title = title.replace(/##propor##/g, propor);
                    break;
                }
            }
        }

    } else if (shareType === 2) {
        var randomIndex = Math.floor((Math.random() * shareLevel.length));
        title = shareLevel[randomIndex]['title'];
        title = shareLevel[0]['title'].replace(/##score##/g, score);
        title = title.replace(/##propor##/g, propor);
    } else if (shareType === 3) {
        title = shareLevel[0]['title'].replace(/##score##/g, score);
        title = title.replace(/##propor##/g, propor);
    }

    changeShare(title);
    return title;
}

//platform judge and share
var isWeChat = false;
var isQQ = false;
var isWeibo = false;
(function checkShare() {
    var ua = navigator.userAgent.toLowerCase();
    if (/micromessenger/.test(ua)) {
        isWeChat = true;
    } else if (/weibo/.test(ua)) {
        isWeibo = true;
    } else if (/qq/.test(ua)) {
        isQQ = true;
    }
    if (document.getElementById('platform-share')) {
        document.getElementById('platform-share').addEventListener('touchstart', shareToQQ);
        var html = '<img id="platform-share" src="' + weiboShareSrc + '">';
        if (isWeibo) {
            document.getElementById('result-share').innerHTML = html;
            document.getElementById('platform-share').addEventListener('touchstart', shareToWeibo);
        }
    }
})();

function showPlatformShare() {
    document.getElementById('result-share').style.display = 'block';
}

function hidePlatformShare() {
    light(false);
    if(document.getElementById('result-share')){
            document.getElementById('result-share').style.display = 'none';
    }
}

function shareToWeibo() {
    var titleTemp = shareConfig.title;
    shareConfig.url = shareConfig.url + "/3";
    shareConfig.title = "#" + gameTitle + "# " + titleTemp + "@248小游戏 【戳这里去玩=>" + shareConfig.url + "/from/tl/】";
    shareConfig.url = "";
    var param = diySerialize(shareConfig);
    window.location = sinaUrl + param;
}

function shareToQQ() {
    shareConfig.url = shareConfig.url + "/2/from/tl/";
    shareConfig.summary = "关注《微测试》QQ公众号，每天都有好游戏给你玩！";
    var param = diySerialize(shareConfig);
    window.location = qzoneUrl + param;
}

function showShareTip() {
    Selector('.xyx-Main-box').style.display = "block";
    TweenLite.to("#xyx-btn-box", 0.5, { left: "0" });
    if (firstClick) {
        var a = document.getElementById('xyx-scroll-box').scrollHeight + 17;
        var b = document.getElementById('xyx-btn-box').offsetHeight;
        if (a > b) {
            addClass(Selector('.xyx-bottom-tips'), 'xyx-bottom-tips-scroll');
        }
    }
}
