import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseHelper {
  success(data?: any, message: string = 'success', code: number = 200,) {
    const response: any = {
      success: true,
      code,
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    return response;
  }

  error(message: string, code: number = 400) {
    return {
      success: false,
      code,
      message,
    };
  }
}
