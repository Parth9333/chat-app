import { Controller, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './entities';
import { UpdateChatDto } from './dto';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async findAll(): Promise<Chat[]> {
    return this.chatService.getMessages();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateChatDto,
  ): Promise<Chat | null> {
    return this.chatService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.chatService.delete(id);
  }

  @Get('history/:user1/:user2')
  async getChatHistory(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ): Promise<Chat[]> {
    return this.chatService.getChatBetweenUsers(user1, user2);
  }
}
