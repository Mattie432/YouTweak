/**
 * Created by Mattie432 on 01/05/2016.
 */
var KeyArray	=	[ 'collapseSubscriptionVideos', 'collapseStartOldHidden' ];

getStoredChromeSettings( KeyArray, init );

var collapseStartOldHidden = false;

function init(returnedSettings) {
    if(!undefinedVariable(returnedSettings.collapseStartOldHidden))
        collapseStartOldHidden = returnedSettings.collapseStartOldHidden;

    if(returnedSettings.collapseSubscriptionVideos) {
        var sheet = addCSS_Sheet();
        insertCSS(sheet);
        updateFeedListWithCollapseButtons();
        addListener_LoadMoreVideos(updateFeedListWithCollapseButtons, "Updating collapse buttons.");
    }
}

function updateFeedListWithCollapseButtons() {
    var subscriptionSections = find_FeedList();
    for (var i = 0; i < subscriptionSections.length; i++) {
        var idName = "YouTweak_Collapse_" + i;
        var feedsList = subscriptionSections[i];

        var alreadyDone = searchAllChildrenFor(feedsList, "YouTweakCollapsed", "true", true );
        if(undefinedVariable(alreadyDone)) {
            var feedListName = findNameOfFeedList(feedsList);
            var feedListContent = findFeedListContentDiv(feedsList);

            if(undefinedVariable(feedListContent) || undefinedVariable(feedListName))
                return;

            var defaultToHide = collapseStartOldHidden && (feedListName != "Today" && feedListName != "Yesterday" && feedListName != "This week" );
            if(defaultToHide) feedListContent.style.display = "none";

            console.log(feedListName);

            feedListContent.setAttribute("YouTweakCollapsed", true);
            addButton_ToggleCollapse(findFeedListTitleBar(feedsList), idName, feedListContent, defaultToHide);
        }
    }
}

function insertCSS(sheet) {
    //see http://www.realcombiz.com/2014/01/how-to-expand-collapse-toggle-div-layer.html

    addCSS_Rule(sheet, ".shelf-title-table .toggle-box",
        "display: none;",
        0
    );

    addCSS_Rule(sheet, ".shelf-title-table .toggle-box + label",
        "cursor: pointer;" +
        "display: inline;" +
        "font-weight: bold;" +
        "line-height: 21px;" +
        "margin-bottom: 5px;",
        0
    );

    addCSS_Rule(sheet,".shelf-title-table .toggle-box + label:before",
        "background-color: #4F5150;" +
        "-webkit-border-radius: 10px;" +
        "-moz-border-radius: 10px;" +
        "border-radius: 10px;" +
        "color: #FFFFFF;" +
        "content: '+';" +
        "display: block;" +
        "float: left;" +
        "font-weight: bold;" +
        "height: 20px;" +
        "line-height: 20px;" +
        "margin-right: 5px;" +
        "text-align: center;" +
        "width: 20px;",
        0
    );

    addCSS_Rule(sheet, ".shelf-title-table .toggle-box:checked + label:before",
        "content: '\\2212';",
        0
    );
}

function addButton_ToggleCollapse(appendTo, id, divToCollapse, startCollapsed) {
    var input = document.createElement("input");
    input.className = "toggle-box";
    input.id = id;
    input.type = "checkbox";
    //Note: this is reversed because of the way the CSS is implemented.
    input.defaultChecked = !startCollapsed;
    input.addEventListener("change", function() {
       if(divToCollapse.style.display == "none") {
           divToCollapse.style.display = "block";
       } else {
           divToCollapse.style.display = "none";
       }
    });

    var label = document.createElement("label");
    label.htmlFor = id;

    appendTo.appendChild(input);
    appendTo.appendChild(label);
}

function findNameOfFeedList(feedsList) {
    var titleBar = findFeedListTitleBar(feedsList);
    var returnValue = titleBar.innerText;
    return returnValue;
}

function findFeedListTitleBar(feedsList) {
    var returnValue = searchAllChildrenFor(feedsList, "class", "branded-page-module-title-text", true );
    return returnValue;
}

function findFeedListContentDiv(feedsList) {
    var returnValue = searchAllChildrenFor(feedsList, "class", "multirow-shelf", true );
    return returnValue;
}