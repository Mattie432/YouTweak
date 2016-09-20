# YouTweak

## Overview
This extension aims to fix some fundamental problems that I have with youtube (you can see all of the additons listed below). It is currently available as a Chrome Extension and there are plans to expand to FireFox as well.

![Image](https://raw.githubusercontent.com/Mattie432/YouTweak/master/images/screenshot1.png?token=3811007__eyJzY29wZSI6IlJhd0Jsb2I6TWF0dGllNDMyL1lvdVR3ZWFrL21hc3Rlci9pbWFnZXMvc2NyZWVuc2hvdDEucG5nIiwiZXhwaXJlcyI6MTM5NjczODEzNH0%3D--09f9c6759aab0fde62362e5ccc9cc0f713d501ca)

## Features

* #### Remove Subscription Videos
This feature makes it easier to delete unwanted videos from your YouTube homepage. The current YouTube layout seems to discourage the use of the 'Hide video' option previous layouts featured prominently. This feature intends to fix this, giving the user a per-video dedicated button for the removal of the video. This button instigates YouTube's own hide video feature which means that hiding it with this app also hides it if you were to sign in from a different computer without the app. (Please read the [notes](#notes) section when using this feature).

* #### Remove Watched Videos
This feature makes your homepage much cleaner by removing any subscription videos that you have already watched. When activated you will notice a new button added to the left navigation column of the homepage. When clicked any videos in your current subscriptions are removed. (Please read the [notes](#notes) section when using this feature).

 **Please note:** you need to have "Watch History" unpaused for this feature to work as it uses YouTube's data to see if a video has been watched or not. This can be enabled in your [History](https://www.youtube.com/feed/history) tab.

* #### YouTube Subscriptions as Default Page
Automatically redirects you to Uploads only of your subscriptions. This changes the URL that the icon at the top left of every YouTube page links to. The default link is to "youtube.com" which shows all of your subscriptions and recommended videos mixed together. By default the app redirects to "youtube.com/feed/subscriptions" which only shows your subscriptions videos (but this can be set manually to any URL).

* #### Remove all subscription videos
This adds a button to the homepage which when clicked will cycle through all of your subscriptions and remove them, leaving you with a clean homepage ready for new subscriptions to be easily visible. (Example for use could be after returning from holiday and clearing the weeks of subscription buildup, or when a channel uploads many videos that clog-up your subscription feed)

* #### Load all subscription videos
This adds a button to the homepage which when clicked loads all of the pages of your subscriptions into view, allowing you to browse them all without having to reload the page. This can make it easier when removing videos you do not want to watch.

* #### Collapsible Subscription Groups
This allows you to collapse the 'Today', 'Yesterday', etc subscription groups which are present on the grid subscription view. A collapse button will be added to the left of the group name which will toggle the visible state of the groups videos. You can also elect to have videos older than 'This Week' automatically collapsed when the page loads.

* #### ~~Remove "Recommended Channels"~~ (Feature removed Apr 2016)
This removes the "Recommended Channels" box from the homepage increasing the amount of screen space used for your subscriptions by a substantial amount. This works on not only the "Uploads" feed but also the "All activity" feed making it easier to view your content.

* #### ~~Auto like videos~~ (Feature removed Apr 2016)
This feature allows you to enter the names of channels you wish to automatically like upon watching their video

## Updates
Due to the constant changes implemented by YouTube it will be necessary to update this extension to reflect these changes. Rest assured that I am highly motivated to keep this app up to date as I am myself a fellow user.

The code for this extension is open source and will be commited to this GutHub repo whenever there is an update or a significant change has been made.

## Notes
Please understand that this extension relies on YouTube's ability to hide videos from their homepage. If for some reason the site has a problem with this feature then this extension may not function properly. If this is the case then we both have to wait for YouTube to fix their problem. The functionality of **Remove Subscription Videos** & **Remove Watched Videos** is currently compromised by an ongoing (\*read intentional\*) issue with YouTube which has been present for many since 2014. Please see [this issue](https://github.com/Mattie432/YouTweak/issues/31) for more details. While the button to remove videos will still be present, videos older than a week may 'pop back' on page refresh. I suggest using the *Collapsible Subscription Groups* feature to automatically collapse videos which cant be hidden.

## Links
[Download from Chrome Webstore](https://chrome.google.com/webstore/detail/youtweak-for-youtube-remo/cfgpigllcihcpkbokdnmpkjobnebflgh)

[Personal website](https://mattie432.com)
(Contact information can be found here)
