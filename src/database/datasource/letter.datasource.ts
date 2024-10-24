import { DataSource } from 'typeorm';

export const LetterDataSource =(param : {
  type : any,
  host : string,
  port : number,
  username : string,
  password : string,
  database : string,
  synchronize : boolean
}) => new DataSource({
  ...param,
  entities: [__dirname + '/../entity/*.{ts,js}'],
  migrations: [__dirname + '/../migration/*.{ts,js}'],
});
