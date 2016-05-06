/**
 * Created by Mattie432 on 24/04/2016.
 */
var KeyArray	=	[ 'removeWatchedVideos', 'deleteWatchedVidsAutomated' ];

getStoredChromeSettings( KeyArray, init );

function init(returnedSettings) {
    if (returnedSettings.removeWatchedVideos) {
        if (returnedSettings.deleteWatchedVidsAutomated) {
            //auto
            initremoveWatchedVideosAutomated();
        } else {
            //not auto
            initremoveAllWatchedVideos();
        }
    }
}

/**
 *	Adds a remove all watched button to the left context bar.
 */
function initremoveAllWatchedVideos() {
    addButton_MenuItem("Clear watched videos", removeAllWatched);
}

/**
 *	Removes all watched videos on the page. This is used by the automated system option.
 */
function initremoveWatchedVideosAutomated() {
    //Remove all watched now.
    removeAllWatched();

    //Callback when loading more videos
    addListener_LoadMoreVideos( function() {
        var feedlist = find_FeedList();
        for(var i = 0; i < feedlist.length; i++){
            var feedListElem = feedlist[i];

            if (feedlist.length > countRemovedWatchedVideosAutomated) {
                //alert(feedPages.length);
                var scrollToY = window.scrollY
                var removedVideos = removeAllWatched(false);
                countRemovedWatchedVideosAutomated = feedlist.length;
                window.scrollTo(0,scrollToY)
            }
        }
    }, "Removing watched videos automatically.");
}
var countRemovedWatchedVideosAutomated = 0;

/**
 *  Remove all watched videos from the homescreen.
 * @param {Object} scrollToTop : Boolean - scroll to top of page after.
 */
function removeAllWatched(scrollToTop, optionalCallback) {
    //Find all the video elements
    var videoItems = find_AllFeedVideos();

    var removeWatchedInterval = setInterval( function() {
        console.log("Removed video: " + videoItems.length + " left.");
        var video = videoItems.pop();
        var watched = find_FeedVideoWatchedBadge(video);
        if (watched != null) {
            //Video has been watched

            //get the hide button
            var vidHideBtn = find_FeedVideoHideButton(video);
            vidHideBtn.click();

            //get dismissal notice
            video.remove();

            //update return
            removedVideos = true;
        }
        if(videoItems.length <= 0 ) {
            console.log("Clearing interval");
            clearInterval(removeWatchedInterval);

            //Invoke callback if its there
            if(typeof optionalCallback !== 'undefined') {
                optionalCallback();
            }
        }
    }, 5 );

    if (scrollToTop != false) {
        //scroll to top
        try {
            window.scrollTo(0, 0);
        } catch(e) {
            console.log("scroll error...");
        }
    }
}



/**
 * Get the watched badge for a video element.
 */
function find_FeedVideoWatchedBadge(videoElement){
    return searchAllChildrenFor(videoElement, "class", "watched-badge", true)
}
