document.addEventListener('DOMContentLoaded', initialize);
var xmlURL = "https://mattie432.com/YouTweak/message.xml";
var lastOpenedOptionsPage;

window.onbeforeunload = function() {
    save_options();
};
function initialize() {
	arrangePage();
	restore_options();
	checkForDate();
	document.getElementById("changeIconURL").addEventListener("click", arrangePage,false);
	document.getElementById("save").addEventListener("click", function(){window.close();},false);
	document.getElementById("contact").addEventListener("click", contactShow,false);



	checkMessages();
};

function checkMessages(){

	chrome.storage.sync.get(['lastOpenedOptionsPage'], function(r) {

		var hoursBetweenChecks = 2;
		var tmp = r.lastOpenedOptionsPage + (30);// * 60 * hoursBetweenChecks);
		if(tmp < new Date().getTime() / 1000){

			var xhr = new XMLHttpRequest();
			xhr.open("GET", xmlURL, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var response = getMessages(xhr);


					if(response.show == "true"){
						addMessageToPage(response.message,response.date);
						//save message locally
					    chrome.storage.local.set({"keyMessage" : response.message});
						chrome.storage.local.set({"keyDate" : response.date});

					}else{
						//empty local message
					    chrome.storage.local.set({"keyMessage" : null});
						chrome.storage.local.set({"keyDate" : null});
					}

				}
			};
			xhr.send();

			lastOpenedOptionsPage = new Date().getTime() / 1000;
		}else{
			var keyMessage;
			var keyDate;

			chrome.storage.local.get("keyMessage", function(result){
        		keyMessage = result.keyMessage
    		});
			chrome.storage.local.get("keyDate", function(result){
        		keyDate = result.keyDate
    		});

    		if(keyMessage !== undefined && keyMessage !== null && keyDate !== undefined && keyDate !== null){
    			//show cached message
				addMessageToPage(keyMessage,keyDate);
    		}

		}
	});


}


function addMessageToPage(message,messageDate){
	var child = document.createElement("div");
	child.setAttribute("class", "alert note");

	var icon = document.createElement("div");
	icon.setAttribute("class", "alertIcon");

	var text = document.createElement("div");
	text.setAttribute("class","alertText");
	text.innerHTML = linkify(message);

	var br = document.createElement("div");

	var date = document.createElement("div");
	date.innerText = messageDate;

	br.appendChild(date);
	br.appendChild(text);

	child.appendChild(icon);
	child.appendChild(br);

	var note = document.getElementById("top_note");
	note.insertBefore(child, note.firstElementChild);

}

function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}


/**
 *	Gets all messages from the XML
 * @param {Object} xml1
 * @param {Object} msgNum
 */
function getMessages(xml1, msgNum) {

	var xml = xml1.responseXML.childNodes[0];
	if(xml !== undefined && xml !== null){
		var messages = xml.childNodes;

		var num = -1;
		var date;
		var text;
		var show;

		for (var i = 0; i < messages.length; i++) {
			if (messages[i].nodeName == "show") {
				//show msg
				show = messages[i].textContent;
			}

			if (messages[i].nodeName == "message") {
				var msg = messages[i].childNodes;
				var tempnum;
				var tempdate;
				var temptext;

				for (var j = 0; j < msg.length; j++) {
					if (msg[j].nodeName == "num") {
						tempnum = msg[j].textContent;
					} else if (msg[j].nodeName == "date") {
						tempdate = msg[j].textContent;
					} else if (msg[j].nodeName == "text") {
						temptext = msg[j].textContent;
					}
				}

				var case1 = (msgNum == undefined);
				var case2 = (tempnum > msgNum);//|| true;
				var case3 = tempnum > num;
				if ((case1 || case2) && case3) {
					num = tempnum;
					date = tempdate;
					text = temptext;

					return {
						show : show,
						num : num,
						date : date,
						message : text
					};

				}

			}
		}
	}

}

