import { ApiProperty } from '@nestjs/swagger';

class AssistantMessage {
  @ApiProperty({ example: 'assistant' })
  role: string;

  @ApiProperty({ example: '350 Euros are approximately 563.14 Canadian Dollars.' })
  content: string;

  @ApiProperty({ example: null })
  refusal: string | null;

  @ApiProperty({ example: [] })
  annotations: any[];
}

export class AssistantResponseDto {
  @ApiProperty({ example: 0 })
  index: number;

  @ApiProperty({ type: AssistantMessage })
  message: AssistantMessage;

  @ApiProperty({ example: null })
  logprobs: any;

  @ApiProperty({ example: 'stop' })
  finish_reason: string;
}

export class CustomErrorResponseDto {
  @ApiProperty({
    example: '2025-07-26T20:45:01.598Z',
    description: 'Timestamp when the error occurred',
  })
  timestamp: string;

  @ApiProperty({
    example: '/chat',
    description: 'Path where the error occurred',
  })
  path: string;

  @ApiProperty({
    example: false,
    description: 'Indicates that the request failed',
  })
  response: boolean;

  @ApiProperty({
    example: 'An error occurred while processing the post message request.',
    description: 'Error message',
  })
  error: string;

  @ApiProperty({
    example: 500,
    description: 'HTTP status code of the error',
  })
  code: number;
}