/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2013 Mattie432                                    */
/*                                                                  */
/*  This obfuscated code was created by Mattie432 for the extension */
/*  YouTweak. This may not be used in part or in its entirety       */
/*  without the creators permission.                                */
/*                                                                  */
/*  http://www.mattie432.com/                                       */
/*                                                                  */
/********************************************************************/


document.addEventListener('DOMContentLoaded', init);


function init(){
clickBackGround();
clickNo();
clickReview();
clickLater();
}

function clickBackGround(){
document.getElementById("textContent").onclick = openReviewPage;
document.getElementById("icon").onclick = openReviewPage;
}
function clickNo(){
document.getElementById("noBtn").onclick = no;
}
function clickReview(){
document.getElementById("reviewBtn").onclick = review;
}
function clickLater(){
document.getElementById("laterBtn").onclick = later;
}


function openReviewPage(){
	var options = "https://chrome.google.com/webstore/detail/youtweak-for-youtube/cfgpigllcihcpkbokdnmpkjobnebflgh/reviews";
	window.open(options,'_newtab');
	window.close();
}
function no(){
   chrome.storage.sync.set({
		'reviewed' : true
	}, function() {
		// Notify that we saved.
	});
	window.close();
}
function later(){
   //sets install date to today.
	var setDays = convertDateToDays(new Date());
	
   chrome.storage.sync.set({
		'reviewed' : false,
		'reviewDateDays' : setDays
	}, function() {
		// Notify that we saved.
	});
	
	window.close();
}
function review(){
   //sets install date to today.
	var setDays = convertDateToDays(new Date());
	
   chrome.storage.sync.set({
		'reviewed' : true
	}, function() {
		// Notify that we saved.
	});
	openReviewPage();
	window.close();
}

function convertDateToDays(date){
	var temp;
	var month = date.getMonth();
	var aggregateMonths = [0, // January
                           31, // February
                           31 + 28, // March
                           31 + 28 + 31, // April
                           31 + 28 + 31 + 30, // May
                           31 + 28 + 31 + 30 + 31, // June
                           31 + 28 + 31 + 30 + 31 + 30, // July
                           31 + 28 + 31 + 30 + 31 + 30 + 31, // August
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31, // September
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
                           31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
                         ];
	return (date.getDate() + aggregateMonths[month]);
}

