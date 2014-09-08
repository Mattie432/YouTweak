init();

/**
 *	Initialisation for the class.
 */
function init() {
	chrome.storage.sync.get(['deleteSubsBtn', 'removeWatchedVideos', 'deleteWatchedVidsAutomated', 'loadAllVideos', 'clearAllVideos', 'removeRecomendedChannels'], function(r) {

		if (r.removeRecomendedChannels) {
			//removeRecommendedChannels();
		}
		if (r.deleteSubsBtn) {
			initRemoveSingleVideo();
			setInterval(initRemoveSingleVideo, 1000);
			addedSeparator = false;
		}
		if (r.removeWatchedVideos) {
			if (r.deleteWatchedVidsAutomated) {
				//auto
				setInterval(initremoveWatchedVideosAutomated, 1000);
				addedSeparator = false;
			} else {
				//not auto
				initremoveAllWatchedVideos();
				addedSeparator = false;
			}
		}
		if (r.loadAllVideos) {
			initLoadAllVideos();
		}
		if (r.clearAllVideos) {
			initClearAllVideos();
		}

		openLinksInSameWindow();
		addSeparater();
	});
}

/**
 *	Adds the button to remove all videos to the left context bar.
 */
function initClearAllVideos() {
	addNewMenuBtn("Clear all videos", function() {
		var confirmWindow = confirm("Clearing all videos may take a \nfew moments. This cannot be undone! Continue?");
		if (confirmWindow == true) {
			try {
				allLoadedForClear = false;
				document.body.style.cursor = "wait";
				loadAllIntervalForClear = setInterval(function() {

					loadAllVideos();

				}, 100);

				clearAllIntervalForClear = setInterval(function() {
					if (allLoaded) {
						alert("Now removing all subscription videos.");
						clearAllVideos();
						alert("All videos removed.");
						window.clearInterval(clearAllIntervalForClear);
						document.body.style.cursor = "default";
						window.location.reload();
					}
				});

			} finally {
				//allLoadedForClear = true;
			}
		}
	});
}

var loadAllIntervalForClear;
var allLoadedForClear = false;
var clearAllIntervalForClear;

/**
 *	Removes all videos from the youtube homescreen.
 */
function clearAllVideos() {

	//Find all the video elements
	var videoItems = searchForTagAndClass("li", "feed-item-container");

	//For each video
	for (var i = 0; i < videoItems.length; i++) {

		//get dismissal notice
		var dismissalNotice = searchAllChildrenFor(videoItems[i], "class", "feed-item-dismissal-notices", true);
		//dismissalNotice.remove();

		//get the hide button
		var vidHideBtn = searchAllChildrenFor(videoItems[i], "data-action", "hide", true);
		vidHideBtn.click();

	}

	//scroll to top
	try {
		window.scrollTo(0, 0);
	} catch(e) {
		console.log("scroll error...");
	}

}

/**
 *	Adds a button to load all videos to the left context bar.
 */
function initLoadAllVideos() {

	addNewMenuBtn("Load all videos", function() {
		var confirmWindow = confirm("Loading all videos may take a \nfew moments. Continue?");
		if (confirmWindow == true) {
			try {
				document.body.style.cursor = "wait";
				loadAllInterval = setInterval(loadAllVideos, 100);
				document.body.style.cursor = "normal";
			} finally {
				document.body.style.cursor = "default";
			}
		}
	});

}

/**
 * Loads all videos on the homescreen into view.
 */
function loadAllVideos() {
	allLoaded = false;

	var feedlist = searchForTagAndClass("ul", "browse-items-primary");
	pageCount1 = feedlist.length;

	var loadContainer = searchAllChildrenFor(document, "class", "load-more-button", true);

	if (loadContainer.className.indexOf("loading") != -1) {
		//currently loading
		var a = 1;
	} else if (pageCount1 == prevPage) {
		//done loading
		window.clearInterval(loadAllInterval);
		alert("Subscriptions fully loaded.");
		allLoaded = true;
	} else {
		//not loading
		prevPage = feedlist.length;
		loadContainer.firstElementChild.click();
	}
}
var prevPage = -1;
var pageCount1 = 0;
var allLoaded = false;
var loadAllInterval;

/**
 *	Adds a remove button to all videos on the homepage.
 */
function initRemoveSingleVideo() {
	//Find all the video elements
	var videoItems = searchForTagAndClass("li", "feed-item-container");

	//For each video
	for (var i = 0; i < videoItems.length; i++) {
		if (videoItems[i].lastChild.tagName !== "DONE") {
			//get the hide button
			var vidHideBtn = searchAllChildrenFor(videoItems[i], "data-action", "hide", true);

			//Add the btn to the video
			addRemoveBtn(videoItems[i], vidHideBtn);
		}
	}
}

/**
 *
 *	Adds the 'remove' button to all the video elements.
 * @param {Object} videoElement : li element - expects the li of the video on the homepage
 * @param {Object} clickableHideBtn : element - expects the hideBtn of that video.
 */
