import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as mongodb from 'mongodb';

import { genSalt, hash, compare } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @Inject('DATABASE_CONNECTION') private db: mongodb.Db,
    private readonly jwtService: JwtService
  ) { }

  async createUser(dto: CreateAuthDto) {
    const salt = await genSalt(10);
    console.log(`dto`, dto);
    console.log(`salt`, salt);
    return await this.db.collection('users').insertOne(
      {
        email: dto.login,
        passwordHash: await hash(dto.password, salt)
      }
    );
  }

  async findUser(email: string) {
    console.log(`email`, email);
    return (await this.db.collection('users').aggregate([
      {
        $match: {
          email: email
        }
      }
    ]).toArray())[0];
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    console.log(`email`, email);
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

}
