import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { Inject, Injectable } from '@nestjs/common';
import * as mongodb from 'mongodb';

@Injectable()
export class PostService {
  constructor(@Inject('DATABASE_CONNECTION') private db: mongodb.Db) { }

  create(createPostDto: CreatePostDto) {

    return 'This action adds a new post';
  }

  async findAll() {
    return await this.db.collection('posts').find({}).toArray();
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
