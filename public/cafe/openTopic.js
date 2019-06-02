function markdownToHTML(md)
{
    return md
        .replace(/\*\*(.+?)\*\*/g, "<b style='font-weight: 800'>$1</b>") // **Bold**
        .replace(/__(.+?)__/g, "<u>$1</u>") // __Underline__
        .replace(/\*(.+?)\*/g, "<i>$1</i>") // *Italic*
        .replace(/_(.+?)_/g, "<i>$1</i>") // _Italic_
        .replace(/(^|\n)> ?(.*)/g, "$1<span style='margin-left: 20px; font-size: 9px; color: #5f779D'>$2</span>") // > Quote
        .replace(/!\[(.+?)\]\((.+?)\)/g, "<img src=\"$1\" title=\"$2\"/>") // ![Image description](URL)
        .replace(/  +/g, ' ') // Removes unnecessary spaces ('          '=' ')
        .replace(/\n +/g, '\n') // ^
        .replace(/^ +| +$/g, '') // ^
        .replace(/\n/g, "<br />"); // Break line to <br>
}

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
        console.log(element)
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
        content.innerHTML = markdownToHTML(element.content)
        info.appendChild(content)

        comment.appendChild(info)

        topic.appendChild(comment)

        avatar.addEventListener("click", (event) => {
          if (document.getElementById('popup')) document.getElementById('popup').parentNode.removeChild(document.getElementById('popup'));
            // console.log({topicId: data.id, id: element.id})
            var popup = document.createElement("div")
            popup.className = "popup";
            popup.id = "popup";
            popup.innerHTML = `
                    <button onclick="quote({topicID: ${element.topicID}, id: ${element.id}})" class="color-N" style="width: 100%; background-color: #22464d; font-size: 10px">Quote</button>
                            `
            popup.style.top = event.clientY + 'px';
            popup.style.left = event.clientX + 'px';
            comment.appendChild(popup)
        })
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

function quote(data) {
    document.getElementById('popup').parentNode.removeChild(document.getElementById('popup'))
    socket.emit("getContent", data)
}

socket.on("quote", data => {

    document.getElementById('input-topicComment2').value = `>@${data.owner}\n` + data.content.replace(/(^|\n)(.*)/g, "$1> $2")
})

document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (target.id == "topicComment" || target.id == "input-topicComment2" || target.id == "btn-newElement2") {
        if (document.getElementById('popup')) document.getElementById('popup').parentNode.removeChild(document.getElementById('popup'))
    }
}, false);
