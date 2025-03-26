export class CreateChatDto {
  readonly participants: string[];
  readonly messages: string[];
  readonly createdAt: Date;
} 