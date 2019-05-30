// Cria tela para criar tópico.

const btn_newTopic = document.getElementById("btn-newTopic")

btn_newTopic.addEventListener("click", () => {
    element = document.getElementById("render-topicScreen");
    parentNode = document.getElementById("render");

    // Remove elemento caso exista
    if (element) element.parentNode.removeChild(element);

    // Cria a tela
    var node = document.createElement("div");       
    node.id = "render-topicScreen";
    node.className = "render-topicScreen";

    // Textarea para o título do tópico
    var topicTitle = document.createElement("input"); 
    topicTitle.id = "input-topicTitle";
    topicTitle.className = "input-topicTitle";
    topicTitle.placeholder = "Title";
    topicTitle.maxLength = 24;
    node.appendChild(topicTitle);

    // Textarea para o conteúdo do tópico
    var topicContent = document.createElement("textarea"); 
    topicContent.id = "input-topicContent";
    topicContent.className = "input-topicContent";
    topicContent.placeholder = "Message";
    node.appendChild(topicContent);

    // Botão para enviar o tópico
    var button = document.createElement("div"); 
    button.innerHTML = "Send";
    button.id = "btn-sendTopic1";
    button.className = "btn-newElement";
    node.appendChild(button)

    parentNode.appendChild(node)

    document.getElementById("btn-sendTopic1").addEventListener("click", () => {
        createTopic({id: 0, title: document.getElementById("input-topicTitle").value, content: [{content: document.getElementById("input-topicContent").value}], lastComment: new Date(), date: new Date()})
    })

    // Textarea autosize
    autosize(document.getElementById("input-topicContent"))
})

function createTopic(data) {
    var isValid = true;
    if (data.title.length == 0 || data.title.length > 24) isValid = false; 
    if (data.content[0].content.length == 0 || data.content[0].content.length > 200) isValid = false; 
    
    if(isValid) {
        socket.emit("createTopic", {topic: data, userId: localStorage.getItem("userId"), token: localStorage.getItem("token")});
    }
}