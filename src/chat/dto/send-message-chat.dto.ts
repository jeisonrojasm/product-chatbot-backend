import { IsString } from 'class-validator';

export class SendMessageChatDto {
  @IsString()
  message: string;
}