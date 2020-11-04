const express = require('express');

var cron = require('node-cron');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = process.env.PORT || '3000';
server.listen(PORT);
console.log('Server is Running on Port ' + PORT);

const connections = [];

//Namespace
const nsp = io.of('/room');

//Server will automatically emit/send message every 10 sec,
//to test if the message is delivered to the Flutter App.

/*
setInterval(() => {
    var dt = new Date();
    nsp.emit('new_message', {
        date: dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
    });
}, 1000);
*/

nsp.on('connection', (socket) => {
    // console.log(socket.request._query.token);
    connections.push(socket);

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        nsp.emit('socket_connections', {
            socket: connections.length
        });
        console.log('sockets is connected', connections.length);
    });

    socket.on('send_message', (message) => {
        console.log('Message is received :', message);
        var dt = new Date();
        nsp.emit('new_message', {
            content: message.content
        });
    });
});
