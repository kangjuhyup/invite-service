import { HttpService } from "@nestjs/axios";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as jwt from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa';
import { firstValueFrom } from "rxjs";
@Injectable()
export class GoogleService {

    private logger = new Logger(GoogleService.name);
    
    private GOOGLE_OAUTH_URL = 'https://oauth2.googleapis.com/token'
    private GOOGLE_KEYS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
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
        this.logger.debug(`code : ${code}`)
        this.logger.debug(JSON.stringify({
            client_id : this.GOOGLE_CLIENT_ID,
            client_secret : this.GOOGLE_CLIENT_SECRET,
            redirect_uri : this.GOOGLE_CALLBACK_URL,
        }))
        if(!code) throw new UnauthorizedException('AuhorizationCode required')
        const { data } = await firstValueFrom(this.http.post<{
            id_token : string,
        }>(this.GOOGLE_OAUTH_URL,{
            code,
            client_id : this.GOOGLE_CLIENT_ID,
            client_secret : this.GOOGLE_CLIENT_SECRET,
            redirect_uri : this.GOOGLE_CALLBACK_URL,
            grant_type : 'authorization_code'
        })).catch(err => {
            this.logger.error(err);
            throw err;
        })

        const { id_token: idToken } = data;
        const decoded = await this.verifyIdToken(idToken);

        const email = decoded?.email;
        if (!email) {
            throw new Error('Email not found in id_token');
        }
        return email;
    }

    private async verifyIdToken(idToken: string): Promise<{ email?: string }> {
        const client = jwksClient({
          jwksUri: this.GOOGLE_KEYS_URL,
        });
    
        // `kid`로 공개 키 가져오기
        const decodedHeader = jwt.decode(idToken, { complete: true });
        const kid = decodedHeader?.header?.kid;
    
        if (!kid) {
          throw new Error('Key ID (kid) not found in id_token header');
        }
    
        const key = await new Promise<string>((resolve, reject) => {
          client.getSigningKey(kid, (err, key) => {
            if (err) return reject(err);
            resolve(key.getPublicKey());
          });
        });
    
        return jwt.verify(idToken, key, {
          algorithms: ['RS256'],
        }) as { email?: string };
      }
}