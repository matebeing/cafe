
socket.on("updateDiscussions", (data) => {
    console.log(data)
    var topicList = document.getElementById("topicList")
    var parentNode = document.getElementById("discussions");

    if (topicList) {
        topicList.parentNode.removeChild(topicList);
    }

    var node = document.createElement("div");       
    node.id =  "topicList";
    node.className =  "topicList";
    parentNode.appendChild(node)

    let topicsReverse = data;
    topicsReverse.sort(function(a,b){
        return new Date(b.lastComment) - new Date(a.lastComment);
    });

    topicsReverse.forEach(element => {
        var node = document.createElement("div");
        node.className = element.id;  
        node.id = "topicItem";

        var avatar = document.createElement("img");
        avatar.src = element.avatar;
        avatar.className = "avatarUser"
        node.appendChild(avatar)

        var info = document.createElement("table")
        var title = document.createElement("tr")
        title.innerText = element.title
        info.appendChild(title)

        var owner = document.createElement("tr")
        owner.innerHTML = `<span class="color-MATE">${element.content.length}</span>, <span class="color-BL">${element.content[element.content.length - 1].owner}</span>`;
        info.appendChild(owner)

        node.appendChild(info)

        document.getElementById("topicList").appendChild(node)

        node.addEventListener("click", () => {
            socket.emit("openTopic", node.className)
        })
    });
})
