import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UserStrategy } from '@app/jwt/strategy/user.strategy';

interface AuthModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => { secret: string; expiresIn: string };
  isGlobal?: boolean;
}

@Module({})
export class AuthModule {
  static forRootAsync(options: AuthModuleAsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        PassportModule,
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
          provide: UserStrategy,
          useFactory: (userService: UserService, ...args: any[]) => {
            const { secret } = options.useFactory(...args);
            return new UserStrategy(userService, secret);
          },
          inject: [UserService, ...(options.inject || [])],
        },
        AuthService,
      ],
    };
  }
}
