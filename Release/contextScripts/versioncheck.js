/********************************************************************/
/*                                                                  */
/*  Copyright (c) 2013 Mattie432                                    */
/*                                                                  */
/*  This code was created by Mattie432 for the extension */
/*  YouTweak. This may not be used in part or in its entirety       */
/*  without the creators permission.                                */
/*                                                                  */
/*  http://www.mattie432.com/                                       */
/*                                                                  */
/********************************************************************/


var xmlURL = "http://mattie432.com/YouTweak/message.xml";
checkReview();
requestMsg();
	chrome.runtime.sendMessage({method: "checkReview"
	}, function() {});
	
	
//Message
function requestMsg(){
	chrome.runtime.sendMessage({method: "requestXMLMsg",
		url: xmlURL
	}, function(){});
}

//Review
function checkReview(){
	chrome.storage.sync.get(['reviewed','reviewDateDays'], function(r) {
		if(r.reviewed != true && (r.reviewDateDays !== undefined )){
			//there is a valid date
			var currDaysNum = convertDateToDays(new Date());
			var daysBetween = (currDaysNum - r.reviewDateDays)
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
function askToReview(){
	chrome.runtime.sendMessage({method: "reviewNotify",
		title:'', 
		message:'', 
		decay:'-1',
		onClick: ''
	}, function() {});
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



//////////////////////////////////////////////////
//Not needed any more, kept for the time being  //
//////////////////////////////////////////////////

//requestData("http://mattie432.com/YouTweak/message.xml",message);
function message(xml1){
 chrome.storage.sync.get(['lastMessageNum'],function(r) {
		if(r.lastMessageNum != 'undefined'){
			getMessages(xml1,r.lastMessageNum);
		}else{
			getMessages(xml1,-1);
		}
	});
}
function getMessages(xml1,msgNum) {

	var xml = xml1.responseXML.childNodes[0];
	var messages = xml.childNodes;
	
	var num =-1;
	var date;
	var text;
	var show;
	
	for(var i = 0; i<messages.length;i++){
		if(messages[i].nodeName == "show"){
				//show msg
			show = messages[i].textContent;	
		}
		
		if(messages[i].nodeName == "message"){
			var msg = messages[i].childNodes;
			var tempnum;
			var tempdate;
			var temptext;
			
			for(var j = 0; j<msg.length;j++){
				if(msg[j].nodeName == "num"){
					tempnum = msg[j].textContent;
				}else if(msg[j].nodeName == "date"){
					tempdate = msg[j].textContent;
				}else if(msg[j].nodeName == "text"){
					temptext = msg[j].textContent;
				}
			}
			
			var case1 = (msgNum == undefined);
			var case2 = (tempnum > msgNum);
			var case3 = tempnum > num;
			if((case1 || case2) && case3){
				num = tempnum;
				date = tempdate;
				text = temptext;
			}
			
		}
	}
	if(show == "true" && num != -1){
		return addMessage(date,text,num);
	}
}
function addMessage(dateO,textO,numberO){
	chrome.runtime.sendMessage({method: "notify",
		title:dateO, 
		message:textO, 
		decay:'10000',
		onClick: ''
	}, message);
}
function addMessageOLD(dateO,textO,numberO){
	var body = document.getElementById("body-container");
	var newMsg = document.createElement("div");
	newMsg.className = "messageFromMatt";
	newMsg.id = "messageFromMatt";
	newMsg.setAttribute("num", numberO);
	newMsg.setAttribute("style", "display: inline-block;text-align:center;width:90%;margin:5px;background-color:#F0EAC9;");
	
	var date = document.createElement("div");
	date.className = "messageFromMattDate";
	date.setAttribute("style", "padding:5px;");

	date.value = dateO;
	date.innerText = "Message from YouTweak : " + dateO;
	newMsg.appendChild(date);
	
	var text = document.createElement("div");
	text.className = "messageFromMattText";
	text.value = textO;
	text.innerText = textO;
	newMsg.appendChild(text);
	
	var btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "Close");
	btn.setAttribute("style","display:inline;float:right;position:relative;");
    btn.onclick = removeMsg;
	newMsg.appendChild(btn);
	
	
	
	document.getElementsByTagName("body")[0].insertBefore(newMsg,body);
}
function removeMsg(){
	var e = document.getElementById("messageFromMatt");
	chrome.storage.sync.set({'lastMessageNum' : e.getAttribute("num")
		
	}, function() {
		// Notify that we saved.
	});
		e.parentNode.removeChild(e);
}
function requestData(url, callBack){
	// Create a new XMLHttpRequest object
	var xmlhttp;
	if (window.XMLHttpRequest) {
		// XMLHttpRequest is supported
		xmlhttp = new XMLHttpRequest();
	}
	else {
		// Create an ActiveX Object
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} 
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			callBack(xmlhttp);
		}
	}
	// Open the object with the filename
	xmlhttp.open("POST", url, true);
	// Send the request
	xmlhttp.send(null);
}
