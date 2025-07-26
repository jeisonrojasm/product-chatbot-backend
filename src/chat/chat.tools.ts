
import * as csv from 'csv-parser';
import * as fs from 'fs';
import OpenAI from 'openai';
import * as path from 'path';

export const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'searchProducts',
      description: 'Search for products that match the user\'s query or interests.',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The user\'s query or input related to the product they are looking for.',
          },
        },
        required: ['message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'convertCurrencies',
      description: 'Convert a specific amount of money from one currency to another.',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'number',
            description: 'The amount of money to convert.',
          },
          from: {
            type: 'string',
            description: 'The currency code of the original currency (e.g., "USD").',
          },
          to: {
            type: 'string',
            description: 'The currency code to convert to (e.g., "EUR").',
          },
        },
        required: ['amount', 'from', 'to'],
      },
    },
  },
];

export interface Product {
  displayTitle: string;
  embeddingText: string;
  url: string;
  imageUrl: string;
  productType: string;
  discount: string;
  price: string;
  variants: string;
  createDate: string;
}

export const searchProducts = async (query: string): Promise<Product[]> => {
  const products: Product[] = [];

  const filePath = path.resolve(__dirname, '..', 'assets', 'products_list.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv()) // converts each row of the CSV file into a JS object
      .on('data', (data) => products.push(data)) // each product (data) is saved in the products array
      .on('end', () => {
        const filtered = products
          .filter(product =>
            (
              `${product.displayTitle} ${product.embeddingText}`
            )
              .toLowerCase()
              .includes(query.toLowerCase())
          )
          .slice(0, 2); // return max 2 products
        resolve(filtered);
      })
      .on('error', reject);
  });
}
