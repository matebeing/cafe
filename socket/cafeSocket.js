const jwt = require('jsonwebtoken');
const User = require('../model/User')

var discussions = []
var topicId = -1;

var users = {}

module.exports = (io) => {
    const cafeSocket = io.of('/cafe');
    cafeSocket.on('connection', function(socket){
        
        socket.on("validUser", (data) => {
            if(!users[data.userId]) users[data.userId] = {lastTopic: new Date().getTime() - 1800000, lastComment: new Date().getTime() - 20000}
            const verify = jwt.verify(data.token, process.env.TOKEN_SECRET, function (err, decoded) {
               if(err == null) { return true } else { return false}
            })
            if(!verify) socket.emit("validUser", false)
            console.log(users)
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
                const user = await User.findOne({_id: data.userId});
                var countdown = (new Date().getTime() - users[data.userId].lastTopic) / 1000
                console.log(countdown)
                if(countdown >= 1800) {
                    topicId++
                    discussions.push({id: topicId, title: data.topic.title, owner: user.username, avatar: user.avatar, content: [{topicID: topicId, id: 0, content: data.topic.content[0].content, owner: user.username, avatar: user.avatar, colorName: user.colorName, date: new Date().toLocaleString("pt-BR", {timeZone: process.env.TIMEZONE})}], lastComment: data.topic.lastComment, date: data.topic.date})
                    cafeSocket.emit("updateDiscussions", discussions)
                    socket.emit("openTopic", discussions[topicId])
                    users[data.userId].lastTopic = new Date()
                } else {
                    socket.emit('alert', "You must wait 30 minutes before creating a new topic.")
                }
            } 
        })

        socket.on("openTopic", (data) => {
            console.log(data)
            socket.emit("openTopic", discussions[data])
        }) 

        socket.on("newComment", async (data) => {
            const user = await User.findOne({_id: data.owner});
            var countdown = (new Date().getTime() - users[data.owner].lastComment) / 1000
            console.log(user.username + " : " + countdown)
            if(countdown >= 20) {
                discussions[data.topicId].lastComment = new Date()
                discussions[data.topicId].content.push({topicID: data.topicId, id: discussions[data.topicId].content[discussions[data.topicId].content.length - 1].id + 1, content: data.content, owner: user.username, avatar: user.avatar, colorName: user.colorName, date: new Date().toLocaleString("pt-BR", {timeZone: process.env.TIMEZONE})})
                socket.emit("openTopic", discussions[data.topicId])
                cafeSocket.emit("updateDiscussions", discussions)
                users[data.owner].lastComment = new Date()
            } else {
                socket.emit('alert', "You must wait 20 seconds before sending a new comment.")
            }
        })

        socket.on("getContent", (data) => {
            socket.emit("quote", discussions[data.topicID].content[data.id])
        })
    });
}

