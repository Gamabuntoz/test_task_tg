import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User name',
    nullable: true,
  })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User password',
    nullable: false,
  })
  password: string;
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'User email',
    nullable: true,
  })
  email: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'User age',
    nullable: true,
  })
  age: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User login',
    nullable: false,
  })
  login: string;
}
