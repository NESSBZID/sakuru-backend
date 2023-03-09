import { Module } from '@nestjs/common';
import { UsersServiceV1 } from './users.service';
import { UsersControllerV1 } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersServiceV1],
  controllers: [UsersControllerV1],
})
export class UsersModuleV1 {}
