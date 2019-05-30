const socket = io('/cafe');

var loadScripts = ["newTopic",  "openTopic", "updateDiscussions"]

var i = 0;

loadScripts.forEach(element => {
    $.getScript(`${element}.js`, function() {
        i++;
        console.log(`%cScript loaded [${i}/${loadScripts.length}]`, "color: orange;");
        socket.emit("updateDiscussions", 0)
    });    
});

socket.emit("validUser", localStorage.getItem("token"))

socket.on("validUser", (data) => {
    if(!data) window.location.href = "/"
})

document.getElementById("btn-exit").addEventListener("click", () => {
    localStorage.clear();
})