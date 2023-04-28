import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthControllerV1 } from './auth.controller';
import { AuthServiceV1 } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from '@shared/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '31d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthServiceV1, LocalStrategy, JwtStrategy],
  controllers: [AuthControllerV1],
})
export class AuthModuleV1 {}
