// ==UserScript==
// @name         Any Course Loader
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  try to take over the world!
// @author       You
// @match        https://prodapiacademy.forumias.com/404
// @match        https://betaacademy.forumias.com/404
// @match        https://betaacademy.forumias.com/myCourses
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forumias.com
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML=''
    document.head.innerHTML=''
    const package_id = prompt('package_id')
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
        const vtok = data.video_token
        const desc = data.short_description
        const ov = data.lesson_overview
        var h = '';
        if (vid) {
            h += '<div><a target="_blank" href="https://academy.forumias.com/404/'+vid+'/'+vtok+'/">video</a></div>'
        }
        h += '<div>'+name+'</div>'
        h += '<div>'+desc+'</div>'
        h += '<div>'+ov+'</div>'
        parent.innerHTML=h
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
})();
