const express = require('express');

var cron = require('node-cron');
const app = express();
const cors = require('cors');
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 3002;
server.listen(PORT);
console.log('Server is Running on Port ' + PORT);

const connections = [];

//Namespace
const nsp = io.of('/room');

//Server will automatically emit/send message every 10 sec,
//to test if the message is delivered to the Flutter App.
cron.schedule('*/10 * * * * *', () => {
    var dt = new Date();
    nsp.emit('new_message', {
        date: dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds(),
        msg: 'Hello:) Message from server every 10 sec',
        id: 'server'
    });
});

nsp.on('connection', (socket) => {
    connections.push(socket);
    console.log('sockets is connected', connections.length);
    nsp.emit('socket_connections', {
        socket: connections.length
    });

    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        nsp.emit('socket_connections', {
            socket: connections.length
        });
        console.log('sockets is connected', connections.length);
    });

    socket.on('send message', (message) => {
        console.log('Message is received :', message);
        var dt = new Date();
        nsp.emit('new_message', {
            date: dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds(),
            msg: message.msg,
            id: message.id
        });
    });
});
