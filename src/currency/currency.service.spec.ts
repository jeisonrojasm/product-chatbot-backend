import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyService } from './currency.service';
import { ConfigService } from '@nestjs/config';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'OPEN_EXCHANGE_RATES_API_KEY') return 'dummy-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertCurrency', () => {
    it('should convert currency correctly', async () => {
      const payload = {
        from: 'USD',
        to: 'EUR',
        amount: 100,
      };

      // Mock fetch response
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          rates: {
            USD: 1,
            EUR: 0.85,
          },
        }),
      });

      const result = await service.convertCurrency(payload);
      expect(result).toEqual({
        from: 'USD',
        to: 'EUR',
        amount: 100,
        convertedAmount: 85,
        rate: 0.85,
      });
    });

    it('should throw an error for unsupported currencies', async () => {
      const payload = {
        from: 'USD',
        to: 'XYZ',
        amount: 100,
      };

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          rates: {
            USD: 1,
          },
        }),
      });

      await expect(service.convertCurrency(payload)).rejects.toThrow();
    });
  });
});
