import { ApiProperty } from '@nestjs/swagger';

export class GetUserDTO {
  @ApiProperty({
    description: 'User ID',
    nullable: false,
  })
  id: number;
  @ApiProperty({
    description: 'User name',
    nullable: false,
  })
  name: string;
  @ApiProperty({
    description: 'User email',
    nullable: false,
  })
  email: string;
  @ApiProperty({
    description: 'User age',
    nullable: false,
  })
  age: number;
  @ApiProperty({
    description: 'User login',
    nullable: false,
  })
  login: string;
}
