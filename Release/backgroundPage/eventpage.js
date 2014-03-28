/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2013 Mattie432                                    */
/*                                                                  */
/*  This obfuscated code was created by Mattie432 for the extension */
/*  YouTweak. This may not be used in part or in its entirety       */
/*  without the creators permission.                                */
/*                                                                  */
/*  http://www.mattie432.com/                                       */
/*                                                                  */
/********************************************************************/


//sets the action for the icon click.
chrome.browserAction.onClicked.addListener(showOptions);

//Notify messages
function notify(title, message, decay, onClick) {
	if (!decay){
	//30min = 1800000
	decay = 30000;
	}

	var notification = webkitNotifications.createNotification(
			  chrome.extension.getURL('images/icon.png'),
			title,
			message
			);

		if(onClick=="showOptionsPage"){
			notification.onclick = function(){
				showOptions();
				notification.cancel();
			};
		}

		notification.show();
		//negative decay means the user will have to close the window.
		if (decay != -1){
			setTimeout(function(){ notification.cancel() }, decay);
			//setTimeout(function(){ notification.onclick() }, decay);
		}
}



var notifications = 0;
function reviewNotify(decay){
	if(notifications == 0){
		if (!decay){
			//30min = 1800000
			decay = 10000;
		}
		var notification = webkitNotifications.createHTMLNotification("../notifications/notificationReview.html");

		//negative decay means the user will have to close the window.
		if (decay != -1){
			setTimeout(function(){ notification.cancel(); }, decay);
		}
		notification.show();
		notifications = 1;
	}
}

//Message listener
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method == "notify"){
      notify(request.title, request.message, request.decay, request.onClick);
	}else if (request.method == "reviewNotify"){
		reviewNotify(request.decay);
	}else if(request.method == "requestXMLMsg"){
		var xml = retrieveXML(request.url);
		checkMsg(xml);
	}else if (request.method == "getTabUrl") {
		redirectYouTube();
	}
  });

//shows Options menu
function showOptions(){
	var options = chrome.extension.getURL("../optionsPage/options.html");
	window.open(options,'_newtab');
}

//When first installed or updated
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
		notify("Welcome!","Thanks for installing the extension. To get started please visit the options menu by clicking here.","-1","showOptionsPage");
	}else if(details.reason == "update"){
		notify("Update installed!","YouTweak has just been updated, please click here to visit the options menu & enable any new settings.","10000","showOptionsPage");
	}

	//var googleAuth = new OAuth2('google', {
	//	client_id: '731872314781-cmamomue9uv9sh3vs273a5nn0r2iepnq.apps.googleusercontent.com',
	//	client_secret: 'q5gRXzC_dsV1200TEcvh4fbP',
	//	api_scope: 'https://gdata.youtube.com/'
	//
	//
	//	//try this vv
	//	//https://accounts.google.com/o/oauth2/auth?client_id=1731872314781-cmamomue9uv9sh3vs273a5nn0r2iepnq.apps.googleusercontent.com&redirect_uri=https://gdata.youtube.com/feeds/api/users/default/watch_history?v=2&scope=https://gdata.youtube.com&response_type=token
	//});

	//googleAuth.authorize(function() {
	//
	////document.addEventListener('DOMContentLoaded', function() {
	//
	//  // Make an XHR that creates the task
	//  var xhr = new XMLHttpRequest();
	//  xhr.onreadystatechange = function(event) {
	//    if (xhr.readyState == 4) {
	//      if(xhr.status == 200) {
	//	// Great success: parse response with JSON
	//	alert(xhr.responseText);
	//	return;
	//
	//      } else {
	//	// Request failure: something bad happened
	//      }
	//    }
	//  };

	//  xhr.open('GET', 'https://gdata.youtube.com/feeds/api/users/default/watch_history?v=2', true);
	//  xhr.setRequestHeader('Content-Type', 'application/json');
	//  xhr.setRequestHeader('Authorization', 'OAuth ' + googleAuth.getAccessToken());
	//
	//  xhr.send();
	//
	//});

});

