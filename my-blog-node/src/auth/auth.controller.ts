import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { LocalAuthGuard } from './local_auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'user login' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() _: LoginDto) {
    return this.authService.login(_);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/checkToken')
  async checkToken(@Request() req) {
    return req.user;
  }
}
