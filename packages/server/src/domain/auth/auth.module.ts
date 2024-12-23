import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserAccessStrategy } from '@app/jwt/strategy/user.access.strategy';
import { UserRefreshStrategy } from '@app/jwt/strategy/user.refresh.strategy';
import { AuthFacade } from './auth.facade';
import { MailService } from './service/mail.service';
import { SessionService } from './service/session.service';
import { GoogleStrategy } from '@app/jwt/strategy/google.strategy';

interface AuthModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => { secret: string; expiresIn: string };
  isGlobal?: boolean;
}
//TODO : Refresh 토큰 추가
@Module({})
export class AuthModule {
  static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        PassportModule.register({ session: false }),
        JwtModule.registerAsync({
          imports: options.imports || [],
          useFactory: async (...args: any[]) => {
            const { secret, expiresIn } = options.useFactory(...args);
            return {
              secret,
              signOptions: {
                expiresIn,
              },
            };
          },
          inject: options.inject,
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: UserAccessStrategy,
          useFactory: (userService: UserService, ...args: any[]) => {
            const { secret } = options.useFactory(...args);
            return new UserAccessStrategy(userService, secret);
          },
          inject: [UserService, ...(options.inject || [])],
        },
        {
          provide: UserRefreshStrategy,
          useFactory: (userService: UserService, ...args: any[]) => {
            const { secret } = options.useFactory(...args);
            return new UserRefreshStrategy(userService, secret);
          },
          inject: [UserService, ...(options.inject || [])],
        },
        GoogleStrategy,
        AuthService,
        MailService,
        SessionService,
        AuthFacade,
      ],
    };
  }
}
