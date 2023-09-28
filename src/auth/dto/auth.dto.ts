import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user login', nullable: false })
  login: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'user password', nullable: false })
  password: string;
}

export class AuthResultDTO {
  @ApiProperty({ description: 'JWT access token', nullable: false })
  accessToken: string;
}
