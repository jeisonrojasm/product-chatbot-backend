import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendMessageChatDto {

  @ApiProperty({
    example: 'How many Canadian Dollars are 350 Euros',
    description: 'User input message to be processed by the assistant'
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'j_esteban96@hotmail.com',
    description: 'Email address to associate the conversation'
  })
  @IsEmail()
  email: string;
}