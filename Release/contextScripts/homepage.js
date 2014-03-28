init();
function init(){
	chrome.storage.sync.get([ 'deleteSubsBtn', 'removeWatchedVideos',
	'deleteWatchedVidsAutomated','loadAllVideos','clearAllVideos','removeRecomendedChannels'], function(r) {

		if (r.deleteSubsBtn) {
			initRemoveSingleVideo();
			setInterval(initRemoveSingleVideo,1000);
			addedSeparator = false;
		}
		if (r.removeWatchedVideos) {
			if(r.deleteWatchedVidsAutomated){
				//auto
				setInterval(initremoveWatchedVideosAutomated, 1000);
				addedSeparator = false;
			}else{
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
		if (r.removeRecomendedChannels) {
			removeRecommendedChannels();
		}
		
		openLinksInSameWindow();
		addSeparater();
	});
}


///////////////////////////////////////////////////////////////////////////
//			Remove all videos on homepage			//
///////////////////////////////////////////////////////////////////////////
function initClearAllVideos(){
	addNewMenuBtn("Clear all videos", function() {
		var confirmWindow = confirm("Clearing all videos may take a \nfew moments. This cannot be undone! Continue?");
		if(confirmWindow == true){
			try{
				document.body.style.cursor = "wait";
				loadAllInterval = setInterval(loadAllVideos, 100);
				
				alert("Now removing all subscription videos.");
				clearAllVideos();
				alert("All videos removed.");
				document.body.style.cursor = "normal";
			}finally{
				document.body.style.cursor = "default";
			}
		}
	});
}

function clearAllVideos(){
	
	//Find all the video elements
	var videoItems = searchForTagAndClass("li","feed-list-item");
	
	//For each video
	for(var i = 0; i<videoItems.length; i++){

		//get dismissal notice
		var dismissalNotice = searchAllChildrenFor(videoItems[i],"class","feed-item-dismissal-notices", true);
		//dismissalNotice.remove();
		
		//get the hide button
		var vidHideBtn = searchAllChildrenFor(videoItems[i],"data-action","hide", true);
		vidHideBtn.click();
		
	}
	
	//scroll to top
	try {
		window.scrollTo(0, 0);
	} catch(e) {
		console.log("scroll error...");
	}
	
}


///////////////////////////////////////////////////////////////////////////
//			Remove recommended channels			//
///////////////////////////////////////////////////////////////////////////

function removeRecommendedChannels(){
	try{
		var recommendedChannels = searchAllChildrenFor(document,"class","branded-page-v2-secondary-col",true);
		recommendedChannels.parentNode.removeChild(recommendedChannels);
	}catch(ex){
		console.log("error removing recommendedChannels");	
	}
}





///////////////////////////////////////////////////////////////////////////
//			Load all videos on homepage			//
///////////////////////////////////////////////////////////////////////////

function initLoadAllVideos(){

addNewMenuBtn("Load all videos", function() {
		var confirmWindow = confirm("Loading all videos may take a \nfew moments. Continue?");
		if(confirmWindow == true){
			try{
				document.body.style.cursor = "wait";
				loadAllInterval = setInterval(loadAllVideos, 100);
				document.body.style.cursor = "normal";
			}finally{
				document.body.style.cursor = "default";
			}
		}
	}
);
	
}

//Loads all available videos onto the homepage
var loadAllInterval;
function loadAllVideos(){
	
	
	var loadContainer = searchAllChildrenFor(document,"class","feed-load-more-container",true);
	
	if(loadContainer.className.indexOf("loading") != -1){
		//currently loading
	}else if(loadContainer.className.indexOf("hid") != -1) {
	//done loading
		window.clearInterval(loadAllInterval);
		alert("Subscriptions fully loaded.");
	}else {
		//not loading
		loadContainer.firstElementChild.click();
	}
}




///////////////////////////////////////////////////////////////////////////
//			Remove individual video				//
///////////////////////////////////////////////////////////////////////////

//Initialises the adding 'remove' btn to all videos
function initRemoveSingleVideo(){
	//Find all the video elements
	var videoItems = searchForTagAndClass("li","feed-item-container");
	
	//For each video
	for(var i = 0; i<videoItems.length; i++){
		if (videoItems[i].lastChild.tagName !== "DONE"){
			//get the hide button
			var vidHideBtn = searchAllChildrenFor(videoItems[i],"data-action","hide", true);
			
			//Add the btn to the video
			addRemoveBtn(videoItems[i],vidHideBtn);
		}
	}
}

//Adds the 'remove' button to the video element. (expects the li of the video)
//expects the hideBtn of that video.
function addRemoveBtn(videoElement, clickableHideBtn){
	//Place where the new btn will be added.
	var appendTo = searchAllChildrenFor(videoElement,"class","feed-item-main-content", true);

	var btn = createRemoveBtn1();
	//Used to signify that this video has already had a btn added.
	var doneSpan = document.createElement("DONE");
	var dismissalNotice = searchAllChildrenFor(videoElement,"class","feed-item-dismissal-notices", true);
	
	//The div that surrounds the btn, used for css placement
	var enclosingDiv = document.createElement("div");
	enclosingDiv.className = "enclosingDiv";
	enclosingDiv.style.height = "15px";
	enclosingDiv.appendChild(btn);
	
	
	btn.onclick = function() {
		
		try{
			clickableHideBtn.click();
			
		}catch(ex){
			console.log("Error clicking remove button.")
		}
		//clickableHideBtn.click();
		// btn.remove();
		dismissalNotice.remove();
	};

	appendTo.appendChild(enclosingDiv);
	videoElement.appendChild(doneSpan);
}

// Creates a 'remove' button element.
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



///////////////////////////////////////////////////////////////////////////
//			Remove all watched videos			//
///////////////////////////////////////////////////////////////////////////

//Create the 'Remove All Watched' button
function initremoveAllWatchedVideos() {
	
	addNewMenuBtn("Remove watched videos",removeAllWatched);
	
}

//Automatically remove watched videos
var countRemovedWatchedVideosAutomated = 0;
function initremoveWatchedVideosAutomated() {

	var feedlist = searchForTagAndClass("ul","feed-list");
	
	if (feedlist[0].children.length > countRemovedWatchedVideosAutomated) {
	//alert(feedPages.length);
		try{
			removeAllWatched(false);
			countRemovedWatchedVideosAutomated = feedlist[0].children.length;
		}
		catch(err){
			console.log("Error in deleting watched vids automated...")
		}
	}

}

//Removes all watched videos.
function removeAllWatched(scrollToTop){
	
	//Find all the video elements
	var videoItems = searchForTagAndClass("li","feed-item-container");
	
	//For each video
	for(var i = 0; i<videoItems.length; i++){
		//Check if its watched
		var watched = searchAllChildrenFor(videoItems[i],"class","watched-badge",true);
		if (watched != null){
			//Video has been watched
		
		
			//get the hide button
			var vidHideBtn = searchAllChildrenFor(videoItems[i],"data-action","hide", true);
			vidHideBtn.click();
			
			//get dismissal notice
			var dismissalNotice = searchAllChildrenFor(videoItems[i],"class","feed-item-dismissal-notices", true);
			dismissalNotice.remove();
			
			
		}
		
		
	}
	
	if(scrollToTop != false){
		//scroll to top
		try {
			window.scrollTo(0, 0);
		} catch(e) {
			console.log("scroll error...");
		}
	}
}



///////////////////////////////////////////////////////////////////////////
//			Helper Functions				//
///////////////////////////////////////////////////////////////////////////

//Searches all children of the root element for the attribute value and the attribute name.
//e.g. root = li, attributeName = "class", attributeValue = "videoList"
//Toplevel should always be set to True when its first called!!
var returnValue;
function searchAllChildrenFor(root, attributeName, attributeValue,topLevel){
	if(topLevel == true){
		returnValue = null;
	}
	
	if(root.children != null && returnValue == null){
		for(var i = 0; i<root.children.length; i++){
			var t = root.children[i].getAttribute(attributeName);
			if(t != null){
			 var c=1;
			}
			
			if(root.children[i].getAttribute(attributeName) == null){
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			}else if(root.children[i].getAttribute(attributeName).indexOf(attributeValue) != -1){
				returnValue = root.children[i];
				return root.children[i];
			}else{
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			}
		}
	}
	
	//If nothing found then return null
	return returnValue;
}

// Returns list of elements with the className
function getElemByClassFromArray(array, className) {
	try {
		var temp = new Array();
		if (array != null) {
			for ( var i = 0; i < array.length; i++) {
				if (array[i].className.indexOf(className) != -1) {
					temp.push(array[i]);
				}
			}
		}
		
	} catch (e) {
		
	}
	return temp;
}

//Returns all the elements with the tag and className in the current document.
function searchForTagAndClass(tagName,className){
	var returnValues = new Array();
	var tagCollection = document.getElementsByTagName(tagName);
	for(var i = 0; i<tagCollection.length; i++){
		if(tagCollection[i].className.indexOf(className) != -1){
			returnValues.push(tagCollection[i]);
		}
	}
	return returnValues;
}

//Adds a new menu button to the left menu bar
function addNewMenuBtn(btnText,onClickFunction){

	var parent = searchAllChildrenFor(document,"class","guide-toplevel", true);
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

//Adds a separator to the homepage left menu
var addedSeparator = true;
function addSeparater(){
	if(addedSeparator == false){
		//Create the separator
		var sep = document.createElement("hr");
		sep.className = "guide-section-separator";
		
		
		var insertBeforeOnPage = searchAllChildrenFor(document,"class","guide-toplevel", true);
		insertBeforeOnPage = insertBeforeOnPage.firstElementChild;
		
		
		insertBeforeOnPage.appendChild(sep);
		addedSeparator = true;
	}
}

function openLinksInSameWindow(){
	
	var links = document.getElementsByTagName("a");
	
	for(var i = 0; i < links.length; i++){
		try{
			if (links[i].getAttribute("href").indexOf("/watch?") != -1){
			    links[i].setAttribute("target","_self");
			}
		}catch(ex){
			
		}
	}
	
}