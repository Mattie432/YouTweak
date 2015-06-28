init();
var defaultURL = "http://www.youtube.com/feed/subscriptions";
chrome.runtime.sendMessage({method: "getTabUrl"}, function(){});

/**
 *	Initialisation for the class.
 */
function init(){
chrome.storage.sync.get(['changeIconURL', 'iconURLTxt'], function(r) {
	if (r.changeIconURL) {
		if(r.iconURLTxt == null || r.iconURLTxt == 'undefined'){
			initChangeURL(defaultURL);
		}else{
			initChangeURL(r.iconURLTxt);
		}
	}
	});

	//if is a video page
	if(document.URL.indexOf("youtube.com/watch?") != -1){

		//embeds the video player class into the page
		var v = document.createElement('script');
		v.src = chrome.extension.getURL("contextscripts/videoplayer.js");
	}

}



/**
 *	Changes the url of the YouTube icon to the one specified.
 * @param {Object} url : String - the url to change it to.
 */
function initChangeURL(url) {
	document.getElementById("logo-container").setAttribute("href",
			url);


	var areas = document.getElementsByTagName("area");
	for (var i = 0; i<areas.length;i++) {
		areas[i].setAttribute("href",url);
	}

}
