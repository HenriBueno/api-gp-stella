import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthResponse } from '../types/user.types';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiCreatedResponse({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOkResponse({ type: CreateUserDto })
  async login(
    @Body() dto: { email: string; password: string },
  ): Promise<AuthResponse> {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
