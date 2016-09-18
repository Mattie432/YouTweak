/**
 * Created by Mattie432 on 24/04/2016.
 */
var KeyArray	=	[ 'clearAllVideos' ];

getStoredChromeSettings( KeyArray, init );

function init(returnedSettings) {
    if (returnedSettings.clearAllVideos) {
        initClearAllVideos();
    }
}

/**
 *	Adds the button to remove all videos to the left context bar.
 */
function initClearAllVideos() {
    addButton_MenuItem("Clear all videos", function() {
        var confirmWindow = confirm("Clearing all videos may take a \nfew moments. This cannot be undone! Continue?");
        if (confirmWindow == true) {
            document.body.style.cursor = "wait";
            loadAllVideos(function() {
                alert("Now removing all subscription videos.");
                clearAllVideos();
                alert("All videos removed.");
                document.body.style.cursor = "default";
                window.location.reload();
            });
        }
    });
}

/**
 *	Removes all videos from the youtube homescreen.
 */
function clearAllVideos() {
    //Find all the video elements
    var videoItems = find_AllFeedVideos();

    //For each video
    for (var i = 0; i < videoItems.length; i++) {

        //get the hide button
        var vidHideBtn = find_FeedVideoHideButton(videoItems[i]);
        vidHideBtn.click();

        //get dismissal notice
        var dismissalNotice = find_FeedVideoDismissalMessage(videoItems[i])
        dismissalNotice.remove();

    }

    //scroll to top
    try {
        window.scrollTo(0, 0);
    } catch(e) {
        console.log("scroll error...");
    }
}
