import { ApiProperty } from '@nestjs/swagger';

class ErrorResponse {
  @ApiProperty({
    description: '에러 코드',
    example: 'ERR_001',
  })
  code: string;

  @ApiProperty({
    description: '에러 메시지',
    example: '잘못된 요청입니다.',
  })
  message: string;
}

export class HttpResponse<T> {
  @ApiProperty({
    description: '응답 결과',
    example: true,
  })
  result: boolean;

  @ApiProperty({
    description: '성공 시 반환되는 데이터',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: '오류 발생 시 반환되는 에러 정보',
    required: false,
    type: ErrorResponse,
  })
  error?: ErrorResponse;
}
