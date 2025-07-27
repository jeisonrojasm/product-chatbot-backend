import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import * as fs from 'fs';
import * as path from 'path';
import { CustomException } from '../exceptions/custom.exception';

describe('ProductService', () => {
  let service: ProductService;

  const tempCsvPath = path.resolve(__dirname, 'temp_products.csv');
  const csvContent = `displayTitle,embeddingText\nProduct 1,This is product 1\nProduct 2,This is product 2`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readProductsFromCSV', () => {
    beforeAll(() => {
      fs.writeFileSync(tempCsvPath, csvContent);
    });

    afterAll(() => {
      fs.unlinkSync(tempCsvPath);
    });

    it('should read and parse CSV file correctly', async () => {
      // @ts-ignore - ignore TS error for accessing protected method
      const result = await service.readProductsFromCSV(tempCsvPath);

      expect(result).toEqual([
        {
          displayTitle: 'Product 1',
          embeddingText: 'This is product 1',
        },
        {
          displayTitle: 'Product 2',
          embeddingText: 'This is product 2',
        },
      ]);
    });
  });

  describe('searchProducts', () => {
    beforeEach(() => {
      service = new ProductService();
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    const mockProducts = [
      { displayTitle: 'iPhone 13', embeddingText: 'Apple smartphone' },
      { displayTitle: 'Galaxy S22', embeddingText: 'Samsung flagship phone' },
      { displayTitle: 'Pixel 6', embeddingText: 'Google smartphone' },
    ];

    it('should return empty array when query is empty', async () => {
      const result = await service.searchProducts('');
      expect(result).toEqual([]);
    });


    it('should return matching products from CSV', async () => {
      jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined);
      jest.spyOn<any, any>(service as any, 'readProductsFromCSV').mockResolvedValue(mockProducts);

      const result = await service.searchProducts('iphone');
      expect(result).toHaveLength(1);
      expect(result[0].displayTitle).toBe('iPhone 13');
    });

    it('should return maximum 2 results', async () => {
      jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined);
      jest.spyOn<any, any>(service as any, 'readProductsFromCSV').mockResolvedValue([
        ...mockProducts,
        { displayTitle: 'iPhone 14', embeddingText: 'Latest iPhone' },
      ]);

      const result = await service.searchProducts('phone');
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should throw exception if CSV file does not exist', async () => {
      jest.spyOn(fs.promises, 'access').mockRejectedValue({ code: 'ENOENT' });

      await expect(service.searchProducts('apple')).rejects.toThrow(CustomException);
    });

    it('should throw exception if reading CSV fails', async () => {
      jest.spyOn(fs.promises, 'access').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'readProductsFromCSV').mockRejectedValue(new Error('read error'));

      await expect(service.searchProducts('apple')).rejects.toThrow(CustomException);
    });
  });
});
