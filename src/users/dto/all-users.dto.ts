import { ApiProperty } from '@nestjs/swagger';
import { GetUserDTO } from './get-user.dto';

export class AllUsersDTO {
  @ApiProperty({
    description: 'Array with users',
    nullable: false,
    type: GetUserDTO,
    isArray: true,
  })
  users: GetUserDTO[];
}
