import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { openAIProvider } from './chat.providers';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [ChatController],
  providers: [
    ChatService,
    openAIProvider,
  ],
})
export class ChatModule { }
