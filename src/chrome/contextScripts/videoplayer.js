initAutoLike();
console.log("STaring autolike!!")

/**
 *	Initialises the autolike option. Checks if the user is one to be automatically liked or not.
 */
function initAutoLike(){
    try{
	var q = document.getElementById("autoLike").getAttribute("value");
	if (q == true || q == "true") {

	  var channelName;
	  var names = document.getElementById("autoLikeNames").getAttribute("value");
	  var namesArray = names.split('\n');

	  var watch7userheader = document.getElementById("watch7-user-header");
	  for(var i = 0; i< watch7userheader.childNodes.length; i++){

	    try{
	     if(watch7userheader.children[i].className.indexOf("g-hovercard yt-uix-sessionlink yt-user-name") != -1){
		channelName = watch7userheader.children[i].text;
	     }
	    }catch(ex){

	    }
	  }

	  //  alert(channelName);

	  if(document.getElementById("watch-like").className.search("yt-uix-button-toggled")<0) {
	     for(var j = 0; j < namesArray.length; j++){
		if(namesArray[j] == channelName){
		       setTimeout(function(){
			 document.getElementById("watch-like").click();
			 console.info("like clicked");
		       },1000);
		}
	     }
	  }

	  //document.getElementById("autoLike").setAttribute("value","");
	}
    }catch (ex){
	console.log("ERROR: " + ex)
    }
}











//Loads when the player can accept api input (buggy)
 function onYouTubePlayerAPIReady() {
    console.log("onYouTubePlayerAPIReady");
    //initQualitySelect();
   // initSetPlayerPaused();
   // initAutoLike();
}
//Loads when the player is ready
var origOnYouTubePlayerReady = onYouTubePlayerReady;
var onYouTubePlayerReady = function () {
    origOnYouTubePlayerReady(); //call the original onYouTubePlayerReady
    console.log("Youtube player ready.");
    //Add event listeners here!
    //document.getElementById("movie_player").addEventListener("onStateChange","onStateChange");
    //initSetPlayerPaused();
    //repeatInit();
    //initSizeSelect();
    //initQualitySelect();
    //initAutoLike();
}

var prevState;
function onStateChange(event) {
    var states = new Array();
    states[0]= "unstarted";     //-1
    states[1]= "ended";         // 0
    states[2]= "playing";       // 1
    states[3]= "paused";        // 2
    states[4]= "buffering";     // 3
    states[5]= "";
    states[6]= "video cued";    // 5
    console.log("State changed to: " + states[event+1]);

    prevState = event;

    if (event == 0) {
        //ended
    }else if(event == 2){
	//playing
    }

}
function repeatVideo() {
    var btn = document.getElementById("repeatBtn");
    if (btn && btn.className == "down") {
        document.getElementById("movie_player").seekTo(0,true);
        document.getElementById("movie_player").playVideo();
    }
}

function onApiChange(event) {
    console.log("onApiChange");
    //initQualitySelect();
   //initSetPlayerPaused();
    initAutoLike();
}


////////////////////////////////////////////////
//           Vido player select size          //
////////////////////////////////////////////////
function initSizeSelect(){
     var s = document.getElementById("setVideoSize").getAttribute("value");

    if (s) {
        setSize(s);
    }
}
function setSize(size) {
    if (size == "large") {

        if (document.getElementById("watch7-container").className.indexOf("watch-wide") == -1) {
            document.getElementById("watch7-container").className += " watch-wide ";
        }
        if (document.getElementById("player").className.indexOf("watch-medium") == -1) {
            document.getElementById("player").className += " watch-medium ";
        }
        if (document.getElementById("player").className.indexOf("watch-playlist-collapsed") == -1) {
            document.getElementById("player").className += " watch-playlist-collapsed ";
        }

    }else if (size == "small") {
        var tmp1 = document.getElementById("watch7-container").className;
        var tmp2 = document.getElementById("player").className;
        tmp1 = tmp1.replace("watch-wide","");
        tmp2 = tmp2.replace("watch-medium","");


        document.getElementById("watch7-container").className = tmp1;
        document.getElementById("player").className = tmp2;

    }
}


