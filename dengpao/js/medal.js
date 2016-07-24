(function(){
    //set game248 namespace
    var game248 = {};
    if(!window.game248){ window.game248 = game248; }
    game248.$ = $;
    //some initial varibles
    var tmpBg = window.getComputedStyle($('medal-top'))['background-image'];
    var tmpSrc= $('medal-button').src;
    var tmpUrl = location.href.split('?v=')[0];
    tmpUrl = tmpUrl.replace('#rd','');

    var tmpTip = $('medal-result').src;
    var tmpRetry = $('medal-retry').src;
    var tmpAgain = $('medal-again').src;

    setTimeout(function(){
        mainsize = document.body.clientWidth/320;
        game248.$('medal-panel').style.fontSize = mainsize*28 + "px";
    },1000)

    function $(str, type){
        var type = type || 0;
        if(type==0) return document.getElementsByClassName(str)[0];
        if(type==1) return document.getElementsByClassName(str);
    }
    function DomEach(dom,callback){
        for (var i = dom.length - 1; i >= 0; i--) {
                callback(dom[i]);
        }
    }

        /**
     * The founction for getting user's rank number
     * Use localstorage cache data to reduce the amount of database query
     * And finally show medal panel
     * @param {number} score 
     * @param {number} recordOrder 
     * @return {number} the rank number
     */
    game248.getMyRank = function(score, recordOrder, fn) {

        var query = { "gid": gameId, "score": score, "record_order": recordOrder };
        ajaxPost(getMyRankServer, query, function(res) {
            if(res){
                var data = JSON.parse(res);

                var section = data.level/5;
                var level = 5 - Math.floor(data.rank/section);
                if( level< 1) level = 5;
            
                _showMedal(score, data.rank, data.unit, level, fn)
            }else{
                $('medal-loading-image').style.display = 'none';
                $('medal-loading-text').innerHTML = '生成勋章失败<br>请刷新重试';
            }   
        });
    }

    /**
 * When the tinygame is over,show the tip panel to get honor card
 * @param {number} score - the game score
 * @param {number} rankNum - the play's ranknumber,need Ajax to get it
 * @param {string} unit - the game score's unit
 * @param {int} level - the medal-level
 * @param {string} appellation - the appellation which player would get from game,some games don't support it
 */
var urlData;
function _showMedal(score, rank, unit,level, fn, appellation) {

    var medal = $('medal');
    var src= medal.src.replace(/medal_\d/, 'medal_'+level);
    medal.src = src;

    var tip = $('medal-tip');
    var src= tip.src.replace(/medal\d/, 'medal'+level);
    tip.src = src;

    var button = $('medal-get');
    var result = _checkBattle(score, button);
    
    var tmp = $('medal-data-item', 1);
    var scoreDom = tmp[0];
    var newScore = score.toString() + unit;
    scoreDom.innerHTML = newScore;

    var rankDom = tmp[1];
    rankDom.innerHTML = rank + '名';

    urlData = '/s/' + score + '/u/' + unit+level + '/r/' + rank + '/n/' + appellation +'/bid/';

    $('medal-again').addEventListener('touchstart', function(e) {
        if(fn){
             fn();
             _initDom();
             hidePlatformShare();
        }else{
            location.href = tmpUrl + '?v=' + (new Date()).getTime();
        }
    });

    if(result == undefined){
        $('medal-get').addEventListener('touchstart', function() {
            location.href = cardUrl + urlData + 'f' + battleUid;
         });
    }else if(result){
        button.addEventListener('touchstart', function() {
            location.href = cardUrl + urlData + 'w' +battleUid;
        });
    }else{
        button.addEventListener('touchstart', function() {
            location.href = cardUrl + urlData + 'f' +battleUid;
        });
    }

    $('medal-loading-wrapper').style.display = 'none';
    DomEach($('medal-hide', 1), function(el){
        el.style.display = 'block';
    });
}



game248.checkShowMedal = function(score, recordOrder, fn){
    game248.$('medal-panel').style.display = 'table';
    game248.getMyRank(score, recordOrder, fn);
}

function _checkBattle(score) {

    if (battleScore && battleUid && battleUid!=itwlw_uid) {
        $('medal-result').style.display = 'block';
        if (recordOrder == 1) {
            if (+battleScore >= score) {
                _dealFailure();
                return false;
            } else {
                _dealSuccess();
                return true;
            }
        } else {
            if (+battleScore <= score) {
                _dealFailure();
                return false;
            } else {
                _dealSuccess();
                return true;
            }
        }
    }
}
    
    function _dealSuccess(){
        $('medal-again').style.display = 'none';
    }
    function _dealFailure(){
        var tmpSrc = tmpBg.replace('medal_bg','medal_bg1');
        $('medal-top').style.backgroundImage = tmpSrc;

        $('medal-again').src = $('medal-retry').src;
        $('medal-result').src = $('medal-failure').src;
    }
    //medal panel interruption
    var closeButton = $('medal-close');
    closeButton.addEventListener('touchstart', function(e) {
        _initDom();
    }, false);
    //initial elements' style
    function _initDom(){
        cardUrl = originCardUrl;
        game248.$('medal-panel').style.display = 'none';

        $('medal-loading-wrapper').style.display = 'block';
        DomEach($('medal-hide',1), function(el){
            el.style.display = 'none';
        });
        $('medal-top').style.backgroundImage = tmpBg;
        $('medal-result').src = tmpTip;
    }
})();