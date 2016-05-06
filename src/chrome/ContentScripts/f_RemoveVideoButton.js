/**
 * Created by Mattie432 on 24/04/2016.
 */
var KeyArray	=	[ 'deleteSubsBtn' ];

getStoredChromeSettings( KeyArray, init );

/*
 *  Initial startup method for the class.
 *  @param returnedSettings : Object - returned settings.
 */
function init( returnedSettings ) {
    if (returnedSettings.deleteSubsBtn) {
        //Run now to add to those currently in view.
        initRemoveSingleVideo();

        //Add a listener for a new page of videos being added.
        addListener_LoadMoreVideos( initRemoveSingleVideo, "Adding more remove buttons.");
    }
}

/*
*	Adds a remove button to all videos on the homepage.
*/
function initRemoveSingleVideo() {
    //Find all the video elements
    var videoItems = find_AllFeedVideos();

    //For each video
    for (var i = 0; i < videoItems.length; i++) {
        if (videoItems[i].lastChild.tagName !== "DONE") {
            //get the hide button
            var vidHideBtn = find_FeedVideoHideButton(videoItems[i]);

            //Add the btn to the video
            addButton_RemoveVideo(videoItems[i], vidHideBtn);
        }
    }


}

/**
 *
 *	Adds the 'remove' button to all the video elements.
 * @param {Object} videoElement : li element - expects the li of the video on the homepage
 * @param {Object} clickableHideBtn : element - expects the hideBtn of that video.
 */
function addButton_RemoveVideo(videoElement, clickableHideBtn) {

    //Place where the new btn will be added.
    var appendTo = find_RemoveButtonAppendLocation(videoElement);

    var btn = createButton_RemoveVideo1();
    //Used to signify that this video has already had a btn added.
    var doneSpan = document.createElement("DONE");
    var dismissalNotice = find_FeedVideoDismissalMessage(videoElement);

    //The div that surrounds the btn, used for css placement
    var enclosingDiv = document.createElement("div");
    enclosingDiv.className = "enclosingDiv";
    enclosingDiv.style.height = "20px";
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
 * Find the location to append the rmo
 */
function find_RemoveButtonAppendLocation(videoElement){
    var returnVal = videoElement.firstChild;
    if( undefinedVariable(returnVal)) {
        returnVal = searchAllChildrenFor(videoElement, "class", "expanded-shelf", true);
    }

    //Check the value & return if we found something
    if( undefinedVariable(returnVal)) {
        throw "findFeedVideoHideButton returned null.";
    } else {
        return returnVal;
    }
}

/**
 *	Creates a remove button element.
 * @return {element} - remove button object.
 */
function createButton_RemoveVideo1() {
    var btn = document.createElement("input");
    btn.type = "button";
    btn.className = "RemoveVideo";
    btn.value = "Remove Video";
    btn.style.cursor = "pointer";
    btn.style.fontFamily = "arial,sans-serif";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "11px";

    // Style
    btn.style.marginTop = "1px";
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