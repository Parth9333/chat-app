import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { ChatRepository } from './chat.repository';
import { UpdateChatDto } from './dto';


@Injectable()
export class ChatService {
    constructor(
        private chatRepository: ChatRepository,
    ) { }

    async createMessage(
        message: string,
        sender: string,
        receiver: string,
    ): Promise<Chat> {
        return this.chatRepository.create({ message, sender, receiver });
    }

    async getMessages(): Promise<Chat[]> {
        return await this.chatRepository.find();
    }

    async update(
        id: string,
        message: UpdateChatDto,
    ): Promise<Chat | null> {
        await this.chatRepository.update(id, {message: message.message});
        return this.chatRepository.findOneById(id);
    }


    async delete(id: string): Promise<void> {
        const chat = await this.chatRepository.findOneById(id);
        if (!chat) {
            throw new NotFoundException(`Chat with ID ${id} not found`);
        }
        await this.chatRepository.delete(id);
    }

    async getChatBetweenUsers(user1: string, user2: string): Promise<Chat[]> {
        return this.chatRepository.findBetweenUsers(user1, user2);
    }
}
