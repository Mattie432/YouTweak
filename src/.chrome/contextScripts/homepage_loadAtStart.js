init();
var timer;
var interval = 10;

/**
 *	Initialisation for the class.
 */
function init() {
	chrome.storage.sync.get(['removeRecomendedChannels'], function(r) {

		if (r.removeRecomendedChannels) {
			timer = setInterval(removeRecommendedChannels, interval);
		}
	});

};

/**
 *	This removed the recommended channels block from the main menu. The timer will run
 * 	until it is removed or 10 seconds have passed, this allows ample time for the page to load.
 */
var count = 0;
function removeRecommendedChannels() {
	try {
		var recommendedChannels = searchAllChildrenFor(document, "class", "branded-page-v2-secondary-col", true);
		if (recommendedChannels != null) {
			recommendedChannels.parentNode.removeChild(recommendedChannels);
			clearInterval(timer);
		} else if (count == 5000 / interval) {
			clearInterval(timer);
		}
	} catch(ex) {
		console.log("error removing recommendedChannels");
		clearInterval(timer);
	}
	count++;
}