function httpGet(theUrl){
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//messages
function checkMsg(xml1){
 chrome.storage.sync.get(['lastMessageNum'],function(r) {
		if(r.lastMessageNum !== undefined){
			getMessages(xml1,r.lastMessageNum);
		}else{
			getMessages(xml1,-1);
		}
	});
}
function retrieveXML(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.overrideMimeType('text/xml');
	xhr.send(null)
	return xhr;
}
function getMessages(xml1,msgNum) {

	var xml = xml1.responseXML.childNodes[0];
	var messages = xml.childNodes;

	var num =-1;
	var date;
	var text;
	var show;

	for(var i = 0; i<messages.length;i++){
		if(messages[i].nodeName == "show"){
				//show msg
			show = messages[i].textContent;
		}

		if(messages[i].nodeName == "message"){
			var msg = messages[i].childNodes;
			var tempnum;
			var tempdate;
			var temptext;

			for(var j = 0; j<msg.length;j++){
				if(msg[j].nodeName == "num"){
					tempnum = msg[j].textContent;
				}else if(msg[j].nodeName == "date"){
					tempdate = msg[j].textContent;
				}else if(msg[j].nodeName == "text"){
					temptext = msg[j].textContent;
				}
			}

			var case1 = (msgNum == undefined);
			var case2 = (tempnum > msgNum);
			var case3 = tempnum > num;
			if((case1 || case2) && case3){
				num = tempnum;
				date = tempdate;
				text = temptext;
			}

		}
	}
	if(show == "true" && num != -1){
		notify("Alert!",text,60000,"");
		updateReadMsg(num);
	}
}
function updateReadMsg(msgNum){
	chrome.storage.sync.set({'lastMessageNum' : msgNum}, function() {
		// Notify that we saved.
	});
}



////////////////////////////////////////////////
//          Redirect YouTube.com              //
////////////////////////////////////////////////
var defaultURL = "http://www.youtube.com/feed/subscriptions";
function redirectYouTube() {
	chrome.tabs.getSelected(null, function(tab) {
		//properties of tab object
		tabId = tab.id;
		tabUrl = tab.url;

		if (urlMatch(tabUrl)) {
			chrome.storage.sync.get(['redirectYouTube', 'iconURLTxt'], function(r) {
				if (r.redirectYouTube) {
					if(r.iconURLTxt == null || r.iconURLTxt == 'undefined'){
						chrome.tabs.update(defaultURL,function(){});
					}else{
						chrome.tabs.update(tabId, {url:r.iconURLTxt},function(){});
					}
				}
			});
		}

	});
}
function urlMatch(url) {
	if (url.endsWith("youtube.com/") ||
	    url.endsWith("youtube.com.br/") ||
	    url.endsWith("youtube.fr/") ||
	    url.endsWith("youtube.jp/") ||
	    url.endsWith("youtube.nl/") ||
	    url.endsWith("youtube.pl/") ||
	    url.endsWith("youtube.ie/") ||
	    url.endsWith("youtube.co.uk/") ||
	    url.endsWith("youtube.es/") ||
	    url.endsWith("youtube.it/") ||

	    url.endsWith("youtube.com") ||
	    url.endsWith("youtube.com.br") ||
	    url.endsWith("youtube.fr") ||
	    url.endsWith("youtube.jp") ||
	    url.endsWith("youtube.nl") ||
	    url.endsWith("youtube.pl") ||
	    url.endsWith("youtube.ie") ||
	    url.endsWith("youtube.co.uk") ||
	    url.endsWith("youtube.es") ||
	    url.endsWith("youtube.it")) {

		return true;
	}

	return false;
}
String.prototype.endsWith = function (s) {
  return this.length >= s.length && this.substr(this.length - s.length) == s;
}
