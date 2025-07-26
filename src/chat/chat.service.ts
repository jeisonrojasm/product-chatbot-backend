import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { tools } from './chat.tools';
import { SendMessageChatDto } from './dto/send-message-chat.dto';

@Injectable()
export class ChatService {
  private sessions: Map<string, OpenAI.Chat.Completions.ChatCompletionMessageParam[]> = new Map();

  constructor(
    private configService: ConfigService,
    @Inject('OPENAI_CLIENT') private openai: OpenAI
  ) { }

  async postMessage(payload: SendMessageChatDto) {
    const { message, email } = payload;

    const previousMessages = this.sessions.get(email) || [
      {
        role: 'system', // Configure the behavior of the wizard
        content: 'You are an assistant who can use features like searchProducts or convertCurrencies to assist the user.'
      }
    ]

    previousMessages.push({
      role: 'user',
      content: message
    })

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: previousMessages,
      tools,
      tool_choice: 'auto',
      temperature: 0.2, // Controls the randomness of the response.
      top_p: 1,
    });

    // Add the assistant's response to the history
    previousMessages.push(response.choices[0].message);

    // Save updated history
    this.sessions.set(email, previousMessages);

    return response.choices[0];
  }
}
