const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server)
const dotenv = require("dotenv")
const mongoose = require("mongoose")

// Express configuration
app.use(express.static('public'));
app.use(express.json())

// Dotenv
dotenv.config()

// Database
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, () => {
    console.log('\x1b[33m', "[DB] Connected")
})
// Importing routers
const Auth = require("./routes/auth")
const Login = require("./routes/login")
const Register = require("./routes/register")
const Cafe = require("./routes/cafe")


// Middlewares
app.use("/api/user", Auth)
app.use("/", Login)
app.use("/", Register)
app.use("/", Cafe)


// Socket global
io.on('connection', function (socket) {    
    console.log('\x1b[33m', "[SERVER] New connection")
});

// Individual socket
const cafeSocket = require("./socket/cafeSocket")(io)

server.listen(process.env.PORT || 5000, () => console.log('\x1b[33m', "[SERVER] Running"))