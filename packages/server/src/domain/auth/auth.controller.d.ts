import { SignRequest } from './dto/sign';
import { AuthService } from './auth.service';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(dto: SignRequest, res: Response): Promise<{
        result: boolean;
    }>;
    signIn(dto: SignRequest, res: Response): Promise<{
        result: boolean;
    }>;
    signOut(req: any): Promise<{
        result: boolean;
    }>;
    deleteAccount(dto: SignRequest): Promise<{
        result: boolean;
    }>;
}
