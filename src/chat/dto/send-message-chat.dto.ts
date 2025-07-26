import { IsEmail, IsString } from 'class-validator';

export class SendMessageChatDto {
  @IsString()
  message: string;

  @IsEmail()
  email: string;
}