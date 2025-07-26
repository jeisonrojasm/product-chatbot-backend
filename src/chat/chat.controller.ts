import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageChatDto } from './dto/send-message-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  async postMessage(@Body() payload: SendMessageChatDto) {
    return this.chatService.postMessage(payload)
  }
}
