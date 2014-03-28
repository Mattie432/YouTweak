/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2013 Mattie432                                    */
/*                                                                  */
/*  This code was created by Mattie432 for the extension */
/*  YouTweak. This may not be used in part or in its entirety       */
/*  without the creators permission.                                */
/*                                                                  */
/*  http://www.mattie432.com/                                       */
/*                                                                  */
/********************************************************************/



init();
var defaultURL = "http://www.youtube.com/feed/subscriptions";
chrome.runtime.sendMessage({method: "getTabUrl"}, function(){});

/**
 * asd
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

		//embeds the videoplayer class into the page
		var v = document.createElement('script');
		v.src = chrome.extension.getURL("contextScripts/videoplayer.js");
	}

}



////////////////////////////////////////////////
//          Change YouTube icon link          //
////////////////////////////////////////////////
function initChangeURL(url) {
	document.getElementById("logo-container").setAttribute("href",
			url);


	var areas = document.getElementsByTagName("area");
	for (var i = 0; i<areas.length;i++) {
		areas[i].setAttribute("href",url);
	}

}
