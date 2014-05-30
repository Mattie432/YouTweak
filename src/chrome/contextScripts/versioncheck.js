var xmlURL = "https://mattie432.com/YouTweak/message.xml";
checkReview();
requestMsg();
chrome.runtime.sendMessage({method: "checkReview"}, function() {});

/**
 *	Sends a request to the listener in the eventpage class.
 * 	Asks for it to check for new messages on the web.
 */
function requestMsg(){
	chrome.runtime.sendMessage({method: "requestXMLMsg",
		url: xmlURL
	}, function(){});
}

/**
 *	Checks the last time user was asked to review or if they have already
 * 	and asks again if nessesary.
 */
function checkReview(){
	chrome.storage.sync.get(['reviewed','reviewDateDays'], function(r) {
		if(r.reviewed != true && (r.reviewDateDays !== undefined )){
			//there is a valid date
			var currDaysNum = convertDateToDays(new Date());
			var daysBetween = (currDaysNum - r.reviewDateDays);
			if((daysBetween) < 0){
				//ask to review
				//askToReview();
			}else if((daysBetween) >= 7){
				//over 1 week
				//askToReview();
			}else{
				//always call, used for testing
				//askToReview();
			}
		}
	});
}

/**
 *	Sends a request to eventpage asking for a review notification
 */
function askToReview(){
	chrome.runtime.sendMessage({method: "reviewNotify",
		title:'',
		message:'',
		decay:'-1',
		onClick: ''
	}, function() {});
}

/**
 *	Converts the date given into number of days between then and the present.
 * @param {Object} date : Date - the last date
 */
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