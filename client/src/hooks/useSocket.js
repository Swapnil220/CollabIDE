import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (projectId) => {
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection with credentials enabled
    socketRef.current = io(import.meta.env.VITE_SERVER_URL, {
      withCredentials: true,  // This ensures cookies or authentication tokens are included in the request
    });

    // Join project room if projectId exists
    if (projectId) {
      socketRef.current.emit('join-project', projectId);
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  return socketRef.current;
};
