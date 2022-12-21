import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { text: 'The textile store API is working' };
  }
}
