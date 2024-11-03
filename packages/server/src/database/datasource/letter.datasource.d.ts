import { DataSource } from 'typeorm';
export declare const LetterDataSource: (param: {
    type: any;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize: boolean;
}) => DataSource;
