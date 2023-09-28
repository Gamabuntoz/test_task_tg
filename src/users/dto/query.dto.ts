import { ApiProperty } from '@nestjs/swagger';

export class QueryDTO {
  @ApiProperty({
    description: 'Sort field',
    example: 'name:ASC',
    default: 'id:ASC',
    enum: ['name', 'login', 'email', 'age'],
    required: false,
    nullable: true,
  })
  sortBy: string;

  @ApiProperty({
    description:
      'Filter field, can contain data for name, login or email fields',
    example: 'Vova',
    required: false,
    nullable: true,
  })
  filter: string;
}
