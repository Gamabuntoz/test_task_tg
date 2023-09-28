import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthDTO, AuthResultDTO } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    protected jwtService: JwtService,
  ) {}

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async checkCredentials(login: string, password: string): Promise<boolean> {
    const user: User = await this.usersService.findOneByLogin(login);
    if (!user) return false;
    const passwordHash = await this._generateHash(
      password,
      user.password.slice(0, 29),
    );
    return user.password === passwordHash;
  }

  async userLogin(authDTO: AuthDTO): Promise<AuthResultDTO> {
    const user: User = await this.usersService.findOneByLogin(authDTO.login);

    return await this.createToken(user.id);
  }

  async createToken(id: string): Promise<AuthResultDTO> {
    const payload = {
      id,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWTKEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });

    return {
      accessToken,
    };
  }
}
