/**
 *  Function to retrieve settings from googles online storage, then calls
 *  CallbackFunction with the result.
 */
function getStoredChromeSettings( KeyArray, CallbackFunction ){
	chrome.storage.sync.get(
        KeyArray,
        function(r) {
            if( r == null || r == undefined || r == 'undefined' )
                throw "There was a problem retrieving saved settings from google.";

            //See whats retrieved from chrome storage.
            var returnedKeys = [];
            for( var key in r )
                if ( r.hasOwnProperty( key ) )
                    returnedKeys.push( key );
            console.debug("Retrieved value list [" + returnedKeys + "].");

			try	{
				CallbackFunction(r);
			} catch (err) {
				logError(err);
			}
        }
    );
}

function logError(err){
	console.error("YouTweak Error: " + err.stack);
}

/**
 *
 *	This searches all children of an element recursively for a value of an attribute. At first call
 * 	set topLevel to true.
 */
var returnValue;
function searchAllChildrenFor(root, attributeName, attributeValue, topLevel) {
	if (topLevel == true) {
		returnValue = null;
	}

	if (root.children != null && returnValue == null) {
		for (var i = 0; i < root.children.length; i++) {
			var t = root.children[i].getAttribute(attributeName);
			if (t != null) {
				var c = 1;
			}

			if (root.children[i].getAttribute(attributeName) == null) {
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			} else if (root.children[i].getAttribute(attributeName).indexOf(attributeValue) != -1) {
				returnValue = root.children[i];
				return root.children[i];
			} else {
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			}
		}
	}

	//If nothing found then return null
	return returnValue;
}

/**
 *	Searches the array of elements for those with the classname parameter.
 * @param {Object} array : Element - dom elements
 * @param {Object} className : String - the classname to search for
 */
function getElemByClassFromArray(array, className) {
	try {
		var temp = new Array();
		if (array != null) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].className.indexOf(className) != -1) {
					temp.push(array[i]);
				}
			}
		}

	} catch (e) {

	}
	if(temp.length > 0 ) {
		return temp;
	} else {
		return null;
	}

}

/**
 * Returns all the elements with the tag and className in the current document.
 */
function searchForTagAndClass(tagName, className) {
	var returnValues = new Array();
	var tagCollection = document.getElementsByTagName(tagName);
	for (var i = 0; i < tagCollection.length; i++) {
		if (tagCollection[i].className.indexOf(className) != -1) {
			returnValues.push(tagCollection[i]);
		}
	}

	if(returnValues.length > 0 ) {
		return returnValues;
	} else {
		return null;
	}

}

function undefinedVariable(variable) {
	//Check the value & return if we found something
	if( variable == null || variable == 'undefined' || variable == undefined ) {
		return true;
	} else {
		return false;
	}
}

/**
 * Returns an array of all video items on the page.
 */
function find_AllFeedVideos(){
	var returnVal = searchForTagAndClass("li", "yt-shelf-grid-item");
	if( undefinedVariable(returnVal) ) {
		//20160424
		returnVal = searchForTagAndClass("div", "feed-item-container");
	}

	//Check the value & return if we found something
	if( undefinedVariable(returnVal)) {
		throw "findAllFeedVideos returned null.";
	} else {
		return returnVal;
	}
}

/**
 * Finds the hide button for a video element.
 */
function find_FeedVideoHideButton(videoElement){
	var returnVal = searchAllChildrenFor(videoElement, "data-action", "replace-enclosing-action", true);
	if( undefinedVariable(returnVal) ) {
		//20160424
		returnVal = searchAllChildrenFor(videoElement, "data-action", "hide", true);
	}

	//Check the value & return if we found something
	if( undefinedVariable(returnVal)) {
		throw "findFeedVideoHideButton returned null.";
	} else {
		return returnVal;
	}
}

/**
 * Finds the associated dismissal message for a video element item.
 */
function find_FeedVideoDismissalMessage(videoElement){
	var returnVal =  videoElement;
	if( undefinedVariable(returnVal) ) {
		//20160424
		returnVal = searchAllChildrenFor(videoElement, "class", "feed-item-dismissal-notices", true);
	}

	//Check the value & return if we found something
	if( undefinedVariable(returnVal)) {
		throw "findFeedDismissalMessage returned null.";
	} else {
		return returnVal;
	}
}

/**
 *
 *	Adds a new menu button to the left context bar.
 *	@param {String} btnText - the text on the button
 * 	@param {function} onClickFunction - the function to call on click
 */
