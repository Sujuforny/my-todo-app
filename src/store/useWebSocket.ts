import { ReceivedMessage, Todo } from '@/interface/types';
import Logger from '@/services/logger';
import { Client, IFrame } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Manages WebSocket communication using STOMP over SockJS.
 * This class provides methods to connect, disconnect, and send messages
 * to a WebSocket server, and handles incoming messages from subscribed topics.
 */
export class WebSocketManager {
    private stompClient: Client;
    private isConnected = false;

    /**
     * Initializes a new instance of the WebSocketManager.
     * @param url The URL of the WebSocket endpoint.
     * @param onMessage A callback function to handle incoming messages from the WebSocket.
     */
    constructor(
        private url: string,
        private onMessage: (msg: ReceivedMessage) => void
    ) {
        // Configure the STOMP client.
        this.stompClient = new Client({
            // Use SockJS for WebSocket connectivity, providing fallback options for older browsers.
            webSocketFactory: () => new SockJS(this.url),
            // Reconnect every 5 seconds if the connection is lost.
            reconnectDelay: 5000,
            // Enable debug logging for the STOMP client using a custom Logger service.
            debug: (str) => Logger.instance.log(str),
        });

        /**
         * Callback function executed when the STOMP client successfully connects to the server.
         * It sets the connection status and subscribes to various public topics.
         */
        this.stompClient.onConnect = () => {
            this.isConnected = true;
            Logger.instance.log('Connected to WebSocket');

            // Subscribe to the '/public/update' topic for receiving update messages.
            this.stompClient.subscribe('/public/update', (message) => {
                const data: ReceivedMessage = {
                    data: JSON.parse(message.body),
                    type: "update"
                }
                this.onMessage(data);
            });

            // Subscribe to the '/public/delete' topic for receiving delete messages.
            this.stompClient.subscribe('/public/delete', (message) => {
                const todo:Todo = {
                    id: message.body,
                    todo: ''
                }
                const data: ReceivedMessage = {
                    data: todo,
                    type: "delete"
                }
                this.onMessage(data);
            });

            // Subscribe to the '/public/create' topic for receiving create messages.
            this.stompClient.subscribe('/public/create', (message) => {
                const data: ReceivedMessage = {
                    data: JSON.parse(message.body),
                    type: "create"
                }
                this.onMessage(data);
            });
        };

        /**
         * Callback function executed when a STOMP error occurs.
         * It logs the error message using the Logger service.
         * @param frame The IFrame object containing error details.
         */
        this.stompClient.onStompError = (frame: IFrame) => {
            Logger.instance.error('❌ STOMP Error:'+ frame.headers['message']);
        };
    }

    /**
     * Establishes a connection to the WebSocket server.
     */
    public connect() {
        this.stompClient.activate();
    }

    /**
     * Disconnects from the WebSocket server.
     */
    public disconnect() {
        this.stompClient.deactivate();
    }

    /**
     * Sends a message to a specified destination on the WebSocket server.
     * @param destination The STOMP destination to send the message to (e.g., '/app/send').
     * @param message The message body to send.
     */
    public sendMessage(destination: string, message: string) {
        if (this.isConnected) {
            this.stompClient.publish({ destination, body: message });
        } else {
            Logger.instance.warn('⚠️ Cannot send message: Not connected');
        }
    }
}