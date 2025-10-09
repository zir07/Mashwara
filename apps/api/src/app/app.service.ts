import { Injectable } from '@nestjs/common';
import { User } from '@mashwara/types';

@Injectable()
export class AppService {
  getData(): { message: string; user: Partial<User> } {
    return {
      message: 'Hello API',
      user: {
        email: 'test@iba.edu.pk',
        role: 'student'
      }
    };
  }
}
