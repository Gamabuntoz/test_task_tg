import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../security/guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDTO, AuthResultDTO } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Authorization by login and pass',
  })
  @ApiBody({
    type: AuthDTO,
    required: true,
    description: 'Login and pass',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: AuthResultDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Incorrect login or password',
  })
  async login(@Body() authDTO: AuthDTO) {
    const result: AuthResultDTO = await this.authService.userLogin(authDTO);
    return { accessToken: result.accessToken };
  }
}
