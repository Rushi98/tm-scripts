// ==UserScript==
// @name         Any Course Loader 2.0
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  try to take over the world!
// @author       You
// @match        https://prodapiacademy.forumias.com/404
// @match        https://betaacademy.forumias.com/404
// @match        https://betaacademy.forumias.com/myCourses
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumias.com
// @grant        none
// ==/UserScript==

window.addEventListener('load', function() {
    // your code here

(function() {
    'use strict';
    const package_id = prompt('package_id')
    if (package_id) {
    document.body.innerHTML=''
    document.head.innerHTML=''

        var bearer_token = null
//    const bearer_token = prompt('bearer_token')
    function load_lesson_material(data, parent) {
        // data : []
        var h = '';
        data.filter(d => d.study_material)
        .forEach(d => d.study_material.forEach(sm => {
                 h += '<p>'+sm.header_name+'</p>'
                 h += sm.material_data.map(d => '<p><a target="_blank" href="'+d.resource_url+'" >'+d.title+'</a></p>').join('')
        }))
       parent.innerHTML = h
    }
    function load_lesson_video(data, parent) {
        const name = data.name
        const vid = data.video_id
        const vdoid = data.vdocipher_video_id
        const tpstream_aid = data.tpstreams_asset_id
        const vtok = data.video_token
        const desc = data.short_description
        const ov = data.lesson_overview
        var h = '';
        if (vid) {
            h += '<div><a target="_blank" href="https://academy.forumias.com/404/'+vid+'/'+vtok+'/">video</a></div>'
        }
        if (vdoid) {
            h += '<div><button id="' + vdoid + '">click</button></div>';
        }
        if (tpstream_aid) {
            h += '<div><button id="' + tpstream_aid + '">click</button></div>';
        }
        h += '<div>'+name+'</div>'
        h += '<div>'+desc+'</div>'
        h += '<div>'+ov+'</div>'
        parent.innerHTML=h
        if (vdoid) {
            const btn = document.getElementById(vdoid);
            btn.addEventListener('click', (e) => {
                fetch("https://prodapiacademy.forumias.com/v0/user-course/vdocipher/", {"headers": {"authorization": "Bearer " + bearer_token, "content-type": "application/json"}, "body": "{\"video_id\":\""+vdoid+"\"}", "method": "POST"
            }).then(response => response.json()).then(o => {
                    const otp = o.data.otp
                    const pb = o.data.playbackInfo
                    const link = document.createElement('a')
                    link.innerText = "video"

                    link.target = "_blank"
                    link.href = "https://academy.forumias.com/405/" + pb + "/" + otp
                    e.srcElement.parentElement.replaceChild(link, btn)
                    e.srcElement.parentElement.append(link, btn)
            });
            })
        }
        if (tpstream_aid) {
            const btn = document.getElementById(tpstream_aid);
            btn.addEventListener('click', (e) => {
                fetch("https://prodapiacademy.forumias.com/v0/user-course/testpress-access-token/", {"headers": {"authorization": "Bearer " + bearer_token, "content-type": "application/json"}, "body": "{\"video_id\":\""+ tpstream_aid +"\"}", "method": "POST"
                }).then(response => response.json()).then(o => {
                    const pb = o.data.playback_url
                    const link = document.createElement('a')
                                        link.innerText = "video"

                    link.target = "_blank"
                    link.href = "https://academy.forumias.com/406/" + window.btoa(pb) + "/"
                    e.srcElement.parentElement.replaceChild(link, btn)
                    e.srcElement.parentElement.append(link, btn)
                });
            });
        }
    }
    function load_lesson(id, parent) {
        parent.innerHTML='<div style="border:1px solid black"></div><div style="border:1px solid black"></div>'
        fetch("https://prodapiacademy.forumias.com/v0/course/lesson-material/" + id + "/", {"headers": {"authorization": "Bearer " + bearer_token}}).then(response => response.json()).then(tree => load_lesson_material(tree.data.new_data, parent.children.item(0)));
        fetch("https://prodapiacademy.forumias.com/v0/course/lesson/" + id + "/", {"headers": {"authorization": "Bearer " + bearer_token}}).then(response => response.json()).then(tree => load_lesson_video(tree.data, parent.children.item(1)));
    }
    function load_tree(tree, parent) {
        const name = tree.name;
        tree.package_unit.forEach(u => {
            const p = document.createElement('div')
            parent.appendChild(p)
            const unit_id = u.id
            const unit_title = u.title
            p.innerHTML='<h1>'+unit_title+'</h1><div></div>'
            u.unit_lesson.sort((a, b) => a.created_at < b.created_at)
            u.unit_lesson.forEach(l => {
                const lesson_id = l.id
                const lesson_name = l.name
                const lesson_created = l.created_at
                const h = document.createElement('div')
                parent.appendChild(h);
                h.innerHTML="<h4>"+lesson_name+'</h4><div></div>'
                h.children.item(0).addEventListener('click', e => load_lesson(lesson_id, h.children.item(1)));
            })
        });
    }
    function init(bt) {
        bearer_token = bt
        fetch("https://prodapiacademy.forumias.com/v0/course/package-tree/" + package_id + "/", {"headers": {"authorization": "Bearer " + bearer_token}}).then(response => response.json()).then(tree => load_tree(tree.data, document.body));
    }

    fetch("https://betaacademy.forumias.com/api/auth/session")
        .then(r => r.json())
        .then(j => init(j.user.token.access));
}
})();

}, false);
