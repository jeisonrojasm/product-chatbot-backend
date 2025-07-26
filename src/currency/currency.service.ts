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

  /**
   * Name           : convertCurrency
   * Purpose        : Converts a specified amount from one currency to another using exchange rates from the OpenExchangeRates API.
   * Parameters     :
   *    - payload (ConvertCurrencyDto) : An object containing the source currency (`from`), target currency (`to`), and amount to convert.
   * Returns        : Promise<ConversionResponse> - A promise that resolves with the converted amount, exchange rate, and related details.
   */
  async convertCurrency(payload: ConvertCurrencyDto): Promise<ConversionResponse> {
    try {
      const { from, to, amount } = payload;

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