// Saves options to localStorage.
function save_options() {

	var deleteSubsBtnState = document.getElementById("deleteSubsBtn").checked;
	var changeIconURLState = document.getElementById("changeIconURL").checked;
	var removeWatchedVideosState = document.getElementById("deleteWatchedVids").checked;
	var iconURLLink = document.getElementById("iconURL").value;
	var redirectYouTube = document.getElementById("redirectYouTube").checked;
	var details = chrome.runtime.getManifest();
	var clearAllVideos = document.getElementById("clearAllVideos").checked;
	var loadAllVideos = document.getElementById("loadAllVideos").checked;
	var deleteWatchedVidsAutomated = document.getElementById("deleteWatchedVidsAutomated").checked;
	var autoLike = document.getElementById("autoLike").checked;
	var autoLikeNames = document.getElementById("autoLikeTextBox").value;
	    autoLikeNames.replace(" ","");
	    autoLikeNames.replace(",","");
	    autoLikeNames.replace(/[\n\r]/g,",");
	var removeRecomendedChannels = document.getElementById("removeRecomendedChannels").checked;
	//seconds since last page opened

	if(isValidURL(iconURLLink)){
	chrome.storage.sync.set({
		'reviewed' : "false",
		'lastOpenedOptionsPage' : lastOpenedOptionsPage,
		'reviewDateDays' : setDays,
		'deleteSubsBtn' : deleteSubsBtnState,
		'changeIconURL' : changeIconURLState,
		'removeWatchedVideos' : removeWatchedVideosState,
		'iconURLTxt' : iconURLLink,
		'clearAllVideos' : clearAllVideos,
		'loadAllVideos' : loadAllVideos,
		'deleteWatchedVidsAutomated' : deleteWatchedVidsAutomated,
		'removeRecomendedChannels' : removeRecomendedChannels,
		'redirectYouTube' : redirectYouTube,
		'autoLike' : autoLike,
		'autoLikeNames' : autoLikeNames
	}, function() {
	    // Notify that we saved.
	});
	document.getElementById("iconURL").removeAttribute("class");
	}else{
		alert("URL not valid!");
		document.getElementById("iconURL").setAttribute("class","error");
		document.getElementById("iconURL").focus();
	}
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	chrome.storage.sync.get([ 'changeIconURL', 'removeWatchedVideos', 'linksInHD',
							'deleteSubsBtn', 'iconURLTxt', 'pauseVideos', 'installDate','loadAllVideos',
							'clearAllVideos','deleteWatchedVidsAutomated', 'removeRecomendedChannels','qualitySelect',
							'repeatVideos','redirectYouTube','setVideoSize', 'centerHomePage','autoLike','autoLikeNames','lastOpenedOptionsPage'],
		function(r) {
			lastOpenedOptionsPage = r.lastOpenedOptionsPage;
			document.getElementById("autoLike").checked = (r.autoLike);
			document.getElementById("autoLikeTextBox").value =(function() {
																if (r.autoLikeNames !== "" && r.autoLikeNames !== null && r.autoLikeNames !== undefined){
																	return r.autoLikeNames.replace(",", /\n/);
																}else{
																	return "";
																}
															})();
			document.getElementById("changeIconURL").checked = (r.changeIconURL);
			document.getElementById("deleteSubsBtn").checked = (r.deleteSubsBtn);
			document.getElementById("clearAllVideos").checked = (r.clearAllVideos);
			document.getElementById("loadAllVideos").checked = (r.loadAllVideos);
			document.getElementById("deleteWatchedVidsAutomated").checked = (r.deleteWatchedVidsAutomated);
			document.getElementById("removeRecomendedChannels").checked = (r.removeRecomendedChannels);
			document.getElementById("redirectYouTube").checked = (r.redirectYouTube);
			if(r.iconURLTxt === undefined || r.iconURLTxt == ""){
				 document.getElementById("iconURL").value = "http://www.youtube.com/feed/subscriptions";
			}else{
				 document.getElementById("iconURL").value  = r.iconURLTxt;
			}

			if (r.removeWatchedVideos) {
			    document.getElementById("deleteWatchedVids").checked = (r.removeWatchedVideos);
			}else{
			    document.getElementById("deleteWatchedVids").checked = (r.removeWatchedVideos);
			    document.getElementById("deleteWatchedVidsAutomated").setAttribute("disabled","true");
			}
	});

}

