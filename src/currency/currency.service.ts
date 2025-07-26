import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { ConversionResponse } from './interfaces/conversion-response.interface';

@Injectable()
export class CurrencyService {
  private readonly openExchangeRatesApiKey: string;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.openExchangeRatesApiKey = this.configService.get<string>('OPEN_EXCHANGE_RATES_API_KEY');
  }

  async convertCurrency(payload: ConvertCurrencyDto): Promise<ConversionResponse> {
    try {
      const { from, to, amount } = payload;

      // const url = `https://openexchangerates.org/api/convert/${amount}/${from}/${to}?app_id=${this.openExchangeRatesApiKey}`;
      const url = `https://openexchangerates.org/api/latest.json?app_id=${this.openExchangeRatesApiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      const rates = data.rates;

      if (!rates[from] || !rates[to]) {
        throw new Error(`Unsupported currency code: ${from} or ${to}`);
      }

      const rate = rates[to] / rates[from];
      const convertedAmount = amount * rate;

      return {
        from,
        to,
        amount,
        convertedAmount,
        rate
      };
    } catch (error) {
      throw new Error(`Failed to convert currency: ${error.message}`);
    }
  }
}
