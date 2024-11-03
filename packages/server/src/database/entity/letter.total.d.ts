import { DefaultEntity } from './default';
import { LetterEntity } from './letter';
export declare class LetterTotalEntity extends DefaultEntity {
    letterId: number;
    attendantCount: number;
    viewCount: number;
    commentCount: number;
    letter: LetterEntity;
}
