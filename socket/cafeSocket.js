var showdown  = require('showdown'),
    converter = new showdown.Converter();

const jwt = require('jsonwebtoken');
const User = require('../model/User')

var discussions = []
var topicId = -1;


module.exports = (io) => {
    const cafeSocket = io.of('/cafe');
    cafeSocket.on('connection', function(socket){
        
        socket.on("validUser", (data) => {
            const verify = jwt.verify(data, process.env.TOKEN_SECRET, function (err, decoded) {
               if(err == null) { return true } else { return false}
            })
            if(!verify) socket.emit("validUser", false)
        })

        socket.on("updateDiscussions", (data) => {
            socket.emit("updateDiscussions", discussions)
        })

        socket.on("createTopic", async (data) => {
            var isValid = true;
            if (data.topic.title.length == 0 || data.topic.title.length > 24) isValid = false; 
            if (data.topic.content[0].content.length == 0 || data.topic.content[0].content.length > 200) isValid = false; 
            const verify = jwt.verify(data.token, process.env.TOKEN_SECRET, function (err, decoded) {
                if(err == null) { return true } else { isValid = false}
            })

            if(isValid) {
                topicId++
                const user = await User.findOne({_id: data.userId});
                discussions.push({id: topicId, title: data.topic.title, owner: user.username, avatar: user.avatar, content: [{content: converter.makeHtml(data.topic.content[0].content.replace(/\n/g, "<br />")), owner: user.username, avatar: user.avatar, colorName: user.colorName}], lastComment: data.topic.lastComment, date: data.topic.date})
                cafeSocket.emit("updateDiscussions", discussions)
                socket.emit("openTopic", discussions[topicId])
            } 
        })

        socket.on("openTopic", (data) => {
            socket.emit("openTopic", discussions[data])
        }) 

        socket.on("newComment", async (data) => {
            const user = await User.findOne({_id: data.owner});
            discussions[data.topicId].lastComment = new Date()
            discussions[data.topicId].content.push({content: converter.makeHtml(data.content.replace(/\n/g, "<br />")), owner: user.username, avatar: user.avatar, colorName: user.colorName})
            socket.emit("openTopic", discussions[data.topicId])
            cafeSocket.emit("updateDiscussions", discussions)
        })
    });



}

