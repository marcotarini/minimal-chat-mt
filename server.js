var express = require('express');
var app = express();
var path = require('path')


var http = require("http").createServer(app);

var cors = require('cors');  // Import the cors package

var io = require('socket.io')(http, {
  
  cors: {
    origin: 'https://tarini.di.unimi.it',  // Allow this origin
    methods: ['GET', 'POST'],
    credentials: true  // Allow credentials (cookies, etc.)
  }
  
});

var port = process.env.PORT || 3000;


//http.listen(3000);


console.log("****** STARTING SERVER ******")
console.log("")

//Serve Main page
app.get('/', function(req, res){ res.sendFile(__dirname + "/public/index.html");})
app.get('/index.js', function(req, res){ res.sendFile(__dirname + "/public/index.js");})
app.get('/socket.io.min.js', function(req, res){ res.sendFile(__dirname + "/public/socket.io.min.js");})
app.get('/socket.io.min.js.map', function(req, res){ res.sendFile(__dirname + "/public/socket.io.min.js.map");})

// CORS Middleware for HTTP requests
app.use(cors({
  origin: 'https://tarini.di.unimi.it',  // Allow only this origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true  // Allow credentials (cookies, etc.)
}));

//Socket.IO Stuff
io.on('connection', function(socket){
  console.log("A new client has connected!");

  var roomname = null;

  socket.on('myroomis', function(newroomname){
    roomname = newroomname;
    console.log("Client connected to room " + roomname);
    socket.join(roomname);
    socket.to(roomname).emit('message', 'hello');  // Changed to emit
  });

  socket.on('message', function(msg){
    if (roomname == null) {
      console.log("A message '" + msg + "' from NO ONE! (ignored)");  
      return;
    }
    console.log("A message '" + msg + "' from " + roomname);
    socket.to(roomname).emit('message', msg);  // Changed to emit
  });

  socket.on('disconnect', function(){
    console.log("Client disconnected");
    if (roomname) {
      this.to(roomname).emit('goodbye');
    }
  });
});

http.listen(port, function() {
  console.log("****** SERVER HAS STARTED ******")
  console.log("")
  console.log("Listening on " + port)
});

