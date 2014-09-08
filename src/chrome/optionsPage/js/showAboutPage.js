/**
 *	Used to transition the page first into a white page and then
 * 	transition to the next page.
 * 
 * @param page : string - the page address to goto. 
 */
function showAboutPage(page) {
	document.body.setAttribute("class","pt-page-moveToRightFade");
	
	$('body').animate({backgroundColor: '#FFFFFF'}, 1000);
	
	setTimeout(function(){document.location.href = page;}, 1000);
}