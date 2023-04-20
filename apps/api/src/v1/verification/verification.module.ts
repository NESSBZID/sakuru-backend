import { Module } from '@nestjs/common';
import { VerificationServiceV1 } from './verification.service';
import { VerificationGatewayV1 } from './verification.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [VerificationServiceV1, VerificationGatewayV1],
})
export class VerificationModuleV1 {}
