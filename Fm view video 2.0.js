// ==UserScript==
// @name         Fm view video 2.0
// @namespace    http://tampermonkey.net/
// @version      2024-01-23
// @description  try to take over the world!
// @author       You
// @match        https://academy.forumias.com/405/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumias.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const p = document.location.pathname.split('/');
    const pb = p[2];
    const otp = p[3];
    document.body.innerHTML = '<iframe src="https://player.vdocipher.com/v2/?otp=' + otp + '&amp;playbackInfo=' + pb + '&amp;autoplay=true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope picture-in-picture" allowfullscreen="" crossorigin="anonymous" frameborder="0" style="border: 0px; max-width: 100%; position: absolute; top: 0px; left: 0px; height: 100%; width: 100%;"></iframe>'
//            document.body.innerHTML='<iframe src="https://forumias.testpress.in/embed/'+id+'/?access_token='+token+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope picture-in-picture" allowfullscreen="" crossorigin="anonymous" frameborder="0" style="border: 0px; max-width: 100%; position: absolute; top: 0px; left: 0px; height: 100%; width: 100%;"></iframe>';
    // Your code here...
})();
