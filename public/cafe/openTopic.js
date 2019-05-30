socket.on("openTopic", (data) => {
    element = document.getElementById("render-topicScreen");
    parentNode = document.getElementById("render");

    if (element) element.parentNode.removeChild(element);

    var node = document.createElement("div");       
    node.id = "render-topicScreen";
    node.className = "render-topicScreen";
    parentNode.appendChild(node);

    var topic = document.createElement("div");
    topic.id = "topic"
    
    data.content.forEach(element => {
        var comment = document.createElement("div");
        comment.id = "topicComment";

        var avatar = document.createElement("img");
        avatar.src = element.avatar;
        avatar.className = "avatarUser"
        comment.appendChild(avatar)

        var info = document.createElement("table")
        var userName = document.createElement("tr")
        userName.innerHTML = `<span style="color: ${element.colorName}">${element.owner}</span>`
        info.appendChild(userName)

        var content = document.createElement("tr")
        content.innerHTML = element.content
        info.appendChild(content)

        comment.appendChild(info)

        topic.appendChild(comment)
    });
    
    var topicContent = document.createElement("textarea"); 
    topicContent.id = "input-topicComment2";
    topicContent.className = "input-topicContent";
    topicContent.placeholder = "Message";
    topic.appendChild(topicContent);

    var btn_sendComment = document.createElement("div")
    btn_sendComment.className = "btn-newElement";
    btn_sendComment.id = "btn-newElement2";
    btn_sendComment.innerText = "Send";
    topic.appendChild(btn_sendComment);

    document.getElementById("render-topicScreen").appendChild(topic)

    autosize(document.getElementById("input-topicComment2"))

    document.getElementById("btn-newElement2").addEventListener("click", () => {
        socket.emit("newComment", {topicId: data.id, content: document.getElementById("input-topicComment2").value, owner: localStorage.getItem("userId")})
    })

    $('#topic').scrollTop($('#topic')[0].scrollHeight);

    document.getElementById("input-topicComment2").addEventListener('autosize:resized', function(){
        $('#topic').scrollTop($('#topic')[0].scrollHeight)
        console.log("mudou")
    });
})