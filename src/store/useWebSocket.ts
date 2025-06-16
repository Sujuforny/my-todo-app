import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export class WebSocketManager {
  private stompClient: Client;
  private isConnected = false;

  constructor(
    private url: string,
    private onMessage: (msg: string) => void
  ) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.url),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP DEBUG]', str),
    });

    this.stompClient.onConnect = () => {
      this.isConnected = true;
      console.log('✅ Connected to WebSocket');
      this.stompClient.subscribe('/update/public', (message) => {
        console.log("hehhe");
        this.onMessage(message.body);
      });
    };

    this.stompClient.onStompError = (frame: IFrame) => {
      console.error('❌ STOMP Error:', frame.headers['message']);
    };
  }

  public connect() {
    this.stompClient.activate();
  }

  public disconnect() {
    this.stompClient.deactivate();
  }

  public sendMessage(destination: string, message: string) {
    if (this.isConnected) {
      this.stompClient.publish({ destination, body: message });
    } else {
      console.warn('⚠️ Cannot send message: Not connected');
    }
  }
}
