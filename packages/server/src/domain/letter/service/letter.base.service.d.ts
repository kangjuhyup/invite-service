export declare abstract class LetterBaseService {
    private readonly _thumbnailBucket;
    get thumbnailBucket(): string;
    private readonly _backGroundBucket;
    get backGroundBucket(): string;
    private readonly _componentBucket;
    get componentBucket(): string;
    private readonly _letterBucket;
    get letterBucket(): string;
    private readonly _urlExpires;
    get urlExpires(): number;
    constructor();
}
