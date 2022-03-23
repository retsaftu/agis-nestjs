import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { DatabaseModule } from 'src/database/database.module';

import { Inject, Injectable } from '@nestjs/common';
import * as mongodb from 'mongodb';

@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService]
})


@Injectable()
export class PostModule {
  constructor(@Inject('DATABASE_CONNECTION') private db: mongodb.Db) { }

  async getAllTodos(): Promise<any[]> {
    return await this.db.collection('todos').find({}).toArray();
  }
}