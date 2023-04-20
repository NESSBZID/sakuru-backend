import { Module } from '@nestjs/common';
import { VerificationServiceV1 } from './verification.service';

@Module({
  providers: [VerificationServiceV1],
})
export class VerificationModuleV1 {}
