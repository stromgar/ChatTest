var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var userCount = 0;
var userNameId = 0;
var users = []; 

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('Bruker tilkoblet');
    userCount++;
    userNameId++;
    io.emit('ChatStatus', "Number of connected users: " + userCount);

    

    socket.username = "Bruker_" + userNameId;
    users.push(socket.username);
    console.log(users);

    io.to(socket.id).emit('ChatMelding', '+ Your username is ' + socket.username);
    socket.broadcast.emit('ChatMelding', "* " +  socket.username + " joined the chat");
    //socket.emit('showRooms', rooms);
    console.log(socket.id);
    io.emit('ChatStatus', "Number of connected users: " + userCount);
    
    
    socket.on('disconnect', function(){
        console.log('Bruker frakoblet');
        userCount--;
        users.splice(users.indexOf(socket.username), 1);
        io.emit('ChatStatus', "Number of connected users: " + userCount);
        socket.broadcast.emit('ChatMelding', "* " +  socket.username + " left the chat");

    });
    socket.on('ChatMelding', function(msg){
        console.log('message: ' + msg);
        console.log(socket.username);

        io.emit('ChatMelding', socket.username + ": " + msg);
    });
});

server.listen(3000,function(){
    console.log('Server kjører på http://localhost:3000/index.html');
});