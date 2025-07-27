import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

/**
 * Name           : openAIProvider
 * Purpose        : Provides an instance of the OpenAI client using the API key retrieved from environment configuration.
 * Parameters     :
 *    - configService (ConfigService) : Service used to access environment variables, including the OpenAI API key.
 * Returns        : { provide: string, useFactory: Function, inject: any[] } - A provider object that can be registered in a NestJS module.
 */
export const openAIProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new OpenAI({ apiKey: configService.get<string>('OPENAI_API_KEY') });
  },
  inject: [ConfigService],
};
