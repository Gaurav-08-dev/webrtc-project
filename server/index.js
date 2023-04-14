const { Server } = require("socket.io");
const io = new Server(8000, {
    cors: true
})

const emailToSocketIdMap= new Map();
const socketIdToEmailMap= new Map();


io.on('connection', (socket) => {
    console.log('Socket Connected', socket.id)
    socket.on('room:join', data => {

        const {email,room}=data;

        emailToSocketIdMap.set(email,socket.id)
        socketIdToEmailMap.set(socket.id,email)

        io.to(room).emit('user:joined', {email,id:socket.id})
        socket.join(room)
        io.to(socket.id).emit('room:join', data) // return data back to client
    })

    socket.on('user:call', ({to,offer})=>{
        io.to(to).emit('incoming:call', {from: socket.id,offer})
    })

    socket.on('call:accepted',({to, answer})=>{
        io.to(to).emit('call:accepted', {from: socket.id,answer})
    })

});