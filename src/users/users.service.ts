import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUserDTO } from './dto/get-user.dto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { QueryDTO } from './dto/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: typeof User,
  ) {}

  async findAllUsers(queryDTO: QueryDTO): Promise<User[]> {
    const order = queryDTO.sortBy
      ? [queryDTO.sortBy.split(':')]
      : [['id', 'ASC']];
    const where = queryDTO.filter
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${queryDTO.filter}%` } },
            { login: { [Op.like]: `%${queryDTO.filter}%` } },
            { email: { [Op.like]: `%${queryDTO.filter}%` } },
          ],
        }
      : {};

    return await this.userRepository.findAll({
      order: order as any,
      where,
    });
  }

  async findOneByLogin(login: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { login } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async createNewUser(createUserDTO: CreateUserDTO) {
    const user = await this.findOneByLogin(createUserDTO.login);
    if (user) {
      throw new BadRequestException('User with this login already exist');
    }
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      createUserDTO.password,
      passwordSalt,
    );
    const newUserData: CreateUserDTO = {
      name: createUserDTO.name ? createUserDTO.name : null,
      password: passwordHash,
      email: createUserDTO.email ? createUserDTO.email : null,
      age: createUserDTO.age ? createUserDTO.age : null,
      login: createUserDTO.login,
    };
    const newUser = await this.userRepository.create({ ...newUserData });
    return this.createUserUI(newUser);
  }

  async updateUserById(id: number, updateUserDTO: UpdateUserDTO) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDTO.login) {
      const checkLogin = await this.findOneByLogin(updateUserDTO.login);
      if (checkLogin) {
        throw new BadRequestException('User with this login already exist');
      }
    }
    let passwordHash;
    if (updateUserDTO.password) {
      const passwordSalt = await bcrypt.genSalt(10);
      passwordHash = await this._generateHash(
        updateUserDTO.password,
        passwordSalt,
      );
    }
    console.log(updateUserDTO);
    user.name = updateUserDTO.name ? updateUserDTO.name : user.name;
    user.password = passwordHash ? passwordHash : user.password;
    user.email = updateUserDTO.email ? updateUserDTO.email : user.email;
    user.age = updateUserDTO.age ? updateUserDTO.age : user.age;
    user.login = updateUserDTO.login ? updateUserDTO.login : user.login;

    await user.save();
    return this.createUserUI(user);
  }

  async deleteUserById(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.destroy({
      where: { id },
    });

    return true;
  }

  createUserUI(user: User): GetUserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      login: user.login,
    };
  }
}
