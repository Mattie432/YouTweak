 /* Initialisation function. This runs after the document has loaded.
 */
window.onload = init;
function init(){
	skypeInitialize();
	adjustAge();
}


/**
 * Starts the skype "message" buttons API link.
 */
function skypeInitialize(){
	
	Skype.ui({
      "name": "chat",
      "element": "SkypeButton_Call_mattie432_1",
      "participants": ["mattie432"],
      "imageSize": 32
    });
	
}

/**
 * Clicks the skype icon to start the im session.
 */
function skypeCallMe(){
	var p = document.getElementById("SkypeButton_Call_mattie432_1_paraElement");
	p.firstChild.click();
}

/**
 * Calculates my current age and replaces ocurences of this in the webpage.
 */
function adjustAge(){
	//DOB in format 'YYYY MM DD'
	var dob='19931117';
	var year=Number(dob.substr(0,4));
	var month=Number(dob.substr(4,2))-1;
	var day=Number(dob.substr(6,2));
	var today=new Date();
	var age=today.getFullYear()-year;
	if(today.getMonth()<month || (today.getMonth()==month && today.getDate()<day)){
		age--;
	}
	document.getElementById("myAge").innerText = age;
}