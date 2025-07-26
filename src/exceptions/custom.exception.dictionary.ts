export const ERROR_DICTIONARY: Record<string, { code: number; message: string }> = {
  POST_MESSAGE_ERROR: {
    code: 500,
    message: 'An error occurred while processing the post message request.'
  },
  CONVERT_CURRENCY_ERROR: {
    code: 501,
    message: 'An error occurred while converting the currency.'
  },
  SEARCH_PRODUCTS_ERROR: {
    code: 502,
    message: 'An error occurred while searching for products.'
  },
};