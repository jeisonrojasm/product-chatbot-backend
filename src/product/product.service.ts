import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  /**
   * Name           : readProductsFromCSV
   * Purpose        : Reads and parses a CSV file to extract product data and return it as an array of Product objects.
   * Parameters     :
   *    - filePath (string) : The path to the CSV file containing the product data.
   * Returns        : Promise<Product[]> - A promise that resolves with an array of Product objects parsed from the CSV file.
   */
  private async readProductsFromCSV(filePath: string): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      const results: Product[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: Product) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (err) => {
          this.logger.error('Error parsing CSV file', err);
          reject(err);
        });
    });
  }

  /**
   * Name           : searchProducts
   * Purpose        : Searches for products that match a given query by reading and filtering a CSV file containing product data.
   * Parameters     :
   *    - query (string) : The search term used to match against product titles and descriptions.
   * Returns        : Promise<Product[]> - A promise that resolves with a list of matching Product objects (up to a maximum of 2 results).
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const MAX_RESULTS = 2; // Maximum number of results to return
      if (!query?.trim()) return [];

      const filePath = path.resolve(__dirname, '..', 'assets', 'products_list.csv');

      // fs.promises.access() check if the CSV file exists before trying to read it.
      // This prevents runtime errors when attempting to read a missing file.
      // fs.constants.F_OK is used to test for the existence of the file only.
      // If the file does not exist, an error will be thrown and caught by the try-catch block below.
      await fs.promises.access(filePath, fs.constants.F_OK);

      const products = await this.readProductsFromCSV(filePath);

      const filtered = products
        .filter(product =>
          `${product.displayTitle} ${product.embeddingText}`
            .toLowerCase()
            .includes(query.toLowerCase())
        )
        .slice(0, MAX_RESULTS);

      return filtered;
    } catch (error) {
      this.logger.error('Failed to search products', error);
      throw new InternalServerErrorException('Could not search products');
    }
  }
}
