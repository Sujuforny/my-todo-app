import { useEffect, useState, useRef, useCallback } from 'react';
import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Logger from '@/services/logger';

export interface WebSocketMessage {
  type: 'public' | 'private' | 'user-specific';
  content: string;
  sender?: string;
}

type WebSocketCallback = (client: Client) => void;
type ErrorCallback = (frame: IFrame) => void;
type DisconnectCallback = (frame: IFrame) => void;

const useWebSocket = (
  wsUrl: string,
  onConnectCallback?: WebSocketCallback,
  onDisconnectCallback?: DisconnectCallback,
  onErrorCallback?: ErrorCallback
) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const stompClientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      Logger.instance.log('STOMP client already connected.');
      return;
    }

    const client = new Client({
      // Note: brokerURL expects 'ws://' or 'wss://' for native WebSockets.
      // For SockJS, we use webSocketFactory and provide the HTTP URL.
      // The SockJS library will handle the appropriate transport.
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str: string) => {
        Logger.instance.log('STOMP Debug:'+ str);
      },
    });

    client.onConnect = (frame: IFrame) => {
      Logger.instance.log('Connected to WebSocket:'+ frame);
      setIsConnected(true);
      setError(null);
      if (onConnectCallback) {
        onConnectCallback(client);
      }
    };

    client.onStompError = (frame: IFrame) => {
      Logger.instance.error('STOMP Error:'+ frame);
      setIsConnected(false);
      setError(new Error(frame.headers.message || 'Unknown STOMP error'));
      if (onErrorCallback) {
        onErrorCallback(frame);
      }
    };

    client.onDisconnect = (frame: IFrame) => {
      Logger.instance.log('Disconnected from WebSocket:'+ frame);
      setIsConnected(false);
      if (onDisconnectCallback) {
        onDisconnectCallback(frame);
      }
    };

    client.activate();
    stompClientRef.current = client;
  }, [wsUrl, onConnectCallback, onDisconnectCallback, onErrorCallback]);

  const disconnect = useCallback(() => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.deactivate();
      Logger.instance.log('WebSocket disconnected.');
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { stompClient: stompClientRef.current, isConnected, error, connect, disconnect };
};

export default useWebSocket;