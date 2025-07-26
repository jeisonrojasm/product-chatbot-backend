import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { ConversionResponse } from './interfaces/conversion-response.interface';
import { CustomException } from '../exceptions/custom.exception';
import { ERROR_DICTIONARY } from '../exceptions/custom.exception.dictionary';

@Injectable()
export class CurrencyService {
  private readonly openExchangeRatesApiKey: string;
  private readonly logger = new Logger(CurrencyService.name);

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
      this.logger.error('Error in convertCurrency:', error);
      throw new CustomException(
        ERROR_DICTIONARY.CONVERT_CURRENCY_ERROR.message,
        error.code || ERROR_DICTIONARY.CONVERT_CURRENCY_ERROR.code
      );
    }
  }
}
