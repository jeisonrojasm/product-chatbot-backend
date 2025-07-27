import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ProductService } from '../product/product.service';
import { CurrencyService } from '../currency/currency.service';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const openaiMock = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { role: 'assistant', content: 'Mock response' } }],
          }),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: 'OPENAI_CLIENT',
          useValue: openaiMock,
        },
        {
          provide: ProductService,
          useValue: {
            searchProducts: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: CurrencyService,
          useValue: {
            convertCurrency: jest.fn().mockResolvedValue({}),
          },
        },
        ChatService,
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('postMessage', () => {
    it('should call chatService.postMessage with the correct payload', async () => {
      const payload = { message: 'Hello', email: 'j_esteban96@hotmail.com' };
      const chatService = controller['chatService'];
      chatService.postMessage = jest.fn();

      await controller.postMessage(payload);

      expect(chatService.postMessage).toHaveBeenCalledWith(payload);
      expect(chatService.postMessage).toHaveBeenCalledTimes(1);
    });
  });
});
