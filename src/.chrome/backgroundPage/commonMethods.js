/**
 *	This searches all children of an element recursively for a value of an attribute. At first call
 * 	set topLevel to true.
 */
var returnValue;
function searchAllChildrenFor(root, attributeName, attributeValue, topLevel) {
	if (topLevel == true) {
		returnValue = null;
	}

	if (root.children != null && returnValue == null) {
		for (var i = 0; i < root.children.length; i++) {
			var t = root.children[i].getAttribute(attributeName);
			if (t != null) {
				var c = 1;
			}

			if (root.children[i].getAttribute(attributeName) == null) {
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			} else if (root.children[i].getAttribute(attributeName).indexOf(attributeValue) != -1) {
				returnValue = root.children[i];
				return root.children[i];
			} else {
				searchAllChildrenFor(root.children[i], attributeName, attributeValue, false);
			}
		}
	}

	//If nothing found then return null
	return returnValue;
}

/**
 *	Searches the array of elements for those with the classname parameter.
 * @param {Object} array : Element - dom elements
 * @param {Object} className : String - the classname to search for
 */
function getElemByClassFromArray(array, className) {
	try {
		var temp = new Array();
		if (array != null) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].className.indexOf(className) != -1) {
					temp.push(array[i]);
				}
			}
		}

	} catch (e) {

	}
	return temp;
}

/**
 * Returns all the elements with the tag and className in the current document.
 */
function searchForTagAndClass(tagName, className) {
	var returnValues = new Array();
	var tagCollection = document.getElementsByTagName(tagName);
	for (var i = 0; i < tagCollection.length; i++) {
		if (tagCollection[i].className.indexOf(className) != -1) {
			returnValues.push(tagCollection[i]);
		}
	}
	return returnValues;
}


