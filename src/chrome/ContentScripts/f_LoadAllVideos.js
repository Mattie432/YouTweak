/**
 * Created by Mattie432 on 24/04/2016.
 */
var KeyArray	=	[ 'loadAllVideos' ];

getStoredChromeSettings( KeyArray, init );

function init(returnedSettings) {
    if (returnedSettings.loadAllVideos) {
        initLoadAllVideos();
    }
}

/**
 *	Adds a button to load all videos to the left context bar.
 */
function initLoadAllVideos() {

    addButton_MenuItem("Load all videos", function() {
        var confirmWindow = confirm("Loading all videos may take a \nfew moments. Continue?");
        if (confirmWindow == true) {
            document.body.style.cursor = "wait";
            loadAllVideos();
        }
    });
}

/**
 * Loads all videos on the homescreen into view.
 */
function loadAllVideos(callbackFunction) {
    loadAllInterval = setInterval( function() {
        var feedlist = find_FeedList();
        pageCount1 = feedlist.length;

        var loadContainer = searchAllChildrenFor(document, "class", "load-more-button", true);

        if (loadContainer!= null && loadContainer.className.indexOf("loading") != -1) {
            //currently loading
            var a = 1;
        } else if (pageCount1 == prevPage) {
            //done loading
            window.clearInterval(loadAllInterval);
            document.body.style.cursor = "default";

            alert("Subscriptions fully loaded.");

            //Finished, invoke callback
            if(typeof callbackFunction !== 'undefined') {
                callbackFunction();
            }
        } else {
            //not loading
            prevPage = feedlist.length;
            if(loadContainer != null){
                loadContainer.firstElementChild.click();
            }
        }
    });
}
var prevPage = -1;
var pageCount1 = 0;
var loadAllInterval;