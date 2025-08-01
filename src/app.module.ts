import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ProductModule } from './product/product.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes it available across the entire app
      envFilePath: '.env',
    }),
    ChatModule,
    ProductModule,
    CurrencyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
