//sets the action for the icon click.
chrome.browserAction.onClicked.addListener(showOptions);

/**
 *	Notify the user with a chrome notification.
 * @param {Object} title - the message title
 * @param {Object} message - the message content
 * @param {Object} decay - time the message shows for
 * @param {Object} onClick - function to call if the message is clicked
 */
function notify(title, message, decay, onClick) {
	if (!decay) {
		//30min = 1800000
		decay = 30000;
	}

	var opt = {
		type : "basic",
		title : title,
		message : message,
		iconUrl : chrome.extension.getURL('images/icon.png')
	};

	var notification = chrome.notifications.create(title, opt, function() {
	});
	//chrome.notifications.create(chrome.extension.getURL('images/icon.png'), title, message);

	if (onClick == "showOptionsPage") {
		chrome.notifications.onClicked.addListener(function(notificationId) {
			if (notificationId == title) {
				showOptions();
				//notification.cancel();
			}
		});
	}

}

/**
 *	Asks the user to review the extension.
 * @param {Object} decay - time the message shows for.
 */
function reviewNotify(decay) {
	if (notifications == 0) {
		if (!decay) {
			//30min = 1800000
			decay = 10000;
		}
		var notification = webkitNotifications.createHTMLNotification("../notifications/notificationReview.html");

		//negative decay means the user will have to close the window manually.
		if (decay != -1) {
			setTimeout(function() {
				notification.cancel();
			}, decay);
		}
		notification.show();
		notifications = 1;
	}
}

var notifications = 0;

/**
 *	Message listener, this listens for a request and performs
 * 	the relevent action.
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.method == "notify") {
		notify(request.title, request.message, request.decay, request.onClick);
	} else if (request.method == "reviewNotify") {
		reviewNotify(request.decay);
	} else if (request.method == "requestXMLMsg") {
		retrieveXML(request.url);
	} else if (request.method == "getTabUrl") {
		redirectYouTube();
	}
});

/**
 *	Shows the options menu for the extension.
 */
function showOptions() {
	var options = chrome.extension.getURL("../optionsPage/options.html");
	window.open(options, '_newtab');
}

/**
 *	Listener for when the extension is first installed or updated. This will
 * 	notify the user accordingly.
 */
chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason == "install") {
		notify("Welcome!", "Thanks for installing the extension. To get started please visit the options menu by clicking here.", "-1", "showOptionsPage");
	} else if (details.reason == "update") {
		notify("Update installed!", "YouTweak has just been updated, please click here to visit the options menu & enable any new settings.", "10000", "showOptionsPage");
	}
});

/**
 *	Http get request for the url specified
 * @param {Object} theUrl
 */
function httpGet(theUrl) {
	var xmlHttp = null;

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", theUrl, false);
	xmlHttp.send(null);

	xmlHttp.overrideMimeType('text/xml');
	return xmlHttp.responseText;
}

/**
 *	Checks the message provided in XML format
 * @param {Object} xml1
 */
function checkMsg(xml1) {
	chrome.storage.sync.get(['lastMessageNum'], function(r) {
		var response;

		if (r.lastMessageNum !== undefined) {
			response = getMessages(xml1, r.lastMessageNum);
		} else {
			response = getMessages(xml1, -1);
		}

		if (response.show == "true" && response.num != -1) {
			notify("Alert!", "New message recieved about YouTweak! To read it head over to the options page or click on this notification.", 60000, "showOptionsPage");
			updateReadMsg(response.num);
		}
	});
}

/**
 *	Gets the XML from the url provided.
 * @param {Object} url
 */
function retrieveXML(url) {
	/**
	 var xhr = new XMLHttpRequest();
	 xhr.open('GET', url);
	 xhr.overrideMimeType('text/xml');
	 xhr.send(null);
	 return xhr;
	 */

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			checkMsg(xhr);
		}
	};
	xhr.open("GET", url, true);
	xhr.send();
}

/**
 *	Gets all messages from the XML
 * @param {Object} xml1
 * @param {Object} msgNum
 */
function getMessages(xml1, msgNum) {

	var xml = xml1.responseXML.childNodes[0];
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

/**
 *	Updates the count for the most recently read message.
 * @param {Object} msgNum
 */
function updateReadMsg(msgNum) {
	chrome.storage.sync.set({
		'lastMessageNum' : msgNum
	}, function() {
		// Notify that we saved.
		console.log("Message number updated");
	});
}

/**
 *	Redirects the url in the address bar if it is the youtube homepage and the
 * 	option to do so has been set in the options menu.
 */
function redirectYouTube() {
	chrome.tabs.getSelected(null, function(tab) {
		//properties of tab object
		tabId = tab.id;
		tabUrl = tab.url;

		if (urlMatch(tabUrl)) {
			chrome.storage.sync.get(['redirectYouTube', 'iconURLTxt'], function(r) {
				if (r.redirectYouTube) {
					if (r.iconURLTxt == null || r.iconURLTxt == 'undefined') {
						chrome.tabs.update(defaultURL, function() {
						});
					} else {
						chrome.tabs.update(tabId, {
							url : r.iconURLTxt
						}, function() {
						});
					}
				}
			});
		}

	});
}

/**
 *	Checks if the url matches any of youtubes url's
 * @param {Object} url
 */
function urlMatch(url) {
	if (url.endsWith("youtube.com/") || url.endsWith("youtube.com.br/") || url.endsWith("youtube.fr/") || url.endsWith("youtube.jp/") || url.endsWith("youtube.nl/") || url.endsWith("youtube.pl/") || url.endsWith("youtube.ie/") || url.endsWith("youtube.co.uk/") || url.endsWith("youtube.es/") || url.endsWith("youtube.it/") || url.endsWith("youtube.com") || url.endsWith("youtube.com.br") || url.endsWith("youtube.fr") || url.endsWith("youtube.jp") || url.endsWith("youtube.nl") || url.endsWith("youtube.pl") || url.endsWith("youtube.ie") || url.endsWith("youtube.co.uk") || url.endsWith("youtube.es") || url.endsWith("youtube.it")) {

		return true;
	}

	return false;
}

/**
 *	Adds the endsWith method to the string class.
 * @param {Object} s - the string to check if it ends with
 */
String.prototype.endsWith = function(s) {
	return this.length >= s.length && this.substr(this.length - s.length) == s;
};