////////////////////////////////////////////////
//          Vido player quality selector      //
////////////////////////////////////////////////
function initQualitySelect(){
    var qualityWanted = document.getElementById("savedQualitySetting").getAttribute("value");
    if (qualityWanted) {
      document.getElementById("savedQualitySetting").setAttribute("value","");
	var YP = new Object();

	// Quality options available from Youtube API
	YP.quality_options = ['highres', 'hd1080', 'hd720', 'large', 'medium', 'small', 'default'];

	// Playback quality (must be one of the above)
	YP.quality = qualityWanted;

	// Number of times to check for player before giving up
	YP.max_attempts = 50;

	// Initialize player, and make sure API is ready
	YP.init = function() {
		// Get player
		if (document.getElementById('movie_player')) {
			// Normal video player
			this.player = document.getElementById('movie_player');
		}
		else if (document.getElementById('movie_player-flash')) {
			// Channel video player
			this.player = document.getElementById('movie_player-flash');
		}
		else {
			return false;
		}

		// Check for HTML5 player
		this.html5 = this.player.getElementsByTagName('video').length ? true : false;

		// Make sure player API is ready
		if (typeof this.player.pauseVideo === 'undefined') {
			return false;
		}

		// Pause to avoid flicker caused be loading a different quality
		this.player.pauseVideo();

		// In Chrome Flash player, player.setQualityLevel() doesn't seem to work unless video has started playing (or is paused)
		// In Firefox HTML5 player, player.getPlayerState() returns -1 even if player is paused
		if (!this.html5 && this.player.getPlayerState() < 1) {
			return false;
		}

		// Everything is good to go
		return true;
	};

	// Set video quality to YP.quality or highest available
	YP.setQuality = function() {
		// Get available quality levels
		var levels = this.player.getAvailableQualityLevels();
		// Set playback quality
		if (levels.indexOf(this.quality) >= 0) {
			this.player.setPlaybackQuality(this.quality);
		}
		else {
			this.player.setPlaybackQuality(levels[0]);
		}
		// Play video
		this.player.playVideo();
	}

        YP.refresh = function(){
          try {
            this.player.stopVideo();
            this.player.clearVideo();
            this.player.playVideo();
          }catch(err){

          }
        }

	// Start execution
	YP.start = function(attempts) {
		// Initialize self (look for player)
		if (this.init()) {
			this.setQuality();
			return true;
		}
		// Give up (page has no player)
		if (attempts > this.max_attempts) {
			return false;
		}
		// Try again until initialize sucessful (maybe page still loading)
		setTimeout(function() {
			YP.start(++attempts);
		}, 200);
	}

	// Main
	YP.start(0);

        console.log("Quality set to " + qualityWanted);

       YP.refresh();
    }
}
function qualityLevels(availableQualitys, wantedQuality){
    var qualityList = new Array();
    qualityList[0] = "highres";	// >1080p
    qualityList[1] = "hd1080";	// 1080p
    qualityList[2] = "hd720";	// 720p
    qualityList[3] = "large";	// 480p
    qualityList[4] = "medium";	// 360p
    qualityList[5] = "small";	// 240p
    qualityList[6] = "default";	// default quality

    var index = qualityList.indexOf("wantedQuality");

    if(availableQualitys.indexOf(wantedQuality) != -1){
        //Can select quality
        return wantedQuality;
    }else{
        //cant select quality, get next best
        for(var i = index+1; i<6;i++){
                if(availableQualitys.indexOf(qualityList[i]) != -1){
                        return qualityList[i];
                }
        }

        //not found, return defult quality
        return qualityList[6];
    }
}



////////////////////////////////////////////////
//            Pause videos at start           //
////////////////////////////////////////////////
function initSetPlayerPaused() {
    var q = document.getElementById("pauseVideos").getAttribute("value");
    if (q == true || q == "true") {
        console.log("Pausing video...");
        setPlayerPaused();
    }
}
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
function setPlayerPaused(){
	var typeOfPlayer = (document.getElementById("movie_player") == null);
	var isPlayList = (!(getUrlVars()["playnext"] == undefined) && !(getUrlVars()["playnext"] == "1"));


	if ( !typeOfPlayer && !isPlayList ) {
            var playerElem=document.getElementById("movie_player");
            //mute volume before starts playing.
            playerElem.pauseVideo();
	}

	if ( typeOfPlayer && !isPlayList ) {
		tubestoploop = setInterval(function () {
			try {
				if ( document.getElementsByTagName('video')[0].currentTime > 0 ) {
					if ( window.location.href.indexOf("#t=") == -1 ) {
						document.getElementsByTagName('video')[0].currentTime=0;
					}
					document.getElementsByTagName('video')[0].pause();
				}
			}
			catch(err) {
			}
		},100);
	}


}



////////////////////////////////////////////////
//           Vido player repeat button        //
////////////////////////////////////////////////
function repeatInit() {
    var q = document.getElementById("repeatVideos").getAttribute("value");
    if (q == true || q == "true") {
    	addCSSToPage();
	addRepeatBtn();
      document.getElementById("repeatVideos").setAttribute("value","");
    }
}
function addRepeatBtn() {
	var div = document.createElement("div");
	div.style.paddingTop = "2px";
	div.style.display = "inline";

	var icon = document.createElement("img");
	icon.src = "http://icons.iconarchive.com/icons/visualpharm/icons8-metro-style/512/Media-Controls-Repeat-icon.png";
	icon.style.height = "14px";
	var btn = document.createElement("a");
	btn.id="repeatBtn";
	btn.type = "button";
	btn.className = "up";
	//btn.value = "false";
	btn.style.cursor = "pointer";
	btn.style.fontFamily = "arial,sans-serif";
	btn.style.fontWeight = "bold";
	btn.style.fontSize = "11px";
	btn.onclick = function(){repeatBtnClick();};
	//btn.style.height = "12px";
	btn.style.display = "inline-block";
	btn.style.marginTop = "2px";
	btn.title = "Enable repeat of video"

	var textSpan = document.createElement("span");
	textSpan.value = "test";

	btn.appendChild(icon);
	btn.appendChild(textSpan);

	div.appendChild(btn);
	var container = document.getElementById("watch7-secondary-actions");
	insertAfter(container,div);


}
function repeatBtnClick() {
	var btn = document.getElementById("repeatBtn");
	var currentClass = btn.className;

	if (currentClass == "up") {
		//set to off
		btn.className = "down";
		btn.value = "true";
		btn.title = "Disable repeat of video"
	}else{
		//set to up
		btn.className = "up";
		btn.value = "false";
		btn.title = "Enable repeat of video"
	}
}
function addCSSToPage() {
	var cssText = "a.up {background:#FAFAFA;\
	    border-top: solid 2px #eaeaea;\
	    border-left: solid 2px #eaeaea;\
	    border-bottom: solid 2px #777;\
	    border-right: solid 2px #777;\
	    padding: 5px 5px;   	\
	    }\
	\
	a.down {\
	    background: #EDEDED;\
	    border-top: solid 2px #777;\
	    border-left: solid 2px #777;\
	    border-bottom:solid 2px  #eaeaea;\
	    border-right: solid 2px #eaeaea;\
	    padding: 5px 5px;   	\
	    }";
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = cssText;
	document.body.appendChild(css);

}
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}