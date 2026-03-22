import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createdResponse, successResponse } from 'src/common/utils/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; role: any },
  ) {
    const user = await this.authService.register(
      body.email,
      body.password,
      body.role,
    );
    
    return createdResponse(user);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const user = await this.authService.login(body.email, body.password);
    
    return successResponse(user);
  }
}