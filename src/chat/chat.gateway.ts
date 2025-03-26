import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';


@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    private activeUsers = new Map<string, string>();
    constructor(
        @Inject(forwardRef(() => ChatService)) private chatService: ChatService,
    ) { }

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (userId) {
            client.join(userId);
            this.activeUsers.set(client.id, userId);
            console.log(`Client ${client.id} joined room: ${userId}`);
        } else {
            client.disconnect();
        }
    }


    handleDisconnect(client: Socket) {
        const userId = this.activeUsers.get(client.id);
        console.log(`Client disconnected: ${client.id} (User: ${userId})`);
        this.activeUsers.delete(client.id);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        client: Socket,
        payload: { sender: string; receiver: string; message: string },
    ): Promise<void> {
        console.log(
            `Received message from ${payload.sender} to ${payload.receiver}: ${payload.message}`,
            `Client ID: ${client.id}`
        );

        const savedMessage = await this.chatService.createMessage(
            payload.message,
            payload.sender,
            payload.receiver,
        );

        const responseMessage = {
            id: savedMessage.id,
            sender: savedMessage.sender,
            receiver: savedMessage.receiver,
            message: savedMessage.message,
            timestamp: savedMessage.createdAt,
        };
        this.server.to(payload.receiver).emit('newMessage', responseMessage);
        this.server.to(payload.sender).emit('messageSent', responseMessage);
        this.server.emit('debug', {
            event: 'messageBroadcast',
            message: responseMessage
        });
    }
}
