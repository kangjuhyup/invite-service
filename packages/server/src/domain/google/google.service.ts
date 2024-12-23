import { HttpService } from "@nestjs/axios";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { verify } from 'jsonwebtoken'
import { firstValueFrom } from "rxjs";
@Injectable()
export class GoogleService {

    private GOOGLE_OAUTH_URL = 'https://oauth2.googleapis.com/token'
    private GOOGLE_CLIENT_ID : string;
    private GOOGLE_CLIENT_SECRET : string;
    private GOOGLE_CALLBACK_URL : string;

    constructor(
        private readonly http : HttpService,
        private readonly config: ConfigService
    ) {
        this.GOOGLE_CLIENT_ID = config.get<string>('GOOGLE_CLIENT_ID');
        this.GOOGLE_CLIENT_SECRET = config.get<string>('GOOGLE_CLIENT_SECRET')
        this.GOOGLE_CALLBACK_URL = config.get<string>('GOOGLE_CALLBACK_URL')
    }

    /**
     * 구글 OAuth 로 authCode 를 보내 idToken 획득 후 email 추출
     * @param code 
     * @returns 
     */
    async getEmailFromCode(code: string) : Promise<string> {
        if(!code) throw new UnauthorizedException('AuhorizationCode required')
        const { data } = await firstValueFrom(this.http.post<{
            id_token : string,
        }>(this.GOOGLE_OAUTH_URL,{
            code,
            client_id : this.GOOGLE_CLIENT_ID,
            client_secret : this.GOOGLE_CLIENT_SECRET,
            redirect_uri : this.GOOGLE_CALLBACK_URL,
            grant_type : 'authorization_code'
        }))
        const { id_token : idToken } = data;
        const decoded = verify(idToken, '', { complete: true }) as {
            payload: { email?: string };
        };
        const email = decoded?.payload?.email;
        if (!email) {
            throw new Error('Email not found in id_token');
        }
        return email;
    }
}