import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { openAIProvider } from './chat.providers';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    openAIProvider,
  ],
})
export class ChatModule { }
