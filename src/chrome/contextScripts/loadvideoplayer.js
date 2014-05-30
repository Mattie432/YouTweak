/**
 *	This class is used to embed the videoPlayer class into the page and creates
 * 	elements in the document based on what options are set.
 */
var v = document.createElement('script');
v.src = chrome.extension.getURL("contextScripts/videoplayer.js");

var autoLike = document.createElement("span");
autoLike.id = "autoLike";
var autoLikeNames = document.createElement("span");
autoLikeNames.id = "autoLikeNames";

chrome.storage.sync.get(['qualitySelect', 'pauseVideos', 'repeatVideos', 'setVideoSize', 'autoLike', 'autoLikeNames'], function(r) {
	//quality.setAttribute("value",r.qualitySelect);
	//pause.setAttribute("value",r.pauseVideos);
	//repeat.setAttribute("value",r.repeatVideos);
	//setVideoSize.setAttribute("value",r.setVideoSize);
	autoLike.setAttribute("value", r.autoLike);
	autoLikeNames.setAttribute("value", r.autoLikeNames);
});

(document.head || document.documentElement).appendChild(v);
(document.head || document.documentElement).appendChild(autoLike);
(document.head || document.documentElement).appendChild(autoLikeNames);
