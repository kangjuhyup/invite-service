import { LetterEntity } from './letter';
import { DefaultEntity } from './default';
export declare class UserEntity extends DefaultEntity {
    userId: string;
    nickName: string;
    phone: string;
    password: string;
    letter?: LetterEntity[];
}
