import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { openAIProvider } from './chat.providers';
import { ProductModule } from 'src/product/product.module';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [
    ProductModule,
    CurrencyModule
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    openAIProvider,
  ],
})
export class ChatModule { }
