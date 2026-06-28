const seekers = []; // queue of socket objects who need help
const helpers = []; // (optional) queue of helpers if we auto-match, but we might just broadcast

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('sonar_ping', () => {
            console.log(`${socket.id} sent a sonar ping (Seeker).`);
            // Add to seekers list
            if (!seekers.find(s => s.id === socket.id)) {
                seekers.push(socket);
            }
            // Broadcast to all connected clients that a ping is active
            io.emit('active_pings', seekers.map(s => s.id));
        });

        socket.on('answer_ping', (seekerId) => {
            console.log(`${socket.id} (Helper) is answering ping from ${seekerId}`);
            const seekerIndex = seekers.findIndex(s => s.id === seekerId);
            
            if (seekerIndex !== -1) {
                const seeker = seekers[seekerIndex];
                seekers.splice(seekerIndex, 1); // Remove from queue

                // Create a private room for these two
                const roomName = `room_${seekerId}_${socket.id}`;
                socket.join(roomName);
                seeker.join(roomName);

                // Notify both that they are tethered
                io.to(roomName).emit('tethered', { room: roomName });
                
                // Update global pings
                io.emit('active_pings', seekers.map(s => s.id));
            }
        });

        socket.on('send_message', (data) => {
            const { room, text } = data;
            // Broadcast to everyone else in the room
            socket.to(room).emit('receive_message', { text, senderId: socket.id });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            // Remove from queue if they were seeking
            const index = seekers.findIndex(s => s.id === socket.id);
            if (index !== -1) {
                seekers.splice(index, 1);
                io.emit('active_pings', seekers.map(s => s.id));
            }
            // If they were in a room, notify the other person that the tether snapped
            socket.rooms.forEach(room => {
                if (room !== socket.id) {
                    socket.to(room).emit('tether_snapped');
                }
            });
        });
    });
};
