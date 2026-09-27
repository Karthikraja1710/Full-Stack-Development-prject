import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const useWebSocket = (onMessageReceived?: (data: any) => void) => {
  const { token, isAuthenticated } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const backendHost = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/^http(s)?:\/\//, '')
      : 'localhost:8000';
    
    const wsUrl = `${wsProtocol}//${backendHost}/api/ws?token=${token}`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        // Send initial ping to confirm alive
        socket.send('ping');
      };

      socket.onmessage = (event) => {
        if (event.data === 'pong') return;
        try {
          const payload = JSON.parse(event.data);
          if (onMessageReceived) {
            onMessageReceived(payload);
          }
        } catch (err) {
          // ignore non-json messages
        }
      };

      socket.onerror = (error) => {
        console.warn('WebSocket connection error:', error);
      };

      socket.onclose = () => {
        wsRef.current = null;
      };
    } catch (e) {
      console.warn('Could not establish WebSocket connection:', e);
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [token, isAuthenticated, onMessageReceived]);
};
