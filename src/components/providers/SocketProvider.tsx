'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '@/utils/logger';

// Socket context interface
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
}

// Socket configuration
const SOCKET_CONFIG = {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ['websocket'] as string[],
};

// Create context with default values
const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

// Custom hook for using socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      SOCKET_CONFIG
    );

    // Connection event handlers
    socketInstance.on('connect', () => {
      setIsConnected(true);
      logger.info('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      logger.info('Socket disconnected');
    });

    socketInstance.on('connect_error', (error) => {
      logger.error(`Socket connection error: ${error.message}`);
    });

    socketInstance.on('error', (error) => {
      logger.error(`Socket error: ${error.message}`);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
} 