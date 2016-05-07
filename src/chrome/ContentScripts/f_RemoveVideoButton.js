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

        //Add css styles to the page
        addCSSRemoveVideoButton();

        //Run now to add to those currently in view.
        initRemoveSingleVideo();

        //Add a listener for a new page of videos being added.
        addListener_LoadMoreVideos( initRemoveSingleVideo, "Adding more remove buttons.");
    }
}

function addCSSRemoveVideoButton() {
    var sheet = addCSS_Sheet();
    addCSS_Rule(sheet, ".contains-addto:hover .video-actions-leftAlign",
        "right: 172px;",
        0
    );

    addCSS_Rule(sheet, ".addto-button-Delete:before",
        "background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflsIkBw3.webp) -60px -1008px;" +
        "background-size: auto;" +
        "height: 13px;" +
        "width: 13px;"
        ,0
    );
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

    var btn = createButton_RemoveVideo2();
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

    appendTo.appendChild(btn);
    videoElement.appendChild(doneSpan);
}

/**
 * Find the location to append the rmo
 */
function find_RemoveButtonAppendLocation(videoElement){
    var returnVal = searchAllChildrenFor(videoElement, "class", "contains-addto", true);
    if( undefinedVariable(returnVal)) {
        returnVal = null;
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

function createButton_RemoveVideo2() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "THisIsTheRighOne";
    btn.style.width = "20px";
    btn.style.height = "20px";
    btn.style.padding = "0px";
    btn.setAttribute("data-tooltip-text", "Delete Video");
    btn.className = "yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon video-actions no-icon-markup spf-nolink hide-until-delayloaded yt-uix-tooltip video-actions-leftAlign addto-button-Delete";
    //addto-button addto-queue-button addto-tv-queue-button video-actions
    return btn;
}