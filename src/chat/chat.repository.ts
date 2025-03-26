import { EntityRepository, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto, UpdateChatDto } from './dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatRepository {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) { }
    async create(payload: Partial<Chat>): Promise<Chat> {
        const chat = this.chatRepository.create({
            ...payload,
            createdAt: new Date(),
        });
        return this.chatRepository.save(chat);
    }

    async findOneById(id: string): Promise<Chat | null> {
        return this.chatRepository.findOne({ where: { id } });
    }

    async update(id: string, chat: Partial<Chat>) {
        await this.chatRepository.update(id, chat);
    }

    async delete(id: string) {
        return this.chatRepository.delete(id);
    }

    async find(): Promise<Chat[]> {
        return this.chatRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findBetweenUsers(user1: string, user2: string): Promise<Chat[]> {
        return this.chatRepository.find({
            where: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 },
            ],
            order: { createdAt: 'ASC' },
        });
    }
} 