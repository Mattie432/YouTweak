var defaultURL 	= 	"http://www.youtube.com/feed/subscriptions";
var KeyArray	=	['changeIconURL', 'iconURLTxt' ];

getStoredChromeSettings( KeyArray, init );

/**
 *	Initialisation for the class.
 */
function init( returnedSettings ){

	if ( returnedSettings.changeIconURL )
	{
		if( returnedSettings.iconURLTxt == null || returnedSettings.iconURLTxt == 'undefined' )
		{
			changeIconUrl(defaultURL);
		}else{
			changeIconUrl(returnedSettings.iconURLTxt);
		}
	}

}

/**
 *	Changes the url of the YouTube icon to the one specified.
 * 	@param url : String - the url to change the YouTube logo to..
 */
function changeIconUrl(url) {
	document.getElementById("logo-container").setAttribute("href", url);

	var areas = document.getElementsByTagName("area");
	for ( var i = 0; i<areas.length; i++ )
	{
		areas[i].setAttribute("href",url);
	}
}
