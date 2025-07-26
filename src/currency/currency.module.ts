import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';

@Module({
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService], // Exporting the service to be used in other modules
})
export class CurrencyModule { }
