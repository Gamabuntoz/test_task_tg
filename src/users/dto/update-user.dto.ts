import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'User name',
    nullable: true,
  })
  name: string;
  @IsString()
  @IsOptional()
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
  @IsOptional()
  @ApiProperty({
    description: 'User login',
    nullable: false,
  })
  login: string;
}
