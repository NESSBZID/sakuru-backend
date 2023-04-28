import { Module } from '@nestjs/common';
import { VerificationGateway } from './verification.gateway';
import { VerificationService } from './verification.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [VerificationGateway],
  providers: [VerificationService],
})
export class VerificationModule {}
