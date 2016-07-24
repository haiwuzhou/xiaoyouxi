var rcmdClose = document.querySelectorAll('.search-rcmd-close')[0];
var searchPanel = document.querySelectorAll('.search-rcmd')[0];
var swiper = new Swiper('#banner-slider', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
	autoplay:'2000',
	loop: true
});

rcmdClose && (rcmdClose.onclick = function(){
	$('.main-content').removeClass('woqu-hide').addClass('woqu-show');
	hideSearchPanel();
});

function showSearchPanel(){
	$('.main-content').removeClass('woqu-show').addClass('woqu-hide');
	//$('.mui-content').addClass('hide-head');
	pullDataFlag = false;
	var searchKey = $('#search').val();
	searchKey = searchKey.replace('大家都在搜：','');
	$('#search').val(searchKey);
	searchPanel.style.display = "block";
}

function  hideSearchPanel(){
	pullDataFlag = true;
	//$('.mui-content').removeClass('hide-head');
	searchPanel.style.display = "none";
}

var autoSearch = (function(){
	var searchTag = document.querySelectorAll('.search-label');
	var searchEle = document.getElementById('search');
	var closeEle = document.querySelector('.icon-close');
	var searchInput = document.getElementById('search-btn');
	var searchTitle = []; /*搜索标题数组*/
	var searchUrl = []; /*搜索链接数组*/
	var index = 0;

	var timer; /* 检测输入*/
	var changeTimer; /*自动变化关键词*/

	for(var key=0; key<searchTag.length; key++){
		searchTitle[key] = searchTag[key].innerText;
		searchUrl[key] = searchTag[key].getAttribute('href');
	}

	function setAutoSearch(){
		changeTimer = setInterval(function(){
			index++;
			if(index >= searchTag.length) index=0;
			var value = '大家都在搜：' + searchTitle[index];
			//$('#search').val(value);
			$('#search').attr('placeholder',value );
		},4000);
	}
	setAutoSearch();

	searchEle.onchange = function(){
		closeEle.classList.add('search-active');
	}
	closeEle.onclick = function(){
		searchEle.value = '';
		closeEle.classList.remove('search-active');
	}
	searchEle.onfocus = function(){
		/*		if(searchUrl[index].indexOf('http://') > -1)
		 window.location = searchUrl[index];*/
		clearInterval(changeTimer);
		showSearchPanel();
		timer = setInterval(function(){
			var search = searchEle.value;
			if(search.length) {
				closeEle.classList.add('search-active');
			}else{
				closeEle.classList.remove('search-active');
			}
		},500);
	};

	searchInput.onclick = function(){
		var searchInput = $('#search').val();
		if(searchInput){
			var action = $('#search-form').attr('action');
			window.location = action + searchInput;
		}else{
			window.location = searchUrl[index];
		}

	};
	searchEle.onblur = function(){
		clearInterval(timer);
		setAutoSearch();
	}
}());

$('.diy-tab-item').click(function(){
	if($(this).hasClass('mui-active')){
		return true;
	}
	pageIndex = 1;
	endFlag = false;
	/*$('#jingp').html('');*/
	pullDownTip.loadText();
	$('.diy-tab-item').removeClass('mui-active');
	$(this).addClass('mui-active');
	serverUrl = $(this).attr('url');
	pulldownRefresh(false);
});


