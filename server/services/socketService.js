export const initializeSocket = (io) => {
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);
  
      // Join a project room
      socket.on('join-project', (projectId) => {
        socket.join(projectId);
        console.log(`User ${socket.id} joined project ${projectId}`);
      });
  
      // Leave a project room
      socket.on('leave-project', (projectId) => {
        socket.leave(projectId);
        console.log(`User ${socket.id} left project ${projectId}`);
      });
  
      // Handle code changes
      socket.on('code-change', ({ projectId, code }) => {
        // Broadcast to all other clients in the same project room
        socket.to(projectId).emit('code-update', code);
      });
  
      // Handle cursor position changes
      socket.on('cursor-position', ({ projectId, position }) => {
        socket.to(projectId).emit('user-cursor', {
          userId: socket.id,
          position
        });
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  };