//Review
//Date used to check if can review yet.
var setDays;
function checkForDate(){
	chrome.storage.sync.get(['reviewed','reviewDateDays'], function(r) {
		if(r.reviewed != true && (r.reviewDateDays === undefined)){
			setDays = convertDateToDays(new Date());
		}else{
			setDays = r.reviewDateDays;
		}
	});
}
function convertDateToDays(date){
	var temp;
	var month = date.getMonth();
	var aggregateMonths = [0, // January
                           31, // February
                           31 + 28, // March
                           31 + 28 + 31, // April
                           31 + 28 + 31 + 30, // May
                           31 + 28 + 31 + 30 + 31, // June
                           31 + 28 + 31 + 30 + 31 + 30, // July
                           31 + 28 + 31 + 30 + 31 + 30 + 31, // August
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31, // September
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
                         ];
	return (date.getDate() + aggregateMonths[month]);
}



function arrangePage(){
	document.getElementById("iconURL").value = "http://www.youtube.com/feed/subscriptions";
	document.getElementById("resetTxt").addEventListener("click", restoreTxt, false);
	document.getElementById("editTxt").addEventListener("click", editTxt, false);
	document.getElementById("deleteWatchedVids").addEventListener("click", toggleDeleteWatchedVidsAutomatic, false);
	//document.getElementById("setPlaybackQuality").addEventListener("click", function(){toggleEnabled(document.getElementById("qualitySelect"));}, false);
	//document.getElementById("setVideoSizeCheck").addEventListener("click", function(){toggleEnabled(document.getElementById("setVideoSize"));}, false);
	//document.getElementById("qualitySelect").setAttribute("disabled","true");
	document.getElementById("errorBtn").addEventListener("click", function(){
	    document.getElementById("error_description").removeAttribute("style");
	}, false);
	document.getElementById("bugsFixesBtn").addEventListener("click", function(){
	    document.getElementById("faq_description").removeAttribute("style");
	}, false);
	document.getElementById("review").addEventListener("click",function() {
	    window.open("https://chrome.google.com/webstore/detail/youtweak-for-youtube/cfgpigllcihcpkbokdnmpkjobnebflgh/reviews",'_newtab');
	    },false);
}
function isValidURL(url){
    var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;
    if(RegExp.test(url)){
        return true;
    }else{
        return false;
    }
}
function restoreTxt(){
	document.getElementById("iconURL").value=("http://www.youtube.com/feed/subscriptions");
}
function editTxt(){
	document.getElementById("editTxt").setAttribute("disabled","true");
	document.getElementById("resetTxt").removeAttribute("disabled");
	document.getElementById("iconURL").removeAttribute("disabled");
}
function toggleDeleteWatchedVidsAutomatic(){
	var temp = document.getElementById("deleteWatchedVids").checked;
	if(temp){
	    document.getElementById("deleteWatchedVidsAutomated").removeAttribute("disabled");
	}else{
	    document.getElementById("deleteWatchedVidsAutomated").setAttribute("disabled","true");
	}
}
function contactShow(){
//	document.getElementById("emf-form").removeAttribute("style");
	window.open("../../aboutPage/about.html",'_newtab');
}
function toggleEnabled(c){
    if(c.getAttribute("disabled")){
	c.removeAttribute("disabled");
    }else{
	c.setAttribute("disabled","true");
    }
}
// convert string to boolean
function stringToBoolean(str) {
	if (str == "true") {
		return true;
	} else {
		return false;
	}
}