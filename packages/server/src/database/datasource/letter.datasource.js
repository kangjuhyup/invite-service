"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterDataSource = void 0;
const typeorm_1 = require("typeorm");
const LetterDataSource = (param) => new typeorm_1.DataSource({
    ...param,
    entities: [__dirname + '/../entity/*.{ts,js}'],
    migrations: [__dirname + '/../migration/*.{ts,js}'],
});
exports.LetterDataSource = LetterDataSource;
//# sourceMappingURL=letter.datasource.js.map