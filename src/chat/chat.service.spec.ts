import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let openaiMock: any;

  beforeEach(async () => {
    openaiMock = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { role: 'assistant', content: 'Hi there!' } }],
          }),
        },
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
        {
          provide: 'OPENAI_CLIENT',
          useValue: openaiMock,
        }
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postMessage', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get message and email from payload', async () => {
      const payload = { message: 'Hello', email: 'j_esteban96@hotmail.com' };

      const spy = jest.spyOn(service, 'postMessage');
      await service.postMessage(payload);

      expect(spy).toHaveBeenCalledWith(payload);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(openaiMock.chat.completions.create).toHaveBeenCalled();
    });

    it('should return assistant response', async () => {
      const payload = { message: 'Hello', email: 'j_esteban96@hotmail.com' };

      const response = await service.postMessage(payload);
      expect(response).toBeDefined();
      expect(response).toHaveProperty('message');
      expect(response.message).toHaveProperty('role', 'assistant');
      expect(response).toEqual({ message: { role: 'assistant', content: 'Hi there!' } });
    });

    it('should store user and assistant messages in session', async () => {
      const payload = { message: 'Hello', email: 'j_esteban96@hotmail.com' };

      await service.postMessage(payload);

      const session = service['sessions'].get(payload.email);
      expect(session).toBeDefined();
      expect(session).toHaveLength(3);
      expect(session[0]).toEqual({ role: 'system', content: 'You are an assistant who can use features like searchProducts or convertCurrencies to assist the user.' });
      expect(session[1]).toEqual({ role: 'user', content: payload.message });
      expect(session[2]).toEqual({ role: 'assistant', content: 'Hi there!' });
      expect(service['sessions'].size).toBe(1);
      expect(openaiMock.chat.completions.create).toHaveBeenCalled();
    });

    it('should reuse existing session for the same email', async () => {
      const payload = { message: 'Hello again', email: 'j_esteban96@hotmail.com' };

      await service.postMessage({ message: 'Hello', email: payload.email });
      const initialSession = service['sessions'].get(payload.email);

      await service.postMessage(payload);
      const updatedSession = service['sessions'].get(payload.email);

      expect(updatedSession).toBe(initialSession); // tests pass because initialSession and updatedSession are the same reference
      expect(updatedSession).toHaveLength(5);
      expect(updatedSession[3]).toEqual({ role: 'user', content: payload.message });
      expect(openaiMock.chat.completions.create).toHaveBeenCalledTimes(2);
    });

    it('should call OpenAI API with correct parameters', async () => {
      const payload = { message: 'Test message', email: 'j_esteban96@hotmail.com' };

      await service.postMessage(payload);

      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ role: 'user', content: payload.message }),
        ]),
      }));
      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gpt-4.1-mini',
      }));
      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        tools: expect.any(Array),
      }));
      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        tool_choice: 'auto',
      }));
      expect(openaiMock.chat.completions.create).toHaveBeenCalledWith(expect.objectContaining({
        temperature: 0.2,
        top_p: 1,
      }));
    });
  });
});
