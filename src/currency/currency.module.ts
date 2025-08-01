import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Module({
  providers: [CurrencyService],
  exports: [CurrencyService], // Exporting the service to be used in other modules
})
export class CurrencyModule { }
