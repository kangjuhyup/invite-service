import { DynamicModule, Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserStrategy } from './strategy/user.strategy';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({})
export class AuthModule {
  static forRootAsync(options: {
    secret: string;
    expiresIn: string;
  }): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: options.secret,
          signOptions: {
            expiresIn: options.expiresIn,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: UserStrategy,
          useFactory: (user: UserService) =>
            new UserStrategy(user, options.secret),
          inject: [UserService],
        },
      ],
    };
  }
}