function addButton_MenuItem(btnText, onClickFunction) {

	var parent = addMenu_Sidebar().firstElementChild;

	var listElem = document.createElement("li");
	listElem.className = "vve-check guide-channel";

	var link = document.createElement("a");
	link.className = "guide-item yt-uix-sessionlink yt-valign spf-nolink ";
	link.onclick = function() {
		try{
			onClickFunction();
		} catch(err) {
			logError(err);
		}
	};
	listElem.appendChild(link);

	var topSpan = document.createElement("span");
	topSpan.className = "yt-valign-container";

	var span = document.createElement("span");
	span.className = "display-name no-count";

	var textDetails = document.createElement("span");
	textDetails.title = btnText;
	textDetails.innerText = btnText;

	//Append it to the correct place.
	link.appendChild(topSpan);
	topSpan.appendChild(span);
	span.appendChild(textDetails);
	parent.insertBefore(listElem,parent.firstElementChild.nextElementSibling);
}

function addMenu_Sidebar() {
	//Check if we've already added it
	var section = document.getElementById("YouTweak-guide-section");
	if( section != null )
		return section;

	//Get guide menu
	var guide_toplevel = searchAllChildrenFor(document, "class", "guide-toplevel", true);

	//Get options page URL
	var optionsPage = chrome.extension.getURL("optionspage/options.html");

	//Create youtweak menu
	var section = document.createElement("li");
	section.className = "guide-section";
	section.id = "YouTweak-guide-section";
	var guide_item_container = document.createElement("div");
	guide_item_container.className = "guide-item-container personal-item";
	var menu_header = document.createElement("h3");
	var title_link = document.createElement("a");
	title_link.onclick = function() {chrome.runtime.sendMessage({method: "openYouTweakOptions" }, function() {});};
	title_link.className = "yt-uix-sessionlink g-hovercard";
	title_link.innerText = "YouTweak";
	var menuList = document.createElement("ul");
	menuList.className = "guide-user-links yt-uix-tdl yt-box";
	menuList.role = "menu";
	var sep = document.createElement("hr");
	sep.className = "guide-section-separator";

	guide_toplevel.insertBefore(section, guide_toplevel.firstElementChild.nextElementSibling);
	section.appendChild(guide_item_container);
	guide_item_container.appendChild(menu_header);
	menu_header.appendChild(title_link);
	guide_item_container.appendChild(menuList);
	guide_item_container.appendChild(sep);

	return section;
}

function addCSS_Rule(sheet, selector, rules, index) {
	if("insertRule" in sheet) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else if("addRule" in sheet) {
		sheet.addRule(selector, rules, index);
	}
}

function addCSS_Sheet() {
	var sheet = document.getElementById("YouTweak_CSS_Sheet");
	if(!undefinedVariable(sheet))
		return sheet;

	var sheet = (function() {
		// Create the <style> tag
		var style = document.createElement("style");
		style.id = "YouTweak_CSS_Sheet";

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// WebKit hack :(
		style.appendChild(document.createTextNode(""));

		// Add the <style> element to the page
		document.head.appendChild(style);

		return style.sheet;
	})();
	return sheet;
}

/**
 * Gets the 'feed list' of the page. This is all of the video elements
 */
function find_FeedList(){
	var browse_items_primary = document.getElementById("browse-items-primary");
	return feedlist = searchAllChildrenFor(browse_items_primary, "class","section-list",true).children;
}

/**
 * Function to embed a listener to completed AJAX calls into the document. Supplied with a callback function
 * which has 1 argument (string) which is the url of the AJAX callback. This can be checked to ensure the callback
 * matches the event you wish to intercept.
 * @type {Array}
 */
if(undefinedVariable(ajaxReturnCallbacks)) var ajaxReturnCallbacks = [];
function addListener_AjaxReturn( callback ) {
ajaxReturnCallbacks.push(callback);

	var main = function() {
		(function(open) {

			XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {

				this.addEventListener("readystatechange", function() {
					if( this.readyState == 4 ) {
						var myEvent= document.createEvent('CustomEvent');
						myEvent.initCustomEvent('AjaxCallbackEvent', true, true, url);
						document.body.dispatchEvent(myEvent);
						console.log("TEST");
					}
				}, false);

				open.call(this, method, url, async, user, pass);
			};

		})(XMLHttpRequest.prototype.open);
	};

	// Lets create the script objects
	var injectedScript = document.createElement('script');
	injectedScript.type = 'text/javascript';
	injectedScript.text = '('+main+')("");';
	(document.body || document.head).appendChild(injectedScript);

	document.body.addEventListener('AjaxCallbackEvent', function(ajaxURL) {
		for (var i = 0; i < ajaxReturnCallbacks.length; i++) {
			ajaxReturnCallbacks[i](ajaxURL.detail);
		}
	});
}

function addListener_LoadMoreVideos(callbackFunction, callbackDescription) {
	//Add a listener for a new page of videos being added.
	var feedPagesParent = "browse-items-primary";
	document.getElementById(feedPagesParent).addEventListener("DOMNodeInserted", function (event) {
		if(event.target.parentElement.id == feedPagesParent ) {
			console.log("YouTweak: detected a new video page. " + callbackDescription );
			callbackFunction();
		}
	});
};