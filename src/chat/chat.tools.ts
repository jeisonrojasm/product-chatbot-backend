import OpenAI from 'openai';

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