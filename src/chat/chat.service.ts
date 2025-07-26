import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { tools } from './chat.tools';
import { SendMessageChatDto } from './dto/send-message-chat.dto';
import { ProductService } from 'src/product/product.service';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class ChatService {
  private sessions: Map<string, OpenAI.Chat.Completions.ChatCompletionMessageParam[]> = new Map();

  constructor(
    @Inject('OPENAI_CLIENT') private openai: OpenAI,
    private readonly productService: ProductService,
    private readonly currencyService: CurrencyService
  ) { }

  /**
   * Name           : postMessage
   * Purpose        : Sends a user message to the OpenAI model, manages the conversation context, and executes tool functions if requested by the model.
   * Parameters     :
   *    - payload (SendMessageChatDto) : An object containing the user's email and the message to send to the assistant.
   * Returns        : Promise<any> - A promise that resolves with the assistant's response, which may include tool execution results.
   */
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

    const firstResponse = await this.openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: previousMessages,
      tools,
      tool_choice: 'auto',
      temperature: 0.2, // Controls the randomness of the response.
      top_p: 1,
    });

    const toolCalls = firstResponse.choices[0].message.tool_calls;

    if (toolCalls && toolCalls.length > 0) {
      // ⚠️ IMPORTANT: This message from the model must be added to the message history to preserve context.
      // `firstResponse.choices[0].message` contains the tool_call(s) requested by the model.
      // If it's not included, the next OpenAI call won't know that it previously requested a tool,
      // and it won't be able to generate a proper continuation based on the tool's output.
      // This step is required by OpenAI's tool calling protocol: each request is stateless,
      // so the full context (including tool requests) must be passed explicitly.
      previousMessages.push(firstResponse.choices[0].message);

      for (const toolCall of toolCalls) {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);

        let result: any;

        if (name === 'searchProducts') {
          result = await this.productService.searchProducts(parsedArgs.message);
        } else if (name === 'convertCurrencies') {
          result = await this.currencyService.convertCurrency(parsedArgs);
        }

        // Add the tool's response to the history
        previousMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });

        // Second call: generate the final response
        const finalResponse = await this.openai.chat.completions.create({
          model: 'gpt-4.1-mini',
          messages: previousMessages,
          temperature: 0.2,
          top_p: 1,
        });

        previousMessages.push(finalResponse.choices[0].message);
        this.sessions.set(email, previousMessages);
        return finalResponse.choices[0];
      }
    }

    // Add the assistant's response to the history
    previousMessages.push(firstResponse.choices[0].message);

    // Save updated history
    this.sessions.set(email, previousMessages);

    return firstResponse.choices[0];
  }
}
