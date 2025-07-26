import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { tools } from './chat.tools';
import { SendMessageChatDto } from './dto/send-message-chat.dto';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async postMessage(payload: SendMessageChatDto) {
    const { message } = payload;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system', // Configure the behavior of the wizard
          content: 'You are an assistant who can use features like searchProducts or convertCurrencies to assist the user.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      tools,
      tool_choice: 'auto',
      temperature: 0.2, // Controls the randomness of the response.
      top_p: 1,
    });

    return response.choices[0];
  }
}
