import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createdResponse, successResponse } from 'src/common/utils/response';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({
    schema: {
      example: {
        email: 'test@example.com',
        password: '123456',
        role: 'BUYER',
      },
    },
  })
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

  @ApiBody({
    schema: {
      example: {
        email: 'test@example.com',
        password: '123456',
      },
    },
  })
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const user = await this.authService.login(body.email, body.password);
    
    return successResponse(user);
  }
}