function addRemoveBtn(videoElement, clickableHideBtn) {
	//Place where the new btn will be added.
	var appendTo = searchAllChildrenFor(videoElement, "class", "feed-item-main-content", true);

	var btn = createRemoveBtn1();
	//Used to signify that this video has already had a btn added.
	var doneSpan = document.createElement("DONE");
	var dismissalNotice = searchAllChildrenFor(videoElement, "class", "feed-item-dismissal-notices", true);

	//The div that surrounds the btn, used for css placement
	var enclosingDiv = document.createElement("div");
	enclosingDiv.className = "enclosingDiv";
	enclosingDiv.style.height = "15px";
	enclosingDiv.appendChild(btn);

	btn.onclick = function() {

		try {
			clickableHideBtn.click();
			videoElement.remove();

		} catch(ex) {
			console.log("Error clicking remove button.");
		}
		//clickableHideBtn.click();
		// btn.remove();
		dismissalNotice.remove();
	};

	appendTo.appendChild(enclosingDiv);
	videoElement.appendChild(doneSpan);
}

/**
 *	Creates a remove button element.
 * @return {element} - remove button object.
 */
function createRemoveBtn1() {

	// do stuff to add button
	var btn = document.createElement("input");
	btn.type = "button";
	btn.className = "RemoveVideo";
	btn.value = "Remove Video";
	btn.style.cursor = "pointer";
	btn.style.fontFamily = "arial,sans-serif";
	btn.style.fontWeight = "bold";
	btn.style.fontSize = "11px";

	// Style
	btn.style.position = "absolute";
	btn.style.right = "10px";
	btn.style.bottom = "10px";

	btn.style.height = "20";
	btn.style.width = "75";
	btn.style.backgroundColor = "#B51D1D";
	btn.style.color = "#fff";
	//btn.style.marginLeft = "420px";

	return btn;
}

/**
 *	Adds a remove all watched button to the left context bar.
 */
function initremoveAllWatchedVideos() {

	addNewMenuBtn("Remove watched videos", removeAllWatched);

}

/**
 *	Removes all watched videos on the page. This is used by the automated system option.
 */
function initremoveWatchedVideosAutomated() {

	var feedlist = document.getElementById("browse-items-primary").children;

	for(var i = 0; i < feedlist.length; i++){
		var feedListElem = feedlist[i];
		var elemChildren = feedListElem.children;

		if (feedlist.length > countRemovedWatchedVideosAutomated) {
			//alert(feedPages.length);
			try {
				var removedVideos = removeAllWatched(false);
				countRemovedWatchedVideosAutomated = feedlist.length;
			} catch(err) {
				console.log("Error in deleting watched vids automated...");
			}
		}
	}
}

var countRemovedWatchedVideosAutomated = 0;

/**
 *	Remove all watched videos from the homescreen.
 * @param {Object} scrollToTop : Boolean - scroll to top of page after.
 */
function removeAllWatched(scrollToTop) {

	var removedVideos = false;

	//Find all the video elements
	var videoItems = searchForTagAndClass("li", "feed-item-container");

	//For each video
	for (var i = 0; i < videoItems.length; i++) {
		//Check if its watched
		var watched = searchAllChildrenFor(videoItems[i], "class", "watched-badge", true);
		if (watched != null) {
			//Video has been watched

			//get the hide button
			var vidHideBtn = searchAllChildrenFor(videoItems[i], "data-action", "hide", true);
			vidHideBtn.click();

			//get dismissal notice
			videoItems[i].remove();

			//update return
			removedVideos = true;

		}

	}

	if (scrollToTop != false) {
		//scroll to top
		try {
			window.scrollTo(0, 0);
		} catch(e) {
			console.log("scroll error...");
		}
	}

	return removedVideos;
}

///////////////////////////////////////////////////////////////////////////
//			Helper Functions				//
///////////////////////////////////////////////////////////////////////////

/**
 *
 *	Adds a new menu button to the left context bar.
 *	@param {String} btnText - the text on the button
 * 	@param {function} onClickFunction - the function to call on click
 */
function addNewMenuBtn(btnText, onClickFunction) {

	var parent = searchAllChildrenFor(document, "class", "guide-toplevel", true);
	parent = parent.firstElementChild;

	var listElem = document.createElement("li");
	listElem.className = "vve-check guide-channel";

	var link = document.createElement("a");
	link.className = "guide-item yt-uix-sessionlink yt-valign spf-nolink ";
	link.onclick = function() {
		onClickFunction();
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
	parent.insertBefore(listElem);

}

/**
 *	Adds a separator to the left contextbar if there have been any additions by this extension.
 */
function addSeparater() {
	if (addedSeparator == false) {
		//Create the separator
		var sep = document.createElement("hr");
		sep.className = "guide-section-separator";

		var insertBeforeOnPage = searchAllChildrenFor(document, "class", "guide-toplevel", true);
		insertBeforeOnPage = insertBeforeOnPage.firstElementChild;

		insertBeforeOnPage.appendChild(sep);
		addedSeparator = true;
	}
}

var addedSeparator = true;

/**
 *	Forces all links to open in the same window.
 */
function openLinksInSameWindow() {

	var links = document.getElementsByTagName("a");

	for (var i = 0; i < links.length; i++) {
		try {
			if (links[i].getAttribute("href").indexOf("/watch?") != -1) {
				links[i].setAttribute("target", "_self");
			}
		} catch(ex) {

		}
	}

}