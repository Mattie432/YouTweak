/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2013 Mattie432                                    */
/*                                                                  */
/*  This code was created by Mattie432 for the extension            */
/*  YouTweak. This may not be used in part or in its entirety       */
/*  without the creators permission.                                */
/*                                                                  */
/*  http://www.mattie432.com/                                       */
/*                                                                  */
/********************************************************************/

//embeds the videoplayer class into the page
var v = document.createElement('script');
v.src = chrome.extension.getURL("contextScripts/videoplayer.js");


var autoLike = document.createElement("span");
autoLike.id = "autoLike";
var autoLikeNames = document.createElement("span");
autoLikeNames.id = "autoLikeNames";

//
//
////embeds the player_api into the page
//var s = document.createElement("script");
//s.src = "http://www.youtube.com/player_api";

////embeds the selected quality into the webpage
//var quality = document.createElement("span");
//quality.id = "savedQualitySetting";
//
//var pause = document.createElement("span");
//pause.id = "pauseVideos";
//
//var repeat = document.createElement("span");
//repeat.id = "repeatVideos";
//
//var setVideoSize = document.createElement("span");
//setVideoSize.id = "setVideoSize";

chrome.storage.sync.get(['qualitySelect','pauseVideos','repeatVideos','setVideoSize','autoLike','autoLikeNames'], function(r) {
                //quality.setAttribute("value",r.qualitySelect);
                //pause.setAttribute("value",r.pauseVideos);
                //repeat.setAttribute("value",r.repeatVideos);
                //setVideoSize.setAttribute("value",r.setVideoSize);
                autoLike.setAttribute("value",r.autoLike);
                autoLikeNames.setAttribute("value",r.autoLikeNames);
});

//adds all elements to the page
//(document.head||document.documentElement).appendChild(pause);
//(document.head||document.documentElement).appendChild(repeat);
//(document.head||document.documentElement).appendChild(setVideoSize);
(document.head||document.documentElement).appendChild(v);
//(document.head||document.documentElement).appendChild(s);
//(document.head||document.documentElement).appendChild(quality);
(document.head||document.documentElement).appendChild(autoLike);
(document.head||document.documentElement).appendChild(autoLikeNames);
