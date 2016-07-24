/**
 * Created by delan on 2015/10/19.
 */
var getFlag = true,endFlag = false, pullDataFlag = true;
window.onscroll = function(){
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if(top +document.body.clientHeight>=document.body.scrollHeight - 40){
        if(pullDataFlag)
        pulldownRefresh(true);

   
    }
}
String.prototype.temp = function(obj) {
    return this.replace(/\##\w+\##/gi, function(matchs) {
        var returns = obj[matchs.replace(/\##/g, "")];
        return (returns + "") == "undefined"? "": returns;
    });
};

var pullDownTip = (function(){
    var tipEle = $('.refresh-tip');
    return {
        show:function(){
            tipEle.show();
        },
        hide:function(){
            setTimeout(function(){tipEle.hide();},1000)
        },
        loadText:function(){
            tipEle.find('span').html('正在加载');
            tipEle.find('img').show();
        },
        noMoreText:function(){
            tipEle.find('span').html('更多游戏正在开发中');
            tipEle.find('img').hide();
        }
    }
}());

function appendListItem(content , append){
    var length = content&&content.length;
    var htmlTemp,htmlList = "";
    if(!length) {
        endFlag = true;
        pullDownTip.noMoreText();
        pullDownTip.hide();
        return true;
    }


  
    for(var i=0; i<length;i++){
        htmlTemp = $('#game-item').val();
        if(content[i]['flag'] == 0){
            htmlTemp = htmlTemp.replace(/<img class="game-corner" [^>]+>/,'');
        }
        content[i]['tags'] = genTagsHtml(content[i]['tags']);
        htmlList += htmlTemp.temp(content[i]);
    }
    if(append && htmlList && $('.diy-item').length){
        $('.diy-item').last().after(htmlList);
    }
    else{
        $('#jingp').html(htmlList);
    }
    pullDownTip.hide();
}

function ajaxGetdata(url,callback){
    $.ajax({
        type: 'get',
        url: url,
        success:function(result){
            $result = JSON.parse(result);
            callback&&callback($result);
        }
    });
}

function pulldownRefresh(append){
 console.log(getFlag)


    var url = serverUrl;
    pullDownTip.show();
    if(endFlag){
        pullDownTip.noMoreText();
        pullDownTip.hide();
        return true;
    }
    if(!getFlag) return true; 	 /*is getting data now */
    getFlag = false;






    ajaxGetdata(url,function(content){
        getFlag = true;  /*get data finished */
        pageIndex = pageIndex + 1;
        appendListItem(content ,append);

    });
}
pulldownRefresh(false);

function genTagsHtml( tags){
    var tagsArr = tags.split(',');
    var tagsHtml = "";
    for(var i=0; i<tagsArr.length; i++){
        tagsHtml += tagsArr[i] && ("<span>" + tagsArr[i] + "</span>");
    }
    return tagsHtml;
}
