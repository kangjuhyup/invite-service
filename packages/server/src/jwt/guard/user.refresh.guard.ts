import {
    Injectable,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class UserRefreshGuard extends AuthGuard('user-refresh') {}